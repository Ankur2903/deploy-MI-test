import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from '../ulits';
import { useLocation } from "react-router-dom";

function Machine() {
  const location = useLocation();
  const [machineId, setMachineId] = useState("");
  const [newMachineId, setNewMachineId] = useState("");
  const [type, setType] = useState("");
  const [newType, setNewType] = useState("");
  const [usableShaftLength, setUsableShaftLength] = useState(0);
  const [newUsableShaftLength, setNewUsableShaftLength] = useState(0);
  const [stripWidthMin, setStripWidthMin] = useState(0);
  const [newStripWidthMin, setNewStripWidthMin] = useState(0);
  const [stripWidthMax, setStripWidthMax] = useState(0);
  const [newStripWidthMax, setNewStripWidthMax] = useState(0);
  const [thicknessMin, setThicknessMin] = useState(0);
  const [newThicknessMin, setNewThicknessMin] = useState(0);
  const [thicknessMax, setThicknessMax] = useState(0);
  const [newThicknessMax, setNewThicknessMax] = useState(0);
  const [boxPerimeter, setBoxPerimeter] = useState(0);
  const [newBoxPerimeter, setNewBoxPerimeter] = useState(0);
  const [giCoating, setGiCoating] = useState("");
  const [newGiCoating, setNewGiCoating] = useState("");
  const [numberOfStations, setNumberOfStations] = useState(0);
  const [newNumberOfStations, setNewNumberOfStations] = useState(0);
  const [machines, setMachines] = useState([]);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    const fetchmachines = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch("https://deploy-mi-test-api.vercel.app/machine/allmachine", {
          method: "POST", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          }
        });
        const data = await response.json();
        setMachines(data);
      } catch (err) {
        console.error("Error fetching machines:", err.message);
      }
    };

    fetchmachines();
  }, [location, reload])

  const add = (id) => {
    if (selectedMachines.includes(id)) {
      setSelectedMachines((prevSelected) => prevSelected.filter((machineId) => machineId !== id));
    } else {
      setSelectedMachines((prevSelected) => [...prevSelected, id]);
    }
  };

  const editclicked = () => {
    for (let i = 0; i < machines.length; i++) {
      if (machines[i]._id === selectedMachines[0]) {
        setNewMachineId(machines[i].machineId);
        setNewType(machines[i].type);
        setNewUsableShaftLength(machines[i].usableShaftLength);
        setNewStripWidthMin(machines[i].stripWidthMin);
        setNewStripWidthMax(machines[i].stripWidthMax);
        setNewThicknessMin(machines[i].thicknessMin);
        setNewThicknessMax(machines[i].thicknessMax);
        setNewBoxPerimeter(machines[i].boxPerimeter);
        setNewGiCoating(machines[i].giCoating);
        setNewNumberOfStations(machines[i].numberOfStations);
        break;
      }
    }
  };

  const addmachine = async (e) => {
    e.preventDefault();
    if (!machineId || !type || !usableShaftLength || !stripWidthMin || !stripWidthMax || !thicknessMin || !thicknessMax || !boxPerimeter || !giCoating || !numberOfStations) {
      return handleError('Please fill out all fields.')
    }
    try {
      
      const token = localStorage.getItem('token')
      const url = "https://deploy-mi-test-api.vercel.app/machine/addmachine";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ machineId, type, usableShaftLength, stripWidthMin, stripWidthMax, thicknessMin, thicknessMax, boxPerimeter, giCoating, numberOfStations })
      })
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        setReload(!reload)
        handleSuccess(message)
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      } else if (!success) {
        handleError(message)
      }
    }
    catch (err) {
      handleError(err);
    }
  };

  const deleteMachines = async (selectedMachines) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/machine/deletemachine`, {
        method: "DELETE", // default method, can be omitted
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify({ selectedMachines: selectedMachines })
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        setReload(!reload)
        handleSuccess(message)
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      } else if (!success) {
        handleError(message)
      }
      setReload(!reload);
      setSelectedMachines([])
      // const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const editMachine = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!newMachineId || !newType || !newUsableShaftLength || !newStripWidthMin || !newStripWidthMax || !newThicknessMin || !newThicknessMax || !newBoxPerimeter || !newGiCoating || !newNumberOfStations) {
        return handleError('Please fill out all fields.')
      }
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/machine/editmachine`, {
        method: "PUT", // default method, can be omitted
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify({ selectedMachines, newMachineId, newType, newUsableShaftLength, newStripWidthMin, newStripWidthMax, newThicknessMin, newThicknessMax, newBoxPerimeter, newGiCoating, newNumberOfStations })
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        setReload(!reload)
        handleSuccess(message)
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      } else if (!success) {
        handleError(message)
      }
      setReload(!reload);
      setSelectedMachines([])
      // const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ padding: "0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }}>
        {/* Centered Heading */}
        <h2 style={{ flex: 1, marginLeft: "40vw" }}>Machines</h2>
        {/* Button Group */}
        <div className="btn-group" role="group" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-1" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Add Machine</button>
          <div className="modal fade-dark modal-xl" id="exampleModal-1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ justifyContent: "center", display: "flex", width: "100%" }}>All Details</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ padding: '30px' }}>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>1. Machine ID</label>
                      <input type="text" value={machineId} onChange={(e) => setMachineId(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Enter Machine ID" style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>2. Type</label>
                      <input type="text" value={type} onChange={(e) => setType(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Enter type" style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>3. Usable Shaft Length in mm</label>
                      <input type="number" value={usableShaftLength} onChange={(e) => setUsableShaftLength(e.target.value)} onFocus={(e) => e.target.select()}  style={styles.select}/>
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>4. Strip Width(min) in mm</label>
                      <input type="number" value={stripWidthMin} onChange={(e) => setStripWidthMin(e.target.value)} onFocus={(e) => e.target.select()}  style={styles.select}/>
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Strip Width(max) in mm</label>
                      <input type="number" value={stripWidthMax} onChange={(e) => setStripWidthMax(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select}/>
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>5. Thickness(min) in mm</label>
                      <input type="number" value={thicknessMin} onChange={(e) => setThicknessMin(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Thickness(max) in mm</label>
                      <input type="number" value={thicknessMax} onChange={(e) => setThicknessMax(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>6. Box Perimeter</label>
                      <input type="number" value={boxPerimeter} onChange={(e) => setBoxPerimeter(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>5. GI Coating</label>
                      <input type="text" value={giCoating} onChange={(e) => setGiCoating(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Enter GI Coating" style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Number of Stations</label>
                      <input type="number" value={numberOfStations} onChange={(e) => setNumberOfStations(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-success" data-bs-dismiss="modal"  onClick={addmachine}>Add Machine</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-2" style={{ backgroundColor: selectedMachines.length === 1 ? "green" : "lightGreen", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}  disabled = {selectedMachines.length !== 1} onClick={editclicked}>Edit Machine</button>
          <div className="modal fade-dark" id="exampleModal-2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Machine</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>1. Machine ID</label>
                      <input type="text" value={newMachineId} onChange={(e) => setNewMachineId(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>2. Type</label>
                      <input type="text" value={newType} onChange={(e) => setNewType(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Enter type" style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>3. Usable Shaft Length in mm</label>
                      <input type="number" value={newUsableShaftLength} onChange={(e) => setNewUsableShaftLength(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>4. Strip Width(min) in mm</label>
                      <input type="number" value={newStripWidthMin} onChange={(e) => setNewStripWidthMin(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Strip Width(max) in mm</label>
                      <input type="number" value={newStripWidthMax} onChange={(e) => setNewStripWidthMax(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>5. Thickness(min) in mm</label>
                      <input type="number" value={newThicknessMin} onChange={(e) => setNewThicknessMin(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Thickness(max) in mm</label>
                      <input type="number" value={newThicknessMax} onChange={(e) => setNewThicknessMax(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>6. Box Perimeter</label>
                      <input type="number" value={newBoxPerimeter} onChange={(e) => setNewBoxPerimeter(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label>5. GI Coating</label>
                      <input type="text" value={newGiCoating} onChange={(e) => setNewGiCoating(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Enter a GI Coating" style={styles.select} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Number of Stations</label>
                      <input type="number" value={newNumberOfStations} onChange={(e) => setNewNumberOfStations(e.target.value)} onFocus={(e) => e.target.select()} style={styles.select} />
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={editMachine}>Edit Machine</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" style={{ backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>delete Machine</button>
          <div className="modal fade-dark" id="exampleModal-3" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Delete</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this/these machine(s)?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteMachines(selectedMachines)}>delete Machine</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table border="1" style={{ borderCollapse: "collapse", width: "10 0%" }}></table>
      <thead>
        <tr>
          <th style={{ width: "2%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "6%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>No</th>
          <th style={{ width: "8%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Machine ID</th>
          <th style={{ width: "12%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Type</th>
          <th style={{ width: "14%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Usable Shaft Length</th>
          <th colSpan={2} style={{ width: "14%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Strip Width</th>
          <th colSpan={2} style={{ width: "14%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Thickness</th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Box Peremeter</th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>GI Coating</th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>Number of Stations</th>
        </tr>
        <tr>
          <th style={{ width: "2%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "6%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "8%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "12%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "14%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "7%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>min</th>
          <th style={{ width: "7%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>max</th>
          <th style={{ width: "7%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>min</th>
          <th style={{ width: "7%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}>max</th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
          <th style={{ width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white', textAlign: "center", fontSize: "15px" }}></th>
        </tr>
      </thead>
      <tbody>
      {machines.map((machine) => (
        <tr key={machine._id}>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>
            <div className="form-check mx-3"><input className="form-check-input" type="checkbox" style={{borderRadius: "4px", borderWidth: "2px", borderColor: "black"}} checked ={selectedMachines.includes(machine._id)} onChange={() => add(machine._id)}/></div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.no}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.machineId}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.type}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.usableShaftLength}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.stripWidthMin}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.stripWidthMax}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.thicknessMin}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.thicknessMax}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.boxPerimeter}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.giCoating}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{machine.numberOfStations}</td>
        </tr>
      ))}
      </tbody>

    </div>
  );
}

const styles = {




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
  }
};

export default Machine;
