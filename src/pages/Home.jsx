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
    const [isToggled, setIsToggled] = useState(true);
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
        <div>
            <h1>Home Page</h1>
            <FileSearch onFileSelect={handleFileSelect} />
            <TextBox value={textBoxValue} onChange={handleTextBoxChange} />
            <ToggleSwitch isToggled={isToggled} onToggle={handleToggleChange} />
            <ComboBox selectedOption={selectedOption} onSelectChange={handleComboBoxChange} />
            <SliderComponent value={sliderValue} onChange={handleSliderChange} />
            <NumberInput value={lambda_} onChange={handleNumberChange1} /> {/* First NumberInput */}
            <NumberInput value={porder} onChange={handleNumberChange2} /> {/* Second NumberInput */}
            <NumberInput value={maxiter} onChange={handleNumberChange3} /> {/* Third NumberInput */}
            <button onClick={sendDataToBackend}>Analisar composto</button>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Home;
