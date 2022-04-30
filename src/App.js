import {React, useState, useEffect } from 'react';

import  Row from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import  Stack  from 'react-bootstrap/Stack';
import { InputGroup } from 'react-bootstrap';
import Container  from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import Calculate from './functions';
import Form  from 'react-bootstrap/Form';

const Plot = createPlotlyComponent(Plotly);

function Slider({props}){
  return (
          
  <Form onSubmit={(ev) => ev.preventDefault()}> 
    <Row>
<Form.Group as={Row}>
  <Col>
<Form.Label>{props.name}</Form.Label>
</Col>
<Col>
<Form.Control
    className="mobileBox"
    name={props.name}
    type="number"
    min={props.min}
    max={props.max}
    step={props.step}
    maxLength="10"
    value={props.value}
    onChange={(item)=>props.onChange(item.target.valueAsNumber)}
/>
</Col>

</Form.Group>
</Row>
</Form>
  )
}

function PlotResponse({props}){
  return (<Plot
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
style={{width: "100%", height: "100%"}}
config={{displayModeBar: false}}
/>)
}

function ReservoirApp() {
  const [mass, setMass] = useState(15);
  const [ribLength, setRibLength] = useState(95.0);
  const [depth, setDepth] = useState(500);
  const [area, setArea] = useState(0.5);
  const [angle, setAngle] = useState(45);
  const [spring, setSpring] = useState(5);
  const [damping, setDamping] = useState(20);
  const [mobility, setMobility] = useState([]);
  const [timeResp, setTimeResp] = useState([]);
  const [resFreq, setResFreq] = useState(1);
  const [halfTime, setHalfTime] = useState(1);
  const [dampingRatio, setDampingRatio] = useState(1);
  const [pressure, setPressure] = useState(1);

  const params = {mass: mass,
                  area:area,
                  ribLength: ribLength,
                  depth: depth,
                  angle: angle,
                  spring: spring,
                  damping: damping};
  const all_params = [mass, area, ribLength, depth, angle, spring, damping];

  useEffect(() => {
    let out = Calculate(params);
    setMobility(out.mobility);
    setTimeResp(out.timeResp);
    setResFreq(out.resFreq);
    setHalfTime(out.halfTime);
    setPressure(out.pressure);
    setDampingRatio(out.dampingRatio);
  }, all_params);
  
  return (
    <>
       <Container fluid>

          <h1>Organ air reservoir resonance</h1>
          
          <p> Calculate the resonant frequency and characteristics of an organ air reservoir</p>
          
       </Container>
       
        <Container fluid className="bg-light border rounded mb-0 p-3" >
          <Row>
            
          <Col>
          <Stack direction="vertical" gap={2}>
          <Slider props={{name: "Mass (kg)", value: mass, min: 0, max: 9999, step: 0.1, onChange: setMass}}></Slider>
          <Slider props={{name: "Rib Length (mm)", value: ribLength, min: 0, max: 9999, step: 0.1,  onChange: setRibLength}}></Slider>
          <Slider props={{name: "Area (m^2)", value: area, min: 0, max: 9999, step: 0.1, onChange: setArea}}></Slider>
          <Slider props={{name: "Depth (mm)", value: depth, min: 0, max: 9999, step: 1, onChange: setDepth}}></Slider>
          </Stack>
          </Col>
          <Col>

          <Stack direction="vertical" gap={2}>
          
          <Slider props={{name: "Rib Angle (deg)", value: angle, min: 0, max: 89, step: 1, onChange: setAngle}}></Slider>
          <Slider props={{name: "+ Stiffness (N/m)", value: spring, min: 0, max: 9999, step: 1, onChange: setSpring}}></Slider>
          <Slider props={{name: "Damping (Ns/m)", value: damping, min: 0, max: 9999, step: 1,onChange: setDamping}}></Slider>
          </Stack>
          
          </Col>
          <Row>
            <h2>Outputs</h2>
            
            <Container>
            <Stack  direction="horizontal" gap={4}>
            <Col>
              Pressure: {pressure.toLocaleString(undefined, { maximumFractionDigits: 2 })} Pa </Col>
            <Col>Resonant frequency: {resFreq.toLocaleString(undefined, { maximumFractionDigits: 2 })} Hz</Col>
            <Col>Half time: {halfTime.toLocaleString(undefined, { maximumFractionDigits: 2 })} s</Col>
            <Col>
            Q factor: {(1/(2*dampingRatio)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Col>
            </Stack>
            
            </Container>
             
            </Row>
          </Row>

          <Container>
            <Row xs="1" md="2">
            <Col>
            <PlotResponse props={{data: mobility, xaxis: "<b>Frequency (Hz)</b>", yaxis: "Mobility"}}/>
            </Col>
            <Col>
            <PlotResponse props={{data: timeResp, xaxis: "<b>Time (s)</b>", yaxis: "Pressure"}}/>
            </Col>
            </Row>
          </Container>
        </Container>
        </>
  );
}

export default ReservoirApp;
