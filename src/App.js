import {React, useState, useEffect } from 'react';
import './App.css';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import Calculate from './functions';

const init_params = {
  mass: 15,
  ribLength: 95.0,
  depth: 500,
  area: 0.5,
  angle: 45,
  spring: 5,
  damping: 20,
}

const Plot = createPlotlyComponent(Plotly);

function Slider({props}){
  return (
          
  <div className='input-row' onSubmit={(ev) => ev.preventDefault()}> 
  <div className='input-label'>
<div>{props.name}</div>
</div>
<div>
<input
    className="input-box"
    name={props.name}
    type="number"
    min={props.min}
    max={props.max}
    step={props.step}
    value={props.value}
    onChange={(item)=>props.onChange(item.target.valueAsNumber)}
/>
</div>

</div>
  )
}

function PlotResponse({props}){
  return (
  
  <Plot
  data={props.data}
  static_plot={true}
  drag_mode={false}
  layout={ {margin: {t:20,
            b: 40,
          r:10,
        l:50},
    autosize: true,
    hovermode: false, 
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
  legend: {yanchor: 'top', y: 0.99, xanchor: 'left', x: 0.01, font: {color: '#000000', size: 20}},
  xaxis: {fixedrange: true,
    title: props.xaxis,
    titlefont: {size: 20,
              color:'#000000'}
  },
  yaxis: {fixedrange: true,
    title: props.yaxis,
  titlefont: {size:20,
  color: '#000000'}
}} }
  useResizeHandler={true}
config={{displayModeBar: false}}
/>)
}

function ReservoirApp() {

  const [inputParams, setInputParams] = useState(init_params);
  const [output, setOutput] = useState({
    resFreq: 1,
                critDamp: 1,
                mobility: [],
                timeResp: [],
                halfTime: 1,
                pressure: 1,
                dampingRatio: 1

  });

  const setParams = (name, value) => {
    let newparams = {...inputParams, [name]: value};
      setInputParams(newparams);
  }
  
  useEffect(() => {
    let out = Calculate(inputParams);
    setOutput(out);
  }, [inputParams]);
  
  return (
    <>
    <div className='app-main-body'>


       <div className='app-header'>
          <div className='main-title'>ResCal</div>
          <p> Calculate the resonant frequency and characteristics of an organ air reservoir</p>

       </div>
       
        <div className="rescal-app" >
          <div className='input-container'>

            <div className='input-form'>
          <Slider props={{name: "Mass (kg)", value: inputParams.mass, min: 0, max: 9999, step: 0.1, onChange: (a) => setParams("mass", a)}}></Slider>
          <Slider props={{name: "Rib Length (mm)", value: inputParams.ribLength, min: 0, max: 9999, step: 1,  onChange:  (a) => setParams("ribLength", a)}}></Slider>
          <Slider props={{name: "Area (m^2)", value: inputParams.area, min: 0, max: 9999, step: 0.1, onChange: (a) => setParams("area", a)}}></Slider>
          <Slider props={{name: "Depth (mm)", value: inputParams.depth, min: 0, max: 9999, step: 1, onChange: (a) => setParams("depth", a)}}></Slider>
          <Slider props={{name: "Rib Angle (deg)", value: inputParams.angle, min: 0, max: 89, step: 1, onChange: (a) => setParams("angle", a)}}></Slider>
          <Slider props={{name: "+ Stiffness (N/m)", value: inputParams.spring, min: 0, max: 9999, step: 1, onChange: (a) => setParams("spring", a)}}></Slider>
          <Slider props={{name: "Damping (Ns/m)", value: inputParams.damping, min: 0, max: 9999, step: 1,onChange: (a) => setParams("damping", a)}}></Slider>
          </div>
          <div className='input-form'>

            <div className='input-row'>
            <div className='input-label'>Pressure:</div> <div>{output.pressure.toLocaleString(undefined, { maximumFractionDigits: 0 })} Pa </div>
              </div>


              <div className='input-row'>
            <div className='input-label'>Resonant frequency: </div> <div> {output.resFreq.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hz</div>
            </div>
            <div className='input-row'>
            <div className='input-label'>Half time: </div> <div>{output.halfTime.toLocaleString(undefined, { maximumFractionDigits: 2 })} s</div>
            </div>
            <div className='input-row'>
            <div className='input-label'>Q factor: </div> <div>{(1/(2*output.dampingRatio)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            </div>
            </div>
             

          <div className='rescal-plot-container'>
      
            <PlotResponse props={{data: output.mobility, xaxis: "<b>Frequency (Hz)</b>", yaxis: "Mobility"}}/>
            <PlotResponse props={{data: output.timeResp, xaxis: "<b>Time (s)</b>", yaxis: "Pressure"}}/>
            
          </div>

          </div>


          </div>

        </>
  );
}

export default ReservoirApp;
