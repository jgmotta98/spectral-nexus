import React from 'react';
import Plot from 'react-plotly.js';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Apr', uv: 2780, pv: 3908 },
  { name: 'May', uv: 1890, pv: 4800 },
  { name: 'Jun', uv: 2390, pv: 3800 },
  { name: 'Jul', uv: 3490, pv: 4300 },
];

const plotData = [
  {
    x: data.map(item => item.name),
    y: data.map(item => item.pv),
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'red' },
    name: 'pv'
  },
  {
    x: data.map(item => item.name),
    y: data.map(item => item.uv),
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'blue' },
    name: 'uv'
  }
];

const InteractiveGraph = () => {
  return (
    <Plot
      data={plotData}
      layout={{ title: 'Simple Line Chart' }}
    />
  );
};

export default InteractiveGraph;
