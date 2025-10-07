import React, { useState, useRef, useEffect, useMemo } from 'react';
import InputGroup from './InputGroup';
import HelpModal from './HelpModal';
import InteractiveGraph from './InteractiveGraph';
import ValidationModal from './ValidationError';
import LogoImage from '../assets/spectral-nexus-icon-thicker.ico';
import WIN98_LOADING_GIF from '../assets/loading-windows98.gif'; 
import { useTranslation } from 'react-i18next';

const AnalysisForm = () => {
  const { t, i18n } = useTranslation("global");
  const currentLanguageCode = i18n.language ? i18n.language.toUpperCase().split('-')[0]: 'PT';

  const [isExpanded, setIsExpanded] = useState(false);
  //const [language, setLanguage] = useState('PT-BR');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const fileInputRef = useRef(null); 
  const menuRef = useRef(null);
  const [maxCores, setMaxCores] = useState(4);
  const [formData, setFormData] = useState({
    fileName: '',
    compoundName: '',
    coreNumber: 1,
    useParallelization: true,
    lambda: 100,
    pOrder: 1,
    maxIterations: 15,
    analysisRange: 25,
  });
  const [fileName, setFileName] = useState(formData.fileName || '');
  const linkHtml = useMemo(() => `
    <p>
      ${t('translation.help_publications')}
      <br>
      <a 
        href="https://pantheon.ufrj.br/handle/11422/26302" 
        target="_blank" 
        rel="noopener noreferrer"
        style="color: #0000FF; text-decoration: underline;"
      >
        ${t('translation.help_tcc_link')}
      </a>
    </p>
  `, [t]);

  const helpText = useMemo(() => `
    <p>
      ${t('translation.help_developed_by')}
      <a 
        href="https://github.com/Guigo1008" 
        target="_blank" 
        rel="noopener noreferrer"
        style="color: #0000FF; text-decoration: underline;"
      >
        Guigo1008
      </a> ${t('translation.help_and')} 
      <a 
        href="https://github.com/Toribrrs" 
        target="_blank" 
        rel="noopener noreferrer"
        style="color: #0000FF; text-decoration: underline;"
      >
        Toribrrs
      </a>.
    </p>
    <br>
    ${linkHtml}
  `, [t, linkHtml]);

  const lambdaText = t('translation.info_lambda');

  const porderText = t('translation.info_porder');

  const maxIterText = t('translation.info_max_iter');

  const analysisText = t('translation.info_analysis_range');

  const infoTextMap = {
    lambda: lambdaText,
    pOrder: porderText,
    maxIterations: maxIterText,
  };
  const coresOptions = useMemo(() => Array.from({ length: maxCores }, (_, i) => i + 1), [maxCores]);
  const defaultOption = String(maxCores);
  const [isLoading, setLoading] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [finalResult, setFinalResult] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);

  const options = Object.keys(finalResult).map((key) => ({ value: key, label: key }));

  const selectedInput = reportData?.textBoxValue || {};
  const selectedComponentData = reportData?.components_data_filter?.[selectedKey] || {};
  const selectedInputListData = reportData?.input_list_dict?.[selectedKey] || {};
  const selectedComponentSpectra = reportData?.spectral_list?.[selectedKey] || {};
  const selectedInputListSpectra = reportData?.input_df?.[selectedInput] || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
        if (isLoading) {
            document.body.classList.add('cursor-wait-override'); 
        } else {
            document.body.classList.remove('cursor-wait-override');
        }
        
        return () => {
            document.body.classList.remove('cursor-wait-override');
        };
    }, [isLoading]);

  useEffect(() => {
        const fetchCores = async () => {
            const API_URL = 'http://localhost:8000/api/cpu-cores';
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    const realCores = Math.max(1, data.cores);
                    setMaxCores(realCores); 
                    setFormData(prevData => ({
                        ...prevData,
                        coreNumber: String(realCores),
                    }));
                }
            } catch (error) {
                console.warn("Falha ao obter a contagem de núcleos do servidor. Usando padrão (4).", error);
                setFormData(prevData => ({
                    ...prevData,
                    coreNumber: '4', 
                }));
            }
        };
        fetchCores();
    }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleModal = () => {
        setIsHelpModalOpen(prev => !prev);
    };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
        setFileName(file.name);
        const newCompoundName = file.name.replace(/\.csv$/i, '');
        handleChange({
            target: {
                name: 'compoundName',
                value: newCompoundName,
            }
        });
        
        // 4. Coloque aqui a lógica para importar ou processar o arquivo CSV
        console.log(`Arquivo ${file.name} pronto para importação. Campo Compound Name atualizado.`);
        
    } else {
        setFileName('');
        handleChange({
            target: {
                name: 'compoundName',
                value: '',
            }
        });
    }
  };

  useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

  const handleLanguageSelect = (newLang) => {
    i18n.changeLanguage(newLang.toLowerCase())
      .then(() => {
        setIsMenuOpen(false);
      })
      .catch(err => console.error("Falha ao mudar o idioma:", err));
  };

  const handleAnalyze = async (event) => {
      event.preventDefault();
      const file = fileInputRef.current.files[0];

      let errorMessage = '';

      if (!file) {
          errorMessage = t('translation.error_select_file');
      } else if (!formData.compoundName) {
          errorMessage = t('translation.error_compound_name');
      } else if (!formData.pOrder || formData.pOrder === '0') {
          errorMessage = t('translation.error_porder_zero');
      } else if (!formData.maxIterations || formData.maxIterations === '0') {
          errorMessage = t('translation.error_maxiter_zero');
      } else if (!formData.lambda || formData.lambda === '0') {
          errorMessage = t('translation.error_lambda_zero');
      }

      if (errorMessage) {
          setModalMessage(errorMessage);
          setIsModalOpen(true);
          return;
      }

      setLoading(true);
      setIsAnalysisComplete(false); 
      setIsExpanded(true);

      const dataToSend = new FormData();
      dataToSend.append('file', file);
      dataToSend.append('textBoxValue', formData.compoundName);
      dataToSend.append('isToggled', formData.useParallelization);
      dataToSend.append('selectedOption', parseInt(formData.coreNumber));
      dataToSend.append('sliderValue', parseInt(formData.analysisRange));
      dataToSend.append('lambda_', parseInt(formData.lambda)); 
      dataToSend.append('porder', parseInt(formData.pOrder));
      dataToSend.append('maxiter', parseInt(formData.maxIterations));

      const API_URL = 'http://localhost:8000/api/data';
      const REPORT_API_URL = 'http://localhost:8000/api/report';

      try {
          const analyzeResponse = await fetch(API_URL, {
              method: 'POST',
              body: dataToSend, 
          });

          if (!analyzeResponse.ok) {
              const errorData = await analyzeResponse.json();
              throw new Error(errorData.detail || `Erro HTTP na Análise: ${analyzeResponse.status}`);
          }

          const analyzeResult = await analyzeResponse.json();
          console.log('Análise concluída com sucesso:', analyzeResult);
          
          const reportResponse = await fetch(REPORT_API_URL);

          if (!reportResponse.ok) {
              throw new Error(`Erro HTTP ao buscar relatório: ${reportResponse.status}`);
          }

          const reportData = await reportResponse.json();
          
          setFinalResult(reportData.final_result);
          setReportData(reportData);
          setSelectedKey(Object.keys(reportData.final_result)[0]);
          
          setIsAnalysisComplete(true); 

      } catch (error) {
          console.error("Falha no processo de análise/relatório:", error.message);
          alert(`Erro na Análise: ${error.message}`);
          
          setIsExpanded(false);
          setIsAnalysisComplete(false);

      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados para Análise:', formData);
  };

  const calculateSliderPosition = (value, min, max) => {
    const range = max - min;
    const offsetValue = value - min;
    let percentage = (offsetValue / range) * 100;

    const correctionRange = 93.5;
    const startOffset = 3;

    let correctedPercentage = (percentage * correctionRange / 100) + startOffset;
    return `${correctedPercentage}%`; 
  };

  const handleReportDownload = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/report', {
      method: 'POST'
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <div className={`
          window mx-auto flex flex-col mt-20 transition-all duration-250 ease-in-out
          !h-[50rem] 
          
          /* Largura base e transição */
          w-[35rem] 
          ${isExpanded ? '!w-[110rem]' : ''} 
      `}>
        <div className="title-bar">
          <div className="logo"
          style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <img 
              src={LogoImage} 
              alt="logo-app"
              style={{ height: 'auto', maxWidth: '15%' }} 
            />
            <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>
              Spectral Nexus
            </p>
          </div>
          <div className="title-bar-controls">
            <button 
                className="help-button btn"
                onClick={toggleModal}
            >
                ?
            </button>
            
            {isHelpModalOpen && (
                <HelpModal 
                    text={helpText}
                    onClose={toggleModal}
                />
            )}
          </div>
        </div>

        <div className={`
            flex flex-row flex-grow py-4
            ${isExpanded ? 'divide-x divide-gray-400' : 'divide-x-0'}
        `}>
          <div className="flex-none p-4 !w-[35rem] flex flex-col justify-between h-full">
            <form onSubmit={handleSubmit} className="form-content flex flex-col justify-between h-full">
              <div className="space-y-14">
                
                <div className="file-upload-section w-full flex items-center">
                  <button 
                      onClick={() => fileInputRef.current.click()}
                      disabled={isLoading} 
                      className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''} mr-4`}
                  >
                    {t('translation.search_file')}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} 
                  />
                  
                  <span className="file-name-display flex-grow">
                    {fileName || (t('translation.no_file_chosen'))}
                  </span>
                </div>

                <InputGroup label={t('translation.compound_name')} name="compoundName" showInfoIcon={false}>
                  <input
                    type="text"
                    name="compoundName"
                    value={formData.compoundName}
                    onChange={handleChange}
                    placeholder={t('translation.name_placeholder')}
                    className="w-full"
                  />
                </InputGroup>

                <div className="field-row flex justify-between items-center w-full px-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="useParallelization"
                            name="useParallelization"
                            checked={formData.useParallelization}
                            onChange={handleChange}
                            className="w-auto"
                        />
                        <label htmlFor="useParallelization">{t('translation.use_parallelization')}</label>
                    </div>
                    
                    {formData.useParallelization && (
                        <div className="flex items-center space-x-2">
                            <label htmlFor="numCores">{t('translation.cores')}</label>
                            <select
                                id="numCores"
                                value={formData.coreNumber || defaultOption} 
                                onChange={handleChange}
                                name="coreNumber"
                                className="w-auto"
                            >
                                {coresOptions.map(core => (
                                    <option key={core} value={String(core)}>
                                        {core}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                </div>

                {['lambda', 'pOrder', 'maxIterations'].map((key) => (
                  <InputGroup
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1') + ":"}
                    name={key}
                    infoPopupText={infoTextMap[key]}
                  >
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </InputGroup>
                ))}

                <InputGroup label={t('translation.analysis_range')} name="analysisRange" infoPopupText={analysisText}>
                  <div className="range-container">
                    <div 
                        className="current-value-floating"
                        style={{
                            left: calculateSliderPosition(formData.analysisRange, 10, 40)
                        }}
                    >
                        {formData.analysisRange}
                    </div>

                    <div className="range-limits"> 
                        <span className="min-label">10</span>
                        <input
                          type="range"
                          min="10"
                          max="40"
                          step="1"
                          name="analysisRange"
                          value={formData.analysisRange}
                          onChange={handleChange}
                        />
                        <span className="max-label">40</span>
                    </div>
                  </div>
                </InputGroup>
              </div>

              <div className="flex justify-between items-end w-full">
                <div className="w-1/3"></div>

                <div className="flex justify-center w-1/3">
                  <button 
                      type="button" 
                      onClick={handleAnalyze} 
                      disabled={isLoading} 
                      className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {t('translation.analyze_button')}
                  </button>
                </div>
                <div className="w-1/3 flex justify-end relative" ref={menuRef}>
                    <button 
                        type="button" 
                        className="lang-button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {currentLanguageCode} 
                    </button>

                    {isMenuOpen && (
                        <div className="window-menu absolute bottom-full right-0 mb-1 z-100 min-w-max"> 
                            
                            <ul className="menu-list">
                                
                                <li 
                                    className="menu-item" 
                                    onClick={() => handleLanguageSelect('pt')}
                                >
                                    <span className="font-bold mr-2">BR</span> Português (Brasil)
                                </li>
                                
                                <li className="menu-separator"></li>

                                <li 
                                    className="menu-item" 
                                    onClick={() => handleLanguageSelect('en')}
                                >
                                    <span className="font-bold mr-2">US</span> English (American)
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
              </div>
            </form>
          </div>

          <div className={`flex-grow p-4 ${isExpanded ? 'block' : 'hidden'}`}>
            <p className="text-gray-500">{t('translation.analysis_view_title')}</p>

            {isAnalysisComplete ? (
                <>
                <div className="flex-grow p-4 flex flex-col items-center">
                  <div className="space-y-5 w-full">
                    <div className="flex justify-center">
                      <select 
                        value={selectedKey || ''} 
                        onChange={(event) => setSelectedKey(event.target.value)}
                      >
                          {options.map((option) => (
                              <option key={option.value} value={option.value}>
                                  {option.label}
                              </option>
                          ))}
                      </select>
                    </div>

                    <h3 className="text-base text-center">
                        {selectedKey}: {(finalResult[selectedKey] || 0).toFixed(2)}%
                    </h3>


                    <div 
                        className="window"
                        
                      >
                      <InteractiveGraph 
                        selectedCompound={selectedKey}
                        selectedInput={selectedInput}
                        componentData={selectedComponentData} 
                        inputListData={selectedInputListData}
                        componentSpectra={selectedComponentSpectra}
                        inputSpectra={selectedInputListSpectra}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button onClick={handleReportDownload} disabled={isLoading} className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}>{t('translation.download_report')}</button>
                    </div>
                  </div>
                </div>
                </>
            ) : (
                <div style={{textAlign: 'center'}}>
                    {isLoading ? (
                        <>
                            <img 
                                src={WIN98_LOADING_GIF} 
                                alt="Loading estilo Windows 98" 
                                style={{ transform: 'scale(0.3)', display: 'block', margin: '0 auto -50px' }} 
                            />
                        </>
                    ) : (
                        <p>{t('translation.loading_message')}</p>
                    )}
                </div>
            )}

          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full text-center py-1 pb-6 text-white text-lg z-50">
        © Spectral Nexus (2025)
        <br />
        <a 
            href="https://pantheon.ufrj.br/handle/11422/26302" 
            target="_blank"
            rel="noopener noreferrer"
            
            className="text-white hover:text-yellow-300 transition-colors duration-300 cursor-pointer"
        >
            Ferramenta interativa de identificação de compostos por análise ponderada de espectros de FT-IR: aplicação em agrotóxicos.
        </a>
      </footer>

      {isModalOpen && (
            <ValidationModal
                message={modalMessage}
                onClose={() => setIsModalOpen(false)}
            />
        )}
    </div>
  );
};

export default AnalysisForm;