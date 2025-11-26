import { useEffect, useState } from "react";
import { handleError, handleSuccess } from '../ulits';
import { useLocation } from "react-router-dom";

function Material() {
  const location = useLocation();
  const [materialName, setMaterialName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [grade, setGrade] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [ysMin, setYSMin] = useState(0);
  const [newYSMin, setNewYSMin] = useState(0);
  const [ysMax, setYSMax] = useState(0);
  const [newYSMax, setNewYSMax] = useState(0);
  const [utsMin, setUTSMin] = useState(0);
  const [newUTSMin, setNewUTSMin] = useState(0);
  const [utsMax, setUTSMax] = useState(0);
  const [newUTSMax, setNewUTSMax] = useState(0);
  const [elMin, setElMin] = useState(0);
  const [newElMin, setNewElMin] = useState(0);
  const [elMax, setElMax] = useState(0);
  const [newElMax, setNewElMax] = useState(0);
  const [c, setC] = useState(0);
  const [newC, setNewC] = useState(0);
  const [mn, setMn] = useState(0);
  const [newMn, setNewMn] = useState(0);
  const [s, setS] = useState(0);
  const [newS, setNewS] = useState(0);
  const [p, setP] = useState(0);
  const [newP, setNewP] = useState(0);
  const [si, setSi] = useState(0);
  const [newSi, setNewSi] = useState(0);
  const [others, setOthers] = useState(0);
  const [newOthers, setNewOthers] = useState(0);
  const [cE, setCE] = useState(0);
  const [newCE, setNewCE] = useState(0);
  const [zincCoating, setZincCoating] = useState(false);
  const [newZincCoating, setNewZincCoating] = useState(false);
  const [zincCoatingMin, setZincCoatingMin] = useState(0);
  const [newZincCoatingMin, setNewZincCoatingMin] = useState(0);
  const [zincCoatingMax, setZincCoatingMax] = useState(0);
  const [newZincCoatingMax, setNewZincCoatingMax] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [reload, setReload] = useState(true);
  const token = localStorage.getItem('token')

  useEffect(() => {
        const fetchmaterials = async () => {
          try {
            const response = await fetch("https://deploy-mi-test-api.vercel.app/product/allmaterials", {
              method: "POST", // default method, can be omitted
              headers: {
                 'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json", // Ensure correct content type
              }
            });
            const data = await response.json();
            setMaterials(data)
          } catch (err) {
            console.error("Error fetching materials:", err.message);
          }
        };
    
        fetchmaterials();
    }, [location, reload] )

    const add = (id) => {
        if(selectedMaterials.includes(id)){
        setSelectedMaterials((prevSelected) => prevSelected.filter((materialId) => materialId !== id));
        } else {
        setSelectedMaterials((prevSelected) => [...prevSelected, id]);
        }
    };

    const editclicked = () => {
        for(let i = 0;i< materials.length;i++){
            if(materials[i]._id === selectedMaterials[0]){
                setNewMaterialName(materials[i].materialName);
                setNewGrade(materials[i].grade);
                setNewYSMin(materials[i].ysMin);
                setNewYSMax(materials[i].ysMax);
                setNewUTSMin(materials[i].utsMin);
                setNewUTSMax(materials[i].utsMax);
                setNewElMin(materials[i].elMin);
                setNewElMax(materials[i].elMax);
                setNewC(materials[i].c);
                setNewMn(materials[i].mn);
                setNewS(materials[i].s);
                setNewP(materials[i].p);
                setNewSi(materials[i].si);
                setNewOthers(materials[i].others);
                setNewCE(materials[i].cE);
                setNewZincCoating(materials[i].zincCoating);
                setNewZincCoatingMin(materials[i].zincCoatingMin);
                setNewZincCoatingMax(materials[i].zincCoatingMax);
                break;
            }
        }
    };
    
  const addmaterial = async(e) => {
      e.preventDefault();
      if(!materialName || !grade || !c || !mn || !s || !p || (zincCoating && (!zincCoatingMin || !zincCoatingMax))){
        return handleError('Please fill out all fields.')
      }
      try {
        const url = "https://deploy-mi-test-api.vercel.app/product/addmaterial";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json',
            
          },
          body: JSON.stringify({ materialName, grade, ysMin, ysMax, utsMin, utsMax, elMin, elMax, c, mn, s, p , si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax})
        })
        const result = await response.json();
        const {success, message, error} = result;
        if(success){
            setReload(!reload)
            handleSuccess(message)
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
          handleError(message)
        }
      }
      catch(err) {
        handleError(err);
      }
    };

    const deleteMaterails = async (selectedMaterials) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/product/deletematerial`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ selectedMaterials: selectedMaterials })
        });
        const result = await response.json();
        const {success, message, error} = result;
         if(success){
            setReload(!reload)
          handleSuccess(message)
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
          handleError(message)
        }
        setReload(!reload);
        setSelectedMaterials([])
      // const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const editMaterial = async () => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/product/editmaterial`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ selectedMaterials, newMaterialName, newGrade, newYSMin, newYSMax, newUTSMin, newUTSMax, newElMin, newElMax, newC, newMn, newS, newP, newSi, newOthers, newCE, newZincCoating, newZincCoatingMin, newZincCoatingMax })
        });
        const result = await response.json();
        const {success, message, error} = result;
         if(success){
            setReload(!reload)
          handleSuccess(message)
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
          handleError(message)
        }
        setReload(!reload);
        setSelectedMaterials([])
      // const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };
  

  return (
    <div style={{ padding: "0px" }}>
        <div  style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }}>
        {/* Centered Heading */}
        <h2 style={{ flex: 1, marginLeft: "35vw" }}>Material Library</h2>
        {/* Button Group */}
        <div className="btn-group" role="group" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-1" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Add Material</button>
          <div className="modal fade-dark modal-xl" id="exampleModal-1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel" style={{justifyContent: "center", display: "flex", width: "100%"}}>Add Material</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{padding: '30px'}}>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>1. Material</h5>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Standard Name</label>
                        <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Enter Material Standard Name..." style={styles.select}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Grade</label>
                        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Enter Material Grade..." style={styles.select}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>2. Mechanical Properties</h5>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.1. Yield Strength (Mpa)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={ysMin} onChange={(e) => setYSMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={ysMax} onChange={(e) => setYSMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.2. Ultimate Tensile Strength (Mpa)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={utsMin} onChange={(e) => setUTSMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={utsMax} onChange={(e) => setUTSMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.3. Percentage of Elongation (%)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={elMin} onChange={(e) => setElMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={elMax} onChange={(e) => setElMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>3. Chemical Composition</h5>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Carbon, C (%) max</label>
                        <input type="number" value={c} onChange={(e) => setC(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Manganese, Mn (%) max</label>
                        <input type="number" value={mn} onChange={(e) => setMn(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Sulphur, S (%) max</label>
                        <input type="number" value={s} onChange={(e) => setS(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Phosphorus, P (%) max</label>
                        <input type="number" value={p} onChange={(e) => setP(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Silicon, Si (%) max</label>
                        <input type="number" value={si} onChange={(e) => setSi(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Other (%) max</label>
                        <input type="number" value={others} onChange={(e) => setOthers(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Carbon Equivalent(CE) (%) max</label>
                        <input type="number" value={cE} onChange={(e) => setCE(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                            <div className="form-check">
                                <input className="form-check-input border border-dark" type="checkbox" checked={zincCoating} onClick={() => setZincCoating(!zincCoating)}/>
                                <h5 className="form-check-label">4. Zinc Coating (g/m*m)</h5>
                            </div>
                        </div>
                    </div>
                    {zincCoating && <>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                            <label>min</label>
                            <input type="number" value={zincCoatingMin} onChange={(e) => setZincCoatingMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                            </div>
                            <div style={styles.inputGroup}>
                            <label>max</label>
                            <input type="number" value={zincCoatingMax} onChange={(e) => setZincCoatingMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                            </div>
                        </div>
                    </>}
                    
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={addmaterial}>Add Material</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-2" style={{ backgroundColor: selectedMaterials.length === 1 ? "green" : "lightGreen", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }} disabled = {selectedMaterials.length !== 1} onClick={editclicked}>Edit Material</button>
          <div className="modal fade-dark modal-xl" id="exampleModal-2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel" style={{justifyContent: "center", display: "flex", width: "100%"}}>Edit Material</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{padding: '30px'}}>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>1. Material</h5>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Standard Name</label>
                        <input type="text" value={newMaterialName} onChange={(e) => setNewMaterialName(e.target.value)} placeholder="Enter Material Standard Name..." style={styles.select}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Grade</label>
                        <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="Enter Material Grade..." style={styles.select}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>2. Mechanical Properties</h5>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.1. Yield Strength (Mpa)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={newYSMin} onChange={(e) => setNewYSMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={newYSMax} onChange={(e) => setNewYSMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.2. Ultimate Tensile Strength (Mpa)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={newUTSMin} onChange={(e) => setNewUTSMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={newUTSMax} onChange={(e) => setNewUTSMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <h6>2.3. Percentage of Elongation (%)</h6>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>min</label>
                        <input type="number" value={newElMin} onChange={(e) => setNewElMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Max</label>
                        <input type="number" value={newElMax} onChange={(e) => setNewElMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <h5>3. Chemical Composition</h5>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Carbon, C (%) max</label>
                        <input type="number" value={newC} onChange={(e) => setNewC(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Manganese, Mn (%) max</label>
                        <input type="number" value={newMn} onChange={(e) => setNewMn(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Sulphur, S (%) max</label>
                        <input type="number" value={newS} onChange={(e) => setNewS(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Phosphorus, P (%) max</label>
                        <input type="number" value={newP} onChange={(e) => setNewP(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Silicon, Si (%) max</label>
                        <input type="number" value={newSi} onChange={(e) => setNewSi(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                        <div style={styles.inputGroup}>
                        <label>Other (%) max</label>
                        <input type="number" value={newOthers} onChange={(e) => setNewOthers(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                        <label>Carbon Equivalent(CE) (%) max</label>
                        <input type="number" value={newCE} onChange={(e) => setNewCE(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                        </div>
                    </div>
                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                            <div className="form-check">
                                <input className="form-check-input border border-dark" type="checkbox" checked={newZincCoating} onClick={() => setNewZincCoating(!newZincCoating)}/>
                                <h5 className="form-check-label">4. Zinc Coating (g/m*m)</h5>
                            </div>
                        </div>
                    </div>
                    {newZincCoating && <>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                            <label>min</label>
                            <input type="number" value={newZincCoatingMin} onChange={(e) => setNewZincCoatingMin(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                            </div>
                            <div style={styles.inputGroup}>
                            <label>max</label>
                            <input type="number" value={newZincCoatingMax} onChange={(e) => setNewZincCoatingMax(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                            </div>
                        </div>
                    </>}  
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={editMaterial}>Edit Materials</button>
                </div>
              </div>
            </div>
          </div>
          
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" style={{ backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>delete Material</button>
          <div className="modal fade-dark" id="exampleModal-3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Delete</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                   Are you sure you want to delete this/these material(s)?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteMaterails(selectedMaterials)}>delete Material</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table border="1" style={{ borderCollapse: "collapse", width: "10 0%" }}></table>
      <thead>
        <tr>
          <th style={{width: "2%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}></th>
          <th colSpan={3} style={{width: "23%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Material</th>
          <th colSpan={6} style={{width: "30%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Mechanical Properties (Mpa, Mpa, %)<br/></th>
          <th colSpan={7} style={{width: "35%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Chemical Composition (%max)</th>
          <th colSpan={2} style={{width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Zinc Coating</th>
        </tr>
        <tr>
            <th style={{position: "sticky",top: "0", width: "2%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}><br/></th>
            <th style={{position: "sticky",top: "0", width: "8.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>No</th>
            <th style={{position: "sticky",top: "0", width: "12%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Standard name</th>
            <th style={{position: "sticky",top: "0", width: "10%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Grade</th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>YS(min)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>YS(max)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>UTS(min)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>UTS(max)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>e(min)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>e(max)<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>C<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>Mn<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>S<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>P<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>Si<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>Others<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>CE<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>min<br/></th>
            <th style={{position: "sticky",top: "0", width: "4.5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "12px"}}>max<br/></th>
        </tr>
      </thead>
      <tbody>
      {materials.map((material) => (
        <tr key={material._id}>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>
            <div className="form-check mx-3"><input className="form-check-input" type="checkbox" style={{borderRadius: "4px", borderWidth: "2px", borderColor: "black"}} checked ={selectedMaterials.includes(material._id)} onClick={() => add(material._id)}/></div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.materialNo}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.materialName}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.grade}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.ysMin <= 0) ? "_" : material.ysMin}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.ysMax <= 0) ? "_" : material.ysMax}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.utsMin <= 0) ? "_" : material.utsMin}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.utsMax <= 0) ? "_" : material.utsMax}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.elMin <= 0) ? "_" : material.elMin}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.elMax <= 0) ? "_" : material.elMax}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.c}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.mn}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.s}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{material.p}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.si <= 0) ? "_" : material.si}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.others <= 0) ? "_" : material.others}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.cE <= 0) ? "_" : material.cE}</td>
          {material.zincCoating && <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.zincCoatingMin <= 0) ? "_" : material.zincCoatingMin}</td>}
          {material.zincCoating && <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{(material.zincCoatingMax <= 0) ? "_" : material.zincCoatingMax}</td>}
          {!material.zincCoating && <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}> - </td>}
          {!material.zincCoating && <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}> - </td>}

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

export default Material;
