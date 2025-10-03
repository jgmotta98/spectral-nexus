import React, { useState, useRef, useEffect, useMemo } from 'react';
import InputGroup from './InputGroup';
import HelpModal from './HelpModal';
import InteractiveGraph from './InteractiveGraph';
import ValidationModal from './ValidationError';
import LogoImage from '../assets/spectral-nexus-icon-thicker.ico';
import WIN98_LOADING_GIF from '../assets/loading-windows98.gif'; 

const AnalysisForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState('PT-BR');
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
  const helpText = "Aqui vai o texto de ajuda detalhado...";
  const lambdaText = "Esta é a informação detalhada sobre a Lambda.";
  const porderText = "Esta é a informação detalhada sobre a P Order.";
  const maxIterText = "Esta é a informação detalhada sobre a Max Iter.";
  const analysisText = "Esta é a informação detalhada sobre a Faixa de Análise.";
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
      setLanguage(newLang);
      setIsMenuOpen(false);
      // Aqui você adicionaria a lógica para trocar o idioma da aplicação
  };

  const handleAnalyze = async (event) => {
      event.preventDefault();
      const file = fileInputRef.current.files[0];

      let errorMessage = '';

      if (!file) {
          errorMessage = 'Por favor, selecione um arquivo CSV para análise.';
      } else if (!formData.compoundName) {
          errorMessage = 'Por favor, insira o Nome do Composto.';
      } else if (!formData.pOrder || formData.pOrder === '0') {
          errorMessage = 'O Parâmetro P Order não pode ser zero ou vazio.';
      } else if (!formData.maxIterations || formData.maxIterations === '0') {
          errorMessage = 'O Parâmetro Max Iterations não pode ser zero ou vazio.';
      } else if (!formData.lambda || formData.lambda === '0') {
          errorMessage = 'O Parâmetro Lambda não pode ser zero ou vazio.';
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
          
          // 2. BUSCA OS DADOS DO RELATÓRIO PARA VISUALIZAÇÃO
          const reportResponse = await fetch(REPORT_API_URL);

          if (!reportResponse.ok) {
              throw new Error(`Erro HTTP ao buscar relatório: ${reportResponse.status}`);
          }

          const reportData = await reportResponse.json();
          
          // 3. ATUALIZA OS ESTADOS COM OS DADOS DO RELATÓRIO
          setFinalResult(reportData.final_result);
          setReportData(reportData);
          setSelectedKey(Object.keys(reportData.final_result)[0]);
          
          // 4. MARCA A ANÁLISE COMO CONCLUÍDA
          setIsAnalysisComplete(true); 

      } catch (error) {
          console.error("Falha no processo de análise/relatório:", error.message);
          alert(`Erro na Análise: ${error.message}`);
          
          // Em caso de erro, reverte os estados de visualização e conclusão
          setIsExpanded(false);
          setIsAnalysisComplete(false);

      } finally {
          // 5. FINALIZA O CARREGAMENTO
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
    const percentage = (offsetValue / range);

    return `calc(${percentage * 100}%)`;
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
          
          /* O divisor 'divide-x' não vai mais aqui, ele vai no contêiner do conteúdo */
      `}>
        <div className="title-bar">
          <div className="logo">
            {/* ... logo ... */}
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
            <form onSubmit={handleSubmit} className="form-content">
              <div className="space-y-14">
                
                <div className="file-upload-section w-full flex">
                  <button 
                      onClick={() => fileInputRef.current.click()}
                      disabled={isLoading} 
                      className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Buscar...
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
                    {fileName || 'Nenhum arquivo escolhido'}
                  </span>
                </div>

                <InputGroup label="Nome do Composto:" name="compoundName" showInfoIcon={false}>
                  <input
                    type="text"
                    name="compoundName"
                    value={formData.compoundName}
                    onChange={handleChange}
                    placeholder="Nome"
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
                        <label htmlFor="useParallelization">Usar paralelização</label>
                    </div>
                    
                    {formData.useParallelization && (
                        <div className="flex items-center space-x-2">
                            <label htmlFor="numCores">Núcleos:</label>
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

                <InputGroup label="Faixa de análise:" name="analysisRange" infoPopupText={analysisText}>
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
                    Analisar →
                  </button>
                </div>
                <div className="w-1/3 flex justify-end relative" ref={menuRef}>
                    <button 
                        type="button" 
                        className="lang-button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {language} 
                    </button>

                    {isMenuOpen && (
                        <div className="window-menu absolute bottom-full right-0 mb-1 z-100 min-w-max"> 
                            
                            <ul className="menu-list">
                                
                                <li 
                                    className="menu-item" 
                                    onClick={() => handleLanguageSelect('PT-BR')}
                                >
                                    <span className="font-bold mr-2">BR</span> Português (Brasil)
                                </li>
                                
                                <li className="menu-separator"></li>

                                <li 
                                    className="menu-item" 
                                    onClick={() => handleLanguageSelect('EN-US')}
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
            <p className="text-gray-500">Visualização do Espectro FT-IR </p>

            {isAnalysisComplete ? (
                <>
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
                    
                    <InteractiveGraph 
                      selectedCompound={selectedKey}
                      selectedInput={selectedInput}
                      componentData={selectedComponentData} 
                      inputListData={selectedInputListData}
                      componentSpectra={selectedComponentSpectra}
                      inputSpectra={selectedInputListSpectra}
                    />

                    <div className="flex justify-center">
                      <button onClick={handleReportDownload} disabled={isLoading} className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}>Download Relatório</button>
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
                        <p>Clique em "Analisar" para carregar o gráfico.</p>
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