import React, { useState } from "react";

function CommonInput({density, setDensity, mat, length, setLength}) {

    const handleClickdensity = (e) => {
        setDensity(e.target.value);
    }
    
    return (
        <div style={{ textAlign: "center" }}>
            <div className="container1">
                <label className="label" htmlFor="length">Length (L) m</label>
                <input className="input-field" id="length" type="number" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} placeholder="Type something..." />
            </div>
            <div className="container1">
                <label className="label" htmlFor="density">Material</label>
                <select className="input-field" id="density" value={density} onChange={handleClickdensity} style={{width: "200px"}}>
                    {Object.keys(mat).map((key) => (
                    <option key={key} value={key}>{mat[key]}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default CommonInput;