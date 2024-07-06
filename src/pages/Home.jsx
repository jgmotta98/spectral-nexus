// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileSearch from '../components/FileSearch';
import TextBox from '../components/TextBox';
import ToggleSwitch from '../components/ToggleSwitch';
import ComboBox from '../components/ComboBox';
import SliderComponent from '../components/Slider';
import NumberInput from '../components/NumberInput';
import '../App.css';

const Home = () => {
    const [file, setFile] = useState(null);
    const [textBoxValue, setTextBoxValue] = useState("");
    const [isToggled, setIsToggled] = useState(false);
    const [selectedOption, setSelectedOption] = useState("1");
    const [sliderValue, setSliderValue] = useState(25);
    const [loading, setLoading] = useState(false);
    const [lambda_, setLambda] = useState('100');
    const [porder, setPorder] = useState('1');
    const [maxiter, setMaxIter] = useState('15');
    const apiUrl = 'http://127.0.0.1:8000/api/data';
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('analysisDone', 'false');

        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setTextBoxValue(data.textBoxValue);
                setIsToggled(data.isToggled);
                setSelectedOption(data.selectedOption);
                setSliderValue(data.sliderValue);
                setLambda(data.lambda_);
                setPorder(data.porder);
                setMaxIter(data.maxiter);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setTextBoxValue(selectedFile.name.replace('.csv', ''));
    };

    const handleTextBoxChange = (value) => {
        setTextBoxValue(value);
    };

    const handleToggleChange = () => {
        setIsToggled(prevState => !prevState);
    };

    const handleComboBoxChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSliderChange = (value) => {
      setSliderValue(value);
    };

    const handleNumberChange1 = (value) => {
        setLambda(value);
    };

    const handleNumberChange2 = (value) => {
        setPorder(value);
    };

    const handleNumberChange3 = (value) => {
        setMaxIter(value);
    };

    const sendDataToBackend = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('textBoxValue', textBoxValue);
        formData.append('isToggled', isToggled);
        formData.append('selectedOption', selectedOption);
        formData.append('sliderValue', sliderValue);
        formData.append('lambda_', lambda_);
        formData.append('porder', porder);
        formData.append('maxiter', maxiter);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the request.');
            }

            const data = await response.json();
            console.log('Data received from backend:', data);

            localStorage.setItem('analysisDone', 'true');

            navigate('/report');
        } catch (error) {
            console.error('Error sending data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='general'>
            <div className='first-line'>
                <FileSearch className="file-search" onFileSelect={handleFileSelect} />
                <TextBox className="text-box" value={textBoxValue} onChange={handleTextBoxChange} />
            </div>
            <div className='advanced-div'>
                <div className='second-line'>
                    <ToggleSwitch className="toggle-switch" isToggled={isToggled} onToggle={handleToggleChange} />
                    <ComboBox className="combo-box" selectedOption={selectedOption} onSelectChange={handleComboBoxChange} />
                </div>
                <SliderComponent className="slider-component" value={sliderValue} onChange={handleSliderChange} />
                <div className='third-line'>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={{display: 'flex', alignSelf: 'flex-start'}}>Lambda:</span>
                        <NumberInput className="number-input" value={lambda_} onChange={handleNumberChange1} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={{display: 'flex', alignSelf: 'flex-start'}}>P order</span>
                        <NumberInput className="number-input" value={porder} onChange={handleNumberChange2} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={{display: 'flex', alignSelf: 'flex-start'}}>Max iterações</span>
                        <NumberInput className="number-input" value={maxiter} onChange={handleNumberChange3} />
                    </div>
                </div>
            </div>
            <button className="analyze-button" onClick={sendDataToBackend}>Analisar composto</button>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Home;
