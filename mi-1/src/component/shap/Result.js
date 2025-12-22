import { useState } from 'react'
import '../../App.css'

function Result({weightPerLength, length, totalWeight, stripWidth, outLine, area, inertiax, inertiay, rogx, rogy, pmoi, morx, mory, inertiaxy, paangle, inertiau, inertiav, rogu, rogv, moru, morv}) {
  const [click, setclick] =  useState(false);
  const handleClick = () => {
    setclick(click^true)
  }
  return (
    <>
    <div style={{ fontWeight: 'bold', textAlign: 'center', color: 'white', backgroundColor: '#1b065c'}}>Standard Output</div>
        <p className="output-text"><b>Weight per meter:</b><p>{weightPerLength} Kg/m</p></p>
        <p className="output-text"><b>Weight of {length}m length:</b><p>{totalWeight} Kg</p></p>
        <p className="output-text"><b>Calculated strip width:</b><p> {stripWidth} mm</p></p>
        <p className="output-text" ><b>Outline length:</b><p>{outLine} mm</p></p>
        <p className="output-text" ><b>Area of cross section:</b><p>{area} mm^2</p></p>
        <br/>
    <div style={{ fontWeight: 'bold', textAlign: 'center', color: 'white', backgroundColor: '#1b065c'}} onClick={handleClick}>Advanced Output  <i className="fa-solid fa-caret-down px-2"></i></div>
    { 
        click && <><p className="output-text" ><b>Center of mass (x):</b><p> 0.00 mm from origin</p></p>
        <p className="output-text" ><b>Center of mass (y):</b><p> 0.00 mm from origin</p></p>
        <p className="output-text" ><b>Moment of inertia I(x):</b><p> {inertiax} cm^4</p></p>
        <p className="output-text" ><b>Moment of resistance W(x):</b><p> {morx} cm^3</p></p>
        <p className="output-text" ><b>Radius of gyration i(x):</b><p> {rogx} cm</p></p>
        <p className="output-text" ><b>Moment of inertia I(y):</b><p> {inertiay} cm^4</p></p>
        <p className="output-text" ><b>Moment of resistance W(y):</b><p> {mory} cm^3</p></p>
        <p className="output-text" ><b>Radius of gyration i(y):</b><p>{rogy} cm</p> </p>
        <p className="output-text" ><b>Centrifugal moment I(xy):</b><p> {inertiaxy} cm^4</p></p>
        <p className="output-text" ><b>Polar moment of inertia Ip:</b><p> {pmoi} cm^4</p></p>
        <p className="output-text" ><b>Principal axis angle:</b><p> {paangle} deg</p></p>
        <p className="output-text" ><b>Moment of inertia I(u):</b><p> {inertiau}  cm^4</p></p>
        <p className="output-text" ><b>Moment of resistance W(u):</b><p> {moru} cm^3</p></p>
        <p className="output-text" ><b>Radius of gyration i(u):</b><p> {rogu} cm</p></p>
        <p className="output-text" ><b>Moment of inertia I(v):</b><p> {inertiav} cm^4</p></p>
        <p className="output-text" ><b>Moment of resistance W(v):</b><p> {morv} cm^3</p></p>
        <p className="output-text" ><b>Radius of gyration i(v):</b> <p>{rogv} cm</p></p></>
    }
    </>
  )
}

export default Result
