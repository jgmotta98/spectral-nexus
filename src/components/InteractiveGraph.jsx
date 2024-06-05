import React from 'react';
import Plot from 'react-plotly.js';

const InteractiveGraph = ({ selectedCompound, selectedInput, componentData, inputListData, componentSpectra, inputSpectra }) => {
  const filterData = (data) => {
    const xValues = Object.values(data.x);
    const yValues = Object.values(data.y);

    return {
      x: xValues.filter((_, index) => !(xValues[index] === 0 && yValues[index] === 0)),
      y: yValues.filter((_, index) => !(xValues[index] === 0 && yValues[index] === 0))
    };
  };

  const filteredComponentData = filterData(componentData);
  const filteredInputListData = filterData(inputListData);

  const filteredComponentSpectra = filterData(componentSpectra);
  const filteredInputSpectra = filterData(inputSpectra);

  return (
    <Plot
      data={[
        {
          x: filteredInputSpectra.x,
          y: filteredInputSpectra.y,
          type: 'scatter',
          mode: 'lines',
          line: { color: 'black' },
          name: `Espectro de ${selectedInput}`
        },
        {
          x: filteredComponentSpectra.x,
          y: filteredComponentSpectra.y,
          type: 'scatter',
          mode: 'lines',
          line: { color: 'red' },
          name: `Espectro de ${selectedCompound}`
        },
        {
          x: filteredInputListData.x,
          y: filteredInputListData.y,
          type: 'scatter',
          mode: 'markers',
          marker: { color: 'orange' },
          name: `Dados de ${selectedInput}`
        },
        {
          x: filteredComponentData.x,
          y: filteredComponentData.y,
          type: 'scatter',
          mode: 'markers',
          marker: { color: 'blue' },
          name: `Dados de ${selectedCompound}`
        }
      ]}
      layout={{
        width: 1100,
        height: 500,
        xaxis: {
          title: 'Número de onda (cm⁻¹)',
          range: [4000, 400],
          automargin: true,
          showgrid: false,
        },
        yaxis: {
          title: 'Transmitância (%)',
          range: [0, 100],
          automargin: true,
          showgrid: false,
        },
        legend: {
          x: 0,
          y: 0,
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          bordercolor: 'rgba(0, 0, 0, 0.5)',
          borderwidth: 1,
          xanchor: 'left',
          yanchor: 'bottom',
          font: {
            size: 11 
          }
        },
        margin: {
          l: 40,
          r: 20,
          t: 40,
          b: 40
        }
      }}
    />
  );
};

export default InteractiveGraph;
