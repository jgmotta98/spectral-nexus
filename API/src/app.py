from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import sqlite3
import multiprocessing as mp
from collections import OrderedDict
import time
from contextvars import ContextVar
import json

from band_filter import get_spectra_filtered_list
from input_manipulation import input_baseline_correction
from similarity_algorithm import local_algorithm
from generate_report import create_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = '../uploads'
SPECTRAL_DB_PATH = '../database/spectral_database.db'
HOME_DB_PATH = '../database/home_database.db'
REPORT_DB_PATH = '../database/report_database.db'

class FormData(BaseModel):
    textBoxValue: str
    isToggled: bool
    selectedOption: str
    sliderValue: int
    lambda_: int
    poder: int
    maxiter: int


home_info_context: ContextVar[dict] = ContextVar('home_info', default={
    "textBoxValue": "",
    "isToggled": False,
    "selectedOption": "1",
    "sliderValue": 25,
    "lambda_": 100,
    "porder": 1,
    "maxiter": 15
})

report_info_context: ContextVar[dict] = ContextVar('report_info', default={
    "components_data_filter": [],
    "input_list_dict": [],
    "spectral_list": [],
    "input_df": [],
    "final_result": [],
    "textBoxValue": "",
    "isToggled": False,
    "sliderValue": 0,
    "selectedOption": ""
})


def get_home_info_context():
    return home_info_context.get()


def get_report_info_context():
    return report_info_context.get()


def get_unique_spectral_names(db_path: str) -> list:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT DISTINCT SpectraNames.name 
        FROM SpectraNames
        INNER JOIN SpectraData ON SpectraNames.id = SpectraData.name_id
    ''')

    names = [row[0] for row in cursor.fetchall()]
    conn.close()
    return names


def fetch_spectral_data(db_path: str, name: str) -> pd.DataFrame:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT SpectraNames.name, SpectraData.wavelength, SpectraData.intensity 
        FROM SpectraNames 
        INNER JOIN SpectraData ON SpectraNames.id = SpectraData.name_id
        WHERE SpectraNames.name = ?
    ''', (name,))

    data = cursor.fetchall()
    conn.close()

    df = pd.DataFrame(data, columns=['name', 'x', 'y'])
    return df


def parallelization_process(args) -> dict[str, float] | dict[str, pd.DataFrame]:
    name, spectral_filtered_input, spectral_db_path, band_distance_check = args
    # Fetch spectral data
    spectral_data = fetch_spectral_data(spectral_db_path, name)

    # Filtering
    spectral_filtered_database = get_spectra_filtered_list(spectral_data, band_distance_check)

    # Authoral Algorithm
    result_dict = local_algorithm(spectral_filtered_database, spectral_filtered_input, get_dataframe=False)

    return result_dict


def order_result_dict(result_list: list[dict[str, float]]) -> dict[str, float]:
    unified_dict: dict[str, float] = {}

    for d in result_list:
        unified_dict.update(d)

    final_result_dict = OrderedDict(sorted(unified_dict.items(), key=lambda x: x[1], reverse=True))
    final_result_dict = dict(list(final_result_dict.items())[:5])
    return final_result_dict


def get_filtered_data(spectral_list: list[pd.DataFrame], band_distance_check: int, 
                      spectral_filtered_input: tuple[pd.DataFrame, pd.DataFrame], get_input: bool = False) -> list[dict[str, float]]| list[dict[str, pd.DataFrame]]:
        return [local_algorithm(get_spectra_filtered_list(spectra, band_distance_check), 
                                spectral_filtered_input, 
                                get_dataframe=True, 
                                get_input=get_input) 
                                for spectra in spectral_list]


def convert_to_dict(data_list: list[dict[str, pd.DataFrame]]) -> dict[str, pd.DataFrame]:
    result_dict: dict[str, pd.DataFrame]  = {}
    for data in data_list:
        result_dict.update(data)
    return result_dict


def convert_json_to_dataframes(report_info):
    components_data_filter = {k: pd.DataFrame(v) for k, v in report_info["components_data_filter"].items()}
    input_list_dict = {k: pd.DataFrame(v) for k, v in report_info["input_list_dict"].items()}
    spectral_list = [pd.DataFrame(data) for data in report_info["spectral_list"].values()]
    input_df = pd.DataFrame([v for v in report_info["input_df"].values()][0])
    final_result = report_info["final_result"]

    return components_data_filter, input_list_dict, spectral_list, input_df, final_result


@app.post('/api/data')
async def receive_data(
    textBoxValue: str = Form(...),
    isToggled: bool = Form(...),
    selectedOption: str = Form(...),
    sliderValue: int = Form(...),
    lambda_: int = Form(...),
    porder: int = Form(...),
    maxiter: int = Form(...),
    file: UploadFile = File(...),
    home_info = Depends(get_home_info_context),
    report_info = Depends(get_report_info_context)
):
    print(file)
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format")

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    start_time = time.perf_counter()

    home_info.update({
        "textBoxValue": textBoxValue,
        "isToggled": isToggled,
        "selectedOption": selectedOption,
        "sliderValue": sliderValue,
        "lambda_": lambda_,
        "porder": porder,
        "maxiter": maxiter
    })
    home_info_context.set(home_info)

    input_df = pd.read_csv(file_path, sep=';')
    unique_names = get_unique_spectral_names(SPECTRAL_DB_PATH)

    spectral_input = input_baseline_correction([textBoxValue, input_df], lambda_, porder, maxiter)
    spectral_filtered_input = get_spectra_filtered_list(spectral_input, sliderValue)

    if isToggled:
        cores = int(selectedOption)
        with mp.Pool(processes=cores) as pool:
            result_list = pool.map(parallelization_process, [(name, spectral_filtered_input, SPECTRAL_DB_PATH, 
                                                            sliderValue) for name in unique_names])
    else:
        result_list: list[dict[str, float]] = []
        for name in unique_names:
            spectral_data = fetch_spectral_data(SPECTRAL_DB_PATH, name)

            # Filtering
            spectral_filtered_database = get_spectra_filtered_list(spectral_data, sliderValue)
            
            # Authoral Algorithm
            result_dict = local_algorithm(spectral_filtered_database, spectral_filtered_input, get_dataframe=False)

            result_list.append(result_dict)

    final_result = order_result_dict(result_list)
    spectral_list = [fetch_spectral_data(SPECTRAL_DB_PATH, spectra) for spectra in final_result.keys()]

    components_data_filter_list = get_filtered_data(spectral_list, sliderValue, spectral_filtered_input, get_input=False)
    input_list = get_filtered_data(spectral_list, sliderValue, spectral_filtered_input, get_input=True)
    
    components_data_filter: dict[str, pd.DataFrame] = convert_to_dict(components_data_filter_list)
    input_list_dict: dict[str, pd.DataFrame] = convert_to_dict(input_list)
    
    input_df = {v.iloc[0, 0]: v for v in [input_df]}
    spectral_list = {v.iloc[0, 0]: v for v in spectral_list}
    
    report_info.update({
        "components_data_filter": {k: v.to_dict() for k, v in components_data_filter.items()},
        "input_list_dict": {k: v.to_dict() for k, v in input_list_dict.items()},
        "spectral_list": {k: v.to_dict() for k, v in spectral_list.items()},
        "input_df": {k: v.to_dict() for k, v in input_df.items()},
        "final_result": final_result,
        "textBoxValue": textBoxValue,
        "isToggled": isToggled,
        "sliderValue": sliderValue,
        "selectedOption": selectedOption
    })
    report_info_context.set(report_info)

    print(f'Extraction and filtering: {time.perf_counter() - start_time} seconds.')
    os.remove(file_path)

    response = {'status': 'success'}

    return response


@app.post('/api/report')
async def download_report(report_info = Depends(get_report_info_context)):
    components_data_filter, input_list_dict, spectral_list, input_df, final_result = convert_json_to_dataframes(report_info)
    print(input_df)
    output = os.path.join(UPLOAD_FOLDER, 'report.pdf')
    create_graph(components_data_filter, input_list_dict, spectral_list, input_df, final_result, 
                 report_info['textBoxValue'], UPLOAD_FOLDER, report_info['sliderValue'], int(report_info['selectedOption']))
    
    return FileResponse(output, media_type='application/pdf', filename='report.pdf')


@app.get('/api/data')
def get_home_info(home_info = Depends(get_home_info_context)):
    return home_info


@app.get('/api/report')
def get_report_info(report_info = Depends(get_report_info_context)):
    return report_info