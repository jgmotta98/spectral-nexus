// src/pages/Home.jsx
import React, { useState } from 'react';
import FileSearch from '../components/FileSearch';
import TextBox from '../components/TextBox';
import ToggleSwitch from '../components/ToggleSwitch';
import ComboBox from '../components/ComboBox';
import SliderComponent from '../components/Slider';
import '../App.css';

const Home = () => {
    const [file, setFile] = useState(null);
    const [textBoxValue, setTextBoxValue] = useState("");
    const [isToggled, setIsToggled] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const [sliderValue, setSliderValue] = useState(25);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setTextBoxValue(selectedFile.name);
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

    const sendDataToBackend = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('textBoxValue', textBoxValue);
        formData.append('isToggled', isToggled);
        formData.append('selectedOption', selectedOption);
        formData.append('sliderValue', sliderValue);

        try {
            const response = await fetch('http://localhost:5000/api/data', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the request.');
            }

            const data = await response.json();
            console.log('Data received from backend:', data);
        } catch (error) {
            console.error('Error sending data:', error);
        } finally {
            setLoading(false); // Set loading state to false
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
