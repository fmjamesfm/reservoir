import { sqrt, range, add, pow, complex, multiply, dotMultiply, exp, subtract, dotDivide, pi, cos, sin, tan, i, abs, log10} from 'mathjs'

const AG = 9.81; // gravity m/s^2
const time = range(0, 5.0, 0.001, true).toArray();

export default function Calculate(params){

    let riblen = params.ribLength  * 1e-3;
    let area = params.area;
    let depth = params.depth * 1e-3;
    let angle = params.angle;
    let mass = params.mass;
    let spring = params.spring; 
    let damping = params.damping;

    let alpha = pi*angle/180;
    let a=sqrt(area);
    let x=riblen*cos(alpha);
    let B=(2*x*(a+a))-(4*x**2);

    let angle1= (sin(alpha)*tan(alpha)-cos(alpha));

    let Fribs = AG*mass/(area +(B*0.5*angle1));
    let ribs = AG*mass*(1/(area +(B*0.5*angle1))-1/area);
    let press = (Fribs+(spring/area));

    let PO = press+1e5;
    let k = PO*1.4;
    let K = area*k/depth;
    let M=mass;
    let KK= spring+Fribs;
    let R=damping;
    let res_freq = 0.5 / pi * sqrt((K+KK) / M);     
    let freq = range(res_freq/2, res_freq*2, res_freq/100).toArray();
    let omega = dotMultiply(2*pi, freq);

    let Z=add(R, dotMultiply(i, subtract(dotMultiply(M, omega), dotDivide(K+KK,omega))));
    

    let crit_damp = 4 * pi * M * res_freq;

    
    
    let damping_ratio = R / crit_damp;
    let decay_rate = R / (2 * M);
    let half_time = 0.693/decay_rate;
    let time = range(0, 4/decay_rate, 1/(res_freq*20)).toArray();
    let time_resp = dotMultiply(exp(dotMultiply(-decay_rate, time)), cos(dotMultiply(2*pi*res_freq, time)));
    let mob =multiply(20, log10(dotDivide(1,abs(Z))));


    let time_resp_out = [{x: time, 
        y: time_resp,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'}}];
    
    let mobility = [{x: freq, 
        y: mob,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'}}];
    
    const output = {resFreq: res_freq,
                critDamp: crit_damp,
                mobility: mobility,
                timeResp: time_resp_out,
                halfTime: half_time,
                pressure: press,
                dampingRatio: damping_ratio}

    return output;
}
