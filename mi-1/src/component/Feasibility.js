import { useState } from 'react';

function Feasibility({ type, stripWidth, thickness, parameters }) {
  const [method, setMethod] = useState('');
  const [band, setBand] = useState('');
  const [material, setMaterial] = useState('');
  const [yst, setYst] = useState('');
  const [check, setCheck] = useState(false)
  const [output, setoutput] = useState(false)
  const [tubeMill, setTubeMill] = useState([false, false, false, false, false]);
  const [openSectionMill, setOpenSectionMill] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])

  const checkchange = () =>{
    tubeMill[0] = (band !== "-0.3" &&  ( stripWidth>=35 && stripWidth<=320 ) && ( thickness>=0.8 && thickness<=4 ) && method!=="Open Profile" && ["IS 277", "IS 513", "IS 2062", "IS 5986"].includes(material) && ["250", "350"].includes(yst)) ? true : false
    tubeMill[1] = (band !== "-0.3" &&  ( stripWidth>=35 && stripWidth<=270 ) && ( thickness>=0.8 && thickness<=3 ) && method!=="Open Profile" && ["IS 277", "IS 513", "IS 2062", "IS 5986"].includes(material) && yst === "250") ? true : false
    tubeMill[2] = (band !== "-0.3" &&  ( stripWidth>=35 && stripWidth<=250 ) && ( thickness>=1 && thickness<=3 ) && method!=="Open Profile" && ["IS 277", "IS 513", "IS 2062", "IS 5986"].includes(material) && yst === "250") ? true : false
    tubeMill[3] = (band !== "-0.3" &&  ( stripWidth>=35 && stripWidth<=380 ) && ( thickness>=0.8 && thickness<=5 ) && method!=="Open Profile" && ["IS 277", "IS 513", "IS 2062", "IS 5986"].includes(material) && ["250", "350", "450", "550"].includes(yst)) ? true : false
    tubeMill[4] = (band !== "-0.3" &&  ( stripWidth>=35 && stripWidth<=570 ) && ( thickness>=4 && thickness<=12 ) && method!=="Open Profile" && ["IS 2062", "IS 5986"].includes(material) && ["250", "350", "450", "550"].includes(yst)) ? true : false
    setTubeMill([...tubeMill])
    openSectionMill[0] = (band !== "-0.3" &&  ( stripWidth>=10 && stripWidth<=220 ) && ( thickness>=0.6 && thickness<=3 ) && type==="Open" && ["IS 277", "IS 513", "IS 2062", "IS 5986"].includes(material) && ["250", "350", "450"].includes(yst)) ? true : false
    setOpenSectionMill([...openSectionMill])
    setCheck(1);
    if(tubeMill[0] || tubeMill[1] || tubeMill[2] || tubeMill[3] || tubeMill[4] || openSectionMill[0]) setoutput(true)
    else setoutput(false)
  } 

  const resetchange = () =>{
    setMethod("")
    setBand("")
    setMaterial("")
    setYst("") 
    setCheck(false) 
  }
  
  return (
    <>
    <div style={styles.container}>
      <h2 style={styles.title}>Feasibility Check</h2> 
      {/* Input Summary */}
      <section style={styles.section}>
        <h4 style={styles.subHeading}>Input Summary</h4>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>Strip Width :   {stripWidth} mm</label>
          </div>
          <div style={styles.inputGroup}> 
            <label>Profile Type : {type} Profile</label>
          </div>
        </div>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>Thickness : {thickness} mm</label>
          </div>
          <div style={styles.inputGroup}>
            <label>Box Perimeter : {parameters} mm</label>
          </div>
        </div>
      </section>
      {/* User Fields */}
      <section style={styles.section}>
        <h4 style={styles.subHeading}>Select the Following</h4>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>Method of Forming</label>
            <select value={method} onChange={(e) => {setMethod(e.target.value); setCheck(false)}} style={styles.select}>
              <option value="">Select One</option>
              {type === "Close" && <option value="Shape">Shape Tube</option>}
              {type === "Close" && <option value="Open Welded">Open Welded Tube</option>}
              {type === "Open" && <option value="Open Profile">Open Profile</option>}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label>Minimum Tolerance </label>
            <select value={band} onChange={(e) => {setBand(e.target.value); setCheck(false)}} style={styles.select}>
              <option value="">Select One</option>
              <option value="-0.3"> Less then 0.3</option>
              <option value="-0.5"> Less then 0.5</option>
              <option value="+0.5">Greater then 0.5</option>
            </select>
          </div>
        </div>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>Material Grade</label>
            <select value={material} onChange={(e) => {setMaterial(e.target.value); setCheck(false)}} style={styles.select}>
              <option value="">Select One</option>
              <option value="IS 277">IS 277</option>
              <option value="IS 513">IS 513</option>
              <option value="IS 2062">IS 2062</option>
              <option value="IS 5986">IS 5986</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label>YST</label>
            <select value={yst} onChange={(e) => {setYst(e.target.value); setCheck(false)}} style={styles.select}>
              <option value="">Select One</option>
              <option value="250">250</option>
              <option value="350">350</option>
              <option value="450">450</option>
              <option value="550">550</option >
            </select>
          </div>
        </div>
      </section>
      {/* Output */}
      <section style={styles.section}>
        <h4 style={styles.subHeading}>Output</h4>
        <div>
          {check && band === "-0.3" && <p style={styles.outputBox2}>This tool cannot check feasibility as the tolerance band is less than 0.3 mm. Please contact the Mother India Engineering Department for a detailed feasibility analysis.</p>}
          {check && type === "Close" && output && band !== "-0.3" && <p style={styles.outputBox1}> This part is feasible under the machine conditions mentioned below.</p>}
          {check && type === "Open" && output && band !== "-0.3" && <p style={styles.outputBox1}> This profile is feasible within the machine conditions available at Mother India. Please contact Mother India Engineering for a detailed feasibility report.</p>}
          {check && tubeMill[0] && <p style={styles.outputBox1}>Tube Mill No-1 {method === "Open Welded" && <><br/>- 8 Forming Pass<br/>- 3 Fin Pass</>} <br/>- 4 Sizing Pass </p>}
          {check && tubeMill[1] && <p style={styles.outputBox1}>Tube Mill No-2 {method === "Open Welded" && <><br/>- 6 Forming Pass<br/>- 2 Fin Pass</>} <br/>- 3 Sizing Pass </p>}
          {check && tubeMill[2] && <p style={styles.outputBox1}>Tube Mill No-3 {method === "Open Welded" && <><br/>- 4 Forming Pass<br/>- 2 Fin Pass</>} <br/>- 3 Sizing Pass  </p>}
          {check && tubeMill[3] && <p style={styles.outputBox1}>Tube Mill No-4 {method === "Open Welded" && <><br/>- 15 Forming Pass<br/>- 3 Fin Pass</>}<br/>- 6 Sizing Pass </p>}
          {check && tubeMill[4] && <p style={styles.outputBox1}>Tube Mill No-5 {method === "Open Welded" && <><br/>- 4 Forming Pass<br/>- 4 Fin Pass <br/>- 1 Seam Guide</>}<br/>- 5 Sizing Pass </p>}
          {check && !output && band !== "-0.3" && <p style={styles.outputBox2}>This part is not feasible. Please contact MI Engineering for further details.</p>}
        </div>
      </section>
    </div>
    <div className="modal-footer">
        <button type="button" className="btn btn-success" onClick={checkchange} disabled={method === "" || band === "" || material === "" || yst === ""}>Check For Feasibility</button>
        <button type="button" className="btn btn-primary" onClick={resetchange}>Reset</button>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetchange}>Close</button>
    </div>
    </>
  );
}

const styles = {
  container: {
    padding: '30px',
    margin: '10px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Segoe UI, sans-serif',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50'
  },
  section: {
    marginBottom: '30px'
  },
  subHeading: {
    fontSize: '18px',
    marginBottom: '15px',
    borderBottom: '2px solid #ccc',
    paddingBottom: '5px',
    color: '#34495e'
  },
  inputRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px'
  },
  select: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '5px'
  },
  outputBox1: { 
  padding: '15px',
  backgroundColor: '#d4edda',      // light green
  borderLeft: '5px solid #28a745', // green
  borderRadius: '5px',
  color: '#155724'                 // dark green text
},
outputBox2: {
  padding: '15px',
  backgroundColor: '#f8d7da',      // light red
  borderLeft: '5px solid #dc3545', // red
  borderRadius: '5px',
  color: '#721c24'                 // dark red text
}
};

export default Feasibility;
