import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleError, handleSuccess } from '../ulits';
import { downloadExcel } from "./Download/ExcelGenerator";

function Inquiry() {
  const email = localStorage.getItem('loggedINUserEmail')
  const [enquirieNo, setEnquirieNo] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const location = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [customerRefNo, setCustomerRefNo] = useState("");
  const [kAMName, setKAMName] = useState("")
  const [profileName, setProfileName] = useState("");
  const [profileNo, setProfileNo] = useState("");
  const [twoD, setTwoD] = useState("");
  const [threeD, setThreeD] = useState("");
  const [machine, setMachine] = useState("");
  const [tools, setTools] = useState(""); 
  const [fixture, setFixture] = useState("");
  const [stripWidth, setStripWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [type, setType] = useState(0);
  const [thickness, setThickness] = useState(0);
  const [boxPerimeter, setBoxPerimeter] = useState(1)
  const [click1, setClick1] = useState(false)
  const [click4, setClick4] = useState(false)
  const [shortRadiusBendingRadius, setShortRadiusBendingRadius] = useState(0);
  const [shortRadiusBendingThickness, setShortRadiusBendingThickness] = useState(0);
  const [click5, setClick5] = useState(false)
  const [longRadiusBendingRadius, setLongRadiusBendingRadius] = useState(0);
  const [longRadiusBendingThickness, setLongRadiusBendingThickness] = useState(0);
  const [click2, setClick2] = useState(false)
  const [laserCuttingLength, setLaserCuttingLength] = useState(0);
  const [laserCuttingThickness, setLaserCuttingThickness] = useState(0);
  const [click3, setClick3] = useState(false) 
  const [powderCoatingLength, setPowderCoatingLength] = useState(0);
  const [holePunching, setHolePunching] = useState(false);
  const [holePunchingDetails, setHolePunchingDetails] = useState("");
  const [assemblyProcess, setAssemblyProcess] = useState(false);
  const [assemblyProcessDetails, setAssemblyProcessDetails] = useState("");
  const [click6, setClick6] = useState(false)
  const [outsourceActivity, setOutsourceActivity] = useState("");
  const [material, setMaterial] = useState("");
  const [materialIndianEquiv, setMaterialIndianEquiv] = useState("");
  const [tolerance, setTolerance] = useState("Greater than 0.5");
  const [customerSpecReq, setCustomerSpecReq] = useState("");
  const [packingSpc, setPackingSpc] = useState("");
  const [sample, setSample] = useState("");
   const [unit1, setUnit1] = useState("Ton")
  const [unit2, setUnit2] = useState("Ton")
  const [volumeMonthly, setVolumeMonthly] = useState(0)
  const [volumeMonthlyInTon, setVolumeMonthlyInTon] = useState(0);
  const [volumeYearly, setVolumeYearly] = useState(0)
  const [volumeYearlyInTon, setVolumeYearlyInTon] = useState(0)
  const [spare, setSpare] = useState("");
  const [reason, setReason] = useState("")
  const [statuttery, setStatuttery] = useState("");
  const [unstared, setUnstared] = useState("");
  const [unstaredval, setUnstaredval] = useState("")
  const [risk, setRisk] = useState("");
  const [riskReason, setRiskReason] = useState("")
  const [reload, setReload] = useState(true);
  const [tab1, setTab1] = useState(true);
  const [id, setId] = useState("");
  const [result, setResult] = useState(-1)
  const token = localStorage.getItem('token')

  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const d = String(ist.getDate()).padStart(2, "0");
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const y = ist.getFullYear();
  const [reviewDate, setReviewDate] = useState("");
  const [enquirieDate, setEnquirieDate] = useState("");

  const boolToText = (val) => (val ? "Yes" : "No");

  useEffect(() => {
      if(unit1 === "Num" ) setVolumeMonthlyInTon(((stripWidth*thickness*length*7850*0.000000001)*volumeMonthly).toFixed(3));
      else if(unit1 === "Kg") setVolumeMonthlyInTon(volumeMonthly/1000);
      else setVolumeMonthlyInTon(volumeMonthly)
    }, [volumeMonthly, unit1]);
  
    useEffect(() => {
      if(unit2 === "Num" ) setVolumeYearlyInTon(((stripWidth*thickness*length*7850*0.000000001)*volumeYearly).toFixed(3));
      else if(unit2 === "Kg") setVolumeYearlyInTon(volumeYearly/1000);
      else setVolumeYearlyInTon(volumeYearly)
    }, [volumeYearly, unit2]);
  

  useEffect(() => {
          const fetchenquiries = async () => {
            try {
              const response = await fetch("https://deploy-mi-test-api.vercel.app/enquirie/allenquiries", {
                method: "POST", // default method, can be omitted
                headers: {
                   'Authorization': `Bearer ${token}`,
                  "Content-Type": "application/json", // Ensure correct content type
                },
                body: JSON.stringify({email})
              });
              const data = await response.json();
              setEnquiries(data); 
            } catch (err) {
              console.error("Error fetching materials:", err.message);
            }
          };
      
          fetchenquiries();
      }, [location, reload] )

      const add = (id) => {
        if(selectedEnquiries.includes(id)){
        setSelectedEnquiries((prevSelected) => prevSelected.filter((enquirieId) => enquirieId !== id));
        } else {
        setSelectedEnquiries((prevSelected) => [...prevSelected, id]);
        }
    };

    const deleteenquiries = async () => {
        try {
          const response = await fetch(`https://deploy-mi-test-api.vercel.app/enquirie/deleteenquirie`, {
            method: "DELETE", // default method, can be omitted
              headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json", // Ensure correct content type
              },
              body: JSON.stringify({email, selectedEnquiries: selectedEnquiries })
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
            setSelectedEnquiries([]);setTab1(true);
          // const message = await response.json();
        } catch (error) {
          alert("Failed to update enquiries");
        }
      };

      const handleclick = (customId) => {
        setTab1(true)
        setId(customId);
        for(let i = 0;i< enquiries.length;i++){
            if(enquiries[i]._id === customId){
                setEnquirieNo(enquiries[i].iD);
                setCustomerName(enquiries[i].customerName);
                setCustomerRefNo(enquiries[i].customerRefNo);
                setKAMName(enquiries[i].kAMName);
                setProfileName(enquiries[i].profileName);
                setProfileNo(enquiries[i].profileNo);
                setTwoD(enquiries[i].twoD);
                setThreeD(enquiries[i].threeD);
                setMachine(enquiries[i].machine);
                setTools(enquiries[i].tools);
                setFixture(enquiries[i].fixture);
                setStripWidth(enquiries[i].stripWidth);
                setLength(enquiries[i].length);
                setType(enquiries[i].type);
                setThickness(enquiries[i].thickness);
                setBoxPerimeter(enquiries[i].boxPerimeter);
                setClick1(enquiries[i].click1);
                setClick4(enquiries[i].click4);
                setShortRadiusBendingRadius(enquiries[i].shortRadiusBendingRadius);
                setShortRadiusBendingThickness(enquiries[i].shortRadiusBendingThickness);
                setClick5(enquiries[i].click5);
                setLongRadiusBendingRadius(enquiries[i].longRadiusBendingRadius);
                setLongRadiusBendingThickness(enquiries[i].longRadiusBendingThickness);
                setClick2(enquiries[i].click2);
                setLaserCuttingLength(enquiries[i].laserCuttingLength);
                setLaserCuttingThickness(enquiries[i].laserCuttingThickness);
                setClick3(enquiries[i].click3);
                setPowderCoatingLength(enquiries[i].powderCoatingLength);
                setHolePunching(enquiries[i].holePunching);
                setHolePunchingDetails(enquiries[i].holePunchingDetails);
                setAssemblyProcess(enquiries[i].assemblyProcess);
                setAssemblyProcessDetails(enquiries[i].assemblyProcessDetails);
                setClick6(enquiries[i].click6);
                setOutsourceActivity(enquiries[i].outsourceActivity);
                setMaterial(enquiries[i].material);
                setMaterialIndianEquiv(enquiries[i].materialIndianEquiv);
                setTolerance(enquiries[i].tolerance);
                setCustomerSpecReq(enquiries[i].customerSpecReq);
                setPackingSpc(enquiries[i].packingSpc);
                setSample(enquiries[i].sample);
                setVolumeMonthly(enquiries[i].volumeMonthlyInTon);
                setVolumeMonthlyInTon(enquiries[i].volumeMonthlyInTon);
                setVolumeYearly(enquiries[i].volumeYearlyInTon);
                setVolumeYearlyInTon(enquiries[i].volumeYearlyInTon);
                setSpare(enquiries[i].spare);
                setReason(enquiries[i].reason);
                setStatuttery(enquiries[i].statuttery);
                setUnstared(enquiries[i].unstared);
                setUnstaredval(enquiries[i].unstaredval);
                setRisk(enquiries[i].risk);
                setRiskReason(enquiries[i].riskReason);
                setEnquirieDate(enquiries[i].enquirieDate);
                setReviewDate(enquiries[i].reviewDate);
                setResult(enquiries[i].result);
            }
        }
    };

      const handleModify = (customId) => {
        setTab1(false);
    };

    const handleSaveChanges = async(e) => {
       e.preventDefault();
       if(!customerName || !customerRefNo || !kAMName || !profileName || !profileNo || !twoD || !threeD || !machine || !tools || !fixture || (click1 && ((click4 && (!longRadiusBendingRadius || !longRadiusBendingThickness)) || (click5 && (!shortRadiusBendingRadius || !shortRadiusBendingThickness)))) || (click2 && (!laserCuttingLength || !laserCuttingThickness)) || (click3 && !powderCoatingLength) || !tolerance || !customerSpecReq || !packingSpc || !sample || !volumeMonthlyInTon || !volumeYearlyInTon || !spare || !statuttery || !unstared || !risk){
          return handleError('Please fill out all fields.')
        }

        if(twoD === "Essential to proceed" || threeD === "Essential to proceed" || machine === "Regret" || tools === "Regret" || fixture === "Regret" || (type === "Open" && (stripWidth <= 10 || stripWidth >220 || thickness <= 0.4 || thickness > 4)) || (type === "Close" && (stripWidth <= 10 || stripWidth >340 || thickness<= 0.8 || thickness >4)) || (click1 && ((click4 && (shortRadiusBendingRadius <=40 || shortRadiusBendingRadius > 400 || shortRadiusBendingThickness <= 0.8 || shortRadiusBendingThickness > 6)) || (click5 && (longRadiusBendingRadius <= 400 || longRadiusBendingRadius >10000 || longRadiusBendingThickness <= 0.8 || longRadiusBendingThickness >6)))) || (click2 && (laserCuttingLength <= 10 || laserCuttingLength > 3000 || laserCuttingThickness <= 0.8 || laserCuttingThickness > 10)) || (click3 && (powderCoatingLength <= 200 || powderCoatingLength >3000)) || material === "Cannot be sourced" || tolerance === "Less than 0.1" || customerSpecReq === "Not achievable" || packingSpc === "Not achievable" || statuttery === "Cannot comply" || risk === "High") setResult(0);

        else if(machine === "To be developed"|| tools === "To be developed" || fixture === "To be developed" || holePunching || assemblyProcess || click6 || tolerance === "0.1 - 0.5" || customerSpecReq === "Need detailed study" || packingSpc === "Customer Specific" || sample === "Essential to proceed" || spare === "No" || statuttery === "Yes, Will be complied" || unstared === "Yes" || risk === "Med") setResult(1);

        else setResult(2);
        setReviewDate(`${d}-${m}-${y}`);
        try {
              const response = await fetch(`https://deploy-mi-test-api.vercel.app/enquirie/editenquirie`, {
                method: "PUT", // default method, can be omitted
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json", // Ensure correct content type
                  },
                 body: JSON.stringify({email, id, customerName, customerRefNo, kAMName, profileName, profileNo, twoD, threeD, machine, tools, fixture, click1, click4, shortRadiusBendingRadius, shortRadiusBendingThickness, click5, longRadiusBendingRadius, longRadiusBendingThickness, click2, laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result, reviewDate})
                });
                const result1 = await response.json();
                const {success, message, error} = result1;
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
              // const message = await response.json();
            } catch (error) {
              alert(error.message || "Failed to update enquiries");
            }
    };

  return (
    <>
      <div  style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }}>
        {/* Centered Heading */}
        <h2 style={{ flex: 1, marginLeft: "40vw" }}>Enquiries</h2>
        {/* Button Group */}
        <div className="btn-group" role="group" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>        
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" style={{ backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Remove</button>
          <div className="modal fade-dark" id="exampleModal-3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Remove</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to revoke these enquirie website?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteenquiries(selectedEnquiries)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table border="1" style={{ borderCollapse: "collapse", width: "10 0%" }}></table>
      <thead>
        <tr>
          <th style={{ width: "2%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}></th>
          <th style={{ width: "5%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>ID</th>
          <th style={{ width: "17%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Customer Name</th>
          <th style={{ width: "17%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Profile Name</th>
          <th style={{ width: "17%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>KAM Name</th>
          <th style={{ width: "17%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Date of Inquiry</th>
          <th style={{ width: "17%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Enquiry Status</th>
          <th style={{ width: "8%", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>View Details</th>
        </tr>
      </thead>
      <tbody>
      {enquiries.map((enquirie) => (
        <tr key={enquirie._id}>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>
            <div className="form-check mx-3"><input className="form-check-input" type="checkbox" style={{borderRadius: "4px", borderWidth: "2px", borderColor: "black"}} checked ={selectedEnquiries.includes(enquirie._id)} onClick={() => add(enquirie._id)}/></div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{enquirie.iD}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{enquirie.customerName}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{enquirie.profileName}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{enquirie.kAMName}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{enquirie.time}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px", backgroundColor:  enquirie.result == 2 ? "green" : enquirie.result == 1 ? "yellow" : "red" }}>{enquirie.result == 2 ? "FEASIBLE" : enquirie.result == 1 ? "FEASIBLE WITH MODIFICATION" : "NOT FEASIBLE"}</td>
          <td style={{textAlign: "center", border: "1px solid black",margin: "0", backgroundColor: "blue"}}>
            <button type="button" data-bs-toggle="modal" data-bs-target={`#exampleModal-1${enquirie.iD}`} style={{ backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px" }} onClick={() => handleclick(enquirie._id)}>Click</button>
            <div className="modal fade-dark" id={`exampleModal-1${enquirie.iD}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-xl">
                {tab1 && 
                  <div className="modal-content">
                    <div className="modal-body">
                      <div style={styles.container}>
                        <h2 style={styles.title}>Details Summary</h2> 
                        <section style={styles.section}> 
                          <h4 style={styles.subHeading}></h4><br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Customer Name :   {enquirie.customerName}</label></div>
                              <div style={styles.inputGroup}><label>Customer Ref No : {enquirie.customerRefNo}</label></div>
                              <div style={styles.inputGroup}><label>Key Account Manager Name : {enquirie.kAMName}</label></div>
                              <div style={styles.inputGroup}><label>Profile Name : {enquirie.profileName} </label></div>
                              <div style={styles.inputGroup}><label>Profile No : {enquirie.profileNo}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}><h5>1. Drawing Issued by Customer</h5></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>2D : {enquirie.twoD}</label></div>
                              <div style={styles.inputGroup}><label>3D : {enquirie.threeD}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}><h5>2. Availability of Equipments</h5></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Machine : {enquirie.machine}</label></div>
                              <div style={styles.inputGroup}><label>Tools : {enquirie.tools}</label></div>
                              <div style={styles.inputGroup}><label>Fixtures/Measuring Equipment : {enquirie.machine}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}><h5>3. Process</h5></div>
                          <div style={styles.inputRow}><h6>3.1. Roll Forming Process</h6></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label style={{backgroundColor: (enquirie.stripWidth < 10 || enquirie.stripWidth > 570) ? "red" : "#00FF00", borderRadius: "5px"}}>Strip Width :   {enquirie.stripWidth} mm</label></div>
                              <div style={styles.inputGroup}><label>Profile Type : {enquirie.type} Profile</label></div>
                              <div style={styles.inputGroup}><label style={{backgroundColor: (enquirie.thickness < 0.6 || enquirie.thickness > 12) ? "red" : "#00FF00", borderRadius: "5px"}}>Thickness :  {enquirie.thickness} mm</label></div>
                              <div style={styles.inputGroup}><label>Box Perimeter : {enquirie.boxPerimeter}1 mm</label></div>
                          </div>
                          <div style={styles.inputRow}><h6>3.2. Post Forming Process</h6></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Bending :   {boolToText(enquirie.bending)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.click1 && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Short Radius :   {boolToText(enquirie.click4)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>}
                          {enquirie.click1 && enquirie.click4 &&
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Radius : {enquirie.shortRadiusBendingRadius} mm</label></div>
                              <div style={styles.inputGroup}><label>Thickness : {enquirie.shortRadiusBendingThickness} mm</label></div>
                          </div>}
                          {enquirie.click1 && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Long Radius : {boolToText(enquirie.click5)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>}
                          {enquirie.click1 && enquirie.click5 &&
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Radius : {enquirie.longRadiusBendingRadius} mm</label></div>
                              <div style={styles.inputGroup}><label>Thickness : {enquirie.longRadiusBendingThickness} mm</label></div>
                          </div>}
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Laser Cutting : {boolToText(enquirie.click2)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.click2 && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Length : {enquirie.laserCuttingLength} mm</label></div>
                              <div style={styles.inputGroup}><label>Thickness : {enquirie.laserCuttingThickness} mm</label></div>
                          </div>}
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Powder Coating : {boolToText(enquirie.click3)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.click3 && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Length : {enquirie.powderCoatingLength} mm</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>}
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Hole Punching : {boolToText(enquirie.holePunching)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.holePunching && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Details : </label></div>
                              <div style={styles.inputGroup}><label>{enquirie.holePunchingDetails}</label></div>
                          </div>}
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Assembly Process : {boolToText(enquirie.assemblyProcess)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.assemblyProcess && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Details :</label></div>
                              <div style={styles.inputGroup}><label>{enquirie.assemblyProcessDetails}</label></div>
                          </div>}
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Assembly Process : {boolToText(enquirie.click6)}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div>
                          {enquirie.assemblyProcess && 
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Details</label></div>
                              <div style={styles.inputGroup}><label>{enquirie.assemblyProcessDetails}</label></div>
                          </div>}<br/>
                          <div style={styles.inputRow}><h5>4. Can engineering specifications specified by customer be met?</h5></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h6>4.1 Material</h6></div>
                              <div style={styles.inputGroup}><label>{enquirie.material}</label></div>
                              <div style={styles.inputRow}><label>4.2 Material Indian Equivalent</label></div>
                              <div style={styles.inputGroup}><label>{enquirie.materialIndianEquiv}</label></div>
                          </div>
                          
                          <div style={styles.inputRow}>
                            <div style={styles.inputRow}><h6>4.3 Tolerance</h6></div>
                              <div style={styles.inputGroup}><label>{enquirie.tolerance}</label></div>
                              <div style={styles.inputGroup}><label></label></div>
                              <div style={styles.inputGroup}><label></label></div>
                          </div><br/>
                          <div style={styles.inputRow}><h5>5. Any additional documents required?</h5></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>on Customer Spc. Requirement : {enquirie.customerSpecReq}</label></div>
                              <div style={styles.inputGroup}><label>on Packing Spc. : {enquirie.packingSpc}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h5>6. Any sample required from the customer?</h5></div>
                              <div style={styles.inputGroup}><label> {enquirie.sample}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}><h5>7. Projected Volume</h5></div>
                          <div style={styles.inputRow}>
                              <div style={styles.inputGroup}><label>Monthly : {enquirie.volumeMonthlyInTon} Ton</label></div>
                              <div style={styles.inputGroup}><label>Yearly : {enquirie.volumeYearlyInTon} Ton</label></div>
                          </div><br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h5>8. Considering Project Volume, is spare capacity available?</h5></div>
                              <div style={styles.inputGroup}><label> {enquirie.spare}</label></div>
                          </div>
                          {enquirie.spare !== "No" &&
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h6>If No, Reason</h6></div>
                              <div style={styles.inputGroup}><label> {enquirie.reason}</label></div>
                          </div>}<br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h5>9. Statutory and Regulatory Requirement?</h5></div>
                              <div style={styles.inputGroup}><label> {enquirie.statuttery}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h5>10. Any Un stated Requirements?</h5></div>
                              <div style={styles.inputGroup}><label> {enquirie.unstared}</label></div>
                          </div><br/>
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h5>11. Business Risk</h5></div>
                              <div style={styles.inputGroup}><label> {enquirie.risk}</label></div>
                          </div>
                          {enquirie.risk !== "Low" &&
                          <div style={styles.inputRow}>
                              <div style={styles.inputRow}><h6>Reason</h6></div>
                              <div style={styles.inputGroup}><label> {enquirie.riskReason}</label></div>
                          </div>}
                        </section>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-success mx-4" onClick={() => {downloadExcel(enquirieNo, customerName,customerRefNo,kAMName,profileName,profileNo,twoD,threeD,machine,tools,fixture,click1,click4, shortRadiusBendingRadius, shortRadiusBendingThickness, click5, longRadiusBendingRadius, longRadiusBendingThickness, click2,laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthly, volumeMonthlyInTon, volumeYearly, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result, unit1, unit2, boxPerimeter, type, stripWidth, thickness, boxPerimeter, length, enquirieDate, reviewDate)}}>Download</button>
                      <button type="button" className="btn btn-primary" onClick={() => handleModify(enquirie._id)}>Modify</button>
                    </div>
                  </div>
                }
                {!tab1 &&
                  <div className="modal-content">
                    <div className="modal-body">
                      <div style={styles.container}>
                        <h2 style={styles.title}>Modify Enquirie</h2> 
                        <section style={styles.section}>
                        <h4 style={styles.subHeading}></h4>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <label>Customer Name</label>
                                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Type Customer Name..." style={styles.select}/>
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Customer Ref No.</label>
                                <input type="text" value={customerRefNo} onChange={(e) => setCustomerRefNo(e.target.value)} placeholder="Type Customer Reference Number..." style={styles.select}/>
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <label>Key Account Manager Name</label>
                                <input type="text" value={kAMName} onChange={(e) => setKAMName(e.target.value)} placeholder="Type Key Account Manager Name..." style={styles.select}/>
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <label>Profile Name</label>
                                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Type Profile Name..." style={styles.select}/>
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Profile No.</label>
                                <input type="text" value={profileNo} onChange={(e) => setProfileNo(e.target.value)} placeholder="Type Profile Number..." style={styles.select}/>
                            </div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>1. Drawing Issued by Customer</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Available</label></div>
                            <div style={styles.inputGroup}><label>Not Required</label></div>
                            <div style={styles.inputGroup}><label>Essential to proceed</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>2D</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={twoD === "Available"} onClick={()=>setTwoD("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={twoD === "Not Required"} onClick={()=>setTwoD("Not Required")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={twoD === "Essential to proceed"} onClick={()=>setTwoD("Essential to proceed")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>3D</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={threeD === "Available"} onClick={()=>setThreeD("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={threeD === "Not Required"} onClick={()=>setThreeD("Not Required")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={threeD === "Essential to proceed"} onClick={()=>setThreeD("Essential to proceed")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>2. Availability of Equipments</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Available</label></div>
                            <div style={styles.inputGroup}><label>To be developed</label></div>
                            <div style={styles.inputGroup}><label>Regret</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>Machine</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={machine === "Available"} onClick={()=>setMachine("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={machine === "To be developed"} onClick={()=>setMachine("To be developed")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={machine === "Regret"} onClick={()=>setMachine("Regret")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>Tools</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={tools === "Available"} onClick={()=>setTools("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={tools === "To be developed"} onClick={()=>setTools("To be developed")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={tools === "Regret"} onClick={()=>setTools("Regret")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>Fixtures/Measuring Equipment</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={fixture === "Available"} onClick={()=>setFixture("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={fixture === "To be developed"} onClick={()=>setFixture("To be developed")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={fixture === "Regret"} onClick={()=>setFixture("Regret")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>3. Process</h5></div>
                        <div style={styles.inputRow}><h6>3.1. Roll Forming Process</h6></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label style={{backgroundColor: (stripWidth < 10 || stripWidth > 570) ? "red" : "#00FF00", borderRadius: "5px"}}>Strip Width :   {stripWidth} mm</label></div>
                            <div style={styles.inputGroup}><label>Profile Type : {type} Profile</label></div>
                            <div style={styles.inputGroup}><label style={{backgroundColor: (thickness < 0.6 || thickness > 12) ? "red" : "#00FF00", borderRadius: "5px"}}>Thickness :  {thickness} mm</label></div>
                            <div style={styles.inputGroup}><label>Box Perimeter : {boxPerimeter} mm</label></div>
                        </div>
                        <div style={styles.inputRow}><h6>3.2. Post Forming Process</h6></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={click1} onClick={() => {setClick1(!click1);setClick4(click1&&click4);setClick5(click1&&click5)}}/>
                                    <label className="form-check-label">Bending</label>
                                </div>
                            </div>
                        </div>
                        {click1 && <>
                            {(click4 || click5) && <>
                                <div style={styles.inputRow}>
                                    <div style={styles.inputGroup}><label></label></div>
                                    <div style={styles.inputGroup}><label>Radius (mm)</label></div>
                                    <div style={styles.inputGroup}><label>Thickness (mm)</label></div>
                                </div>
                            </>}
                            <div style={styles.inputRow}>
                                <div style={styles.inputGroup}>
                                    <div className="form-check">
                                        <input className="form-check-input border border-dark" type="checkbox" checked={click4} onClick={() => setClick4(!click4)}/>
                                        <label className="form-check-label">Short Radius</label>
                                    </div>
                                </div>
                                {click4 && <>
                                    <div style={styles.inputGroup}><input type="number" value={shortRadiusBendingRadius} onChange={(e) => setShortRadiusBendingRadius(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/></div>
                                    <div style={styles.inputGroup}><input type="number" value={shortRadiusBendingThickness} onChange={(e) => setShortRadiusBendingThickness(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/></div>
                                </>}
                            </div>
                            <div style={styles.inputRow}>
                                <div style={styles.inputGroup}>
                                    <div className="form-check">
                                        <input className="form-check-input border border-dark" type="checkbox" checked={click5} onClick={() => setClick5(!click5)}/>
                                        <label className="form-check-label">Long Radius</label>
                                    </div>
                                </div>
                                {click5 && <>
                                    <div style={styles.inputGroup}>
                                        <input type="number" value={longRadiusBendingRadius} onChange={(e) => setLongRadiusBendingRadius(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <input type="number" value={longRadiusBendingThickness} onChange={(e) => setLongRadiusBendingThickness(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                                    </div>
                                </>}
                            </div>
                        </>}
                        <h4 style={styles.subHeading}></h4>
                        {(click2 || click3) && <>
                            <div style={styles.inputRow}>
                                <div style={styles.inputGroup}><label></label></div>
                                <div style={styles.inputGroup}><label>Length (mm)</label></div>
                                <div style={styles.inputGroup}><label>Thickness (mm)</label></div>
                            </div>
                        </>}
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={click2} onClick={() => setClick2(!click2)}/>
                                    <label className="form-check-label">Laser Cutting</label>
                                </div>
                            </div>
                            {click2 && <>
                                <div style={styles.inputGroup}>
                                    <input type="number" value={laserCuttingLength} onChange={(e) => setLaserCuttingLength(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                                </div>
                                <div style={styles.inputGroup}>
                                    <input type="number" value={laserCuttingThickness} onChange={(e) => setLaserCuttingThickness(e.target.value)} style={styles.select} onFocus={(e) => e.target.select()}/>
                                </div>
                            </>}
                        </div>
                        <h4 style={styles.subHeading}></h4>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={click3} onClick={() => setClick3(!click3)}/>
                                    <label className="form-check-label">Powder Coating</label>
                                </div>
                            </div>
                            {click3 && <>
                                <div style={styles.inputGroup}>
                                    <input type="number" value={powderCoatingLength} onChange={(e) => setPowderCoatingLength(e.target.value)} placeholder="Type Length..." style={styles.select} onFocus={(e) => e.target.select()}/>
                                </div>
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputGroup}><label></label></div>
                                </div>
                            </>}
                        </div>
                        <h4 style={styles.subHeading}></h4>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={holePunching} onClick={() => setHolePunching(!holePunching)}/>
                                    <label className="form-check-label">Hole Punching</label>
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={assemblyProcess} onClick={() => setAssemblyProcess(!assemblyProcess)}/>
                                    <label className="form-check-label">Assembly Process</label>
                                </div>
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                {holePunching ? 
                                <input type="text" value={holePunchingDetails} onChange={(e) => setHolePunchingDetails(e.target.value)} placeholder="Type Details..." style={styles.select}/>
                            : <label></label>} 
                            </div>
                            <div style={styles.inputGroup}>
                                {assemblyProcess ? 
                                <input type="text" value={assemblyProcessDetails} onChange={(e) => setAssemblyProcessDetails(e.target.value)} placeholder="Type Details..." style={styles.select}/>
                            : <label></label>} 
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <div className="form-check">
                                    <input className="form-check-input border border-dark" type="checkbox" checked={click6} onClick={() => setClick6(!click6)}/>
                                    <h6 className="form-check-label">3.3. Any Outsource Activity Required</h6>
                                </div>
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            {click6 && <>
                                <div style={styles.inputGroup}>
                                    <input type="text" value={outsourceActivity} onChange={(e) => setOutsourceActivity(e.target.value)} placeholder="Type Outsource Activity Required..." style={styles.select}/>
                                </div>
                            </>}
                        </div><br/>
                        <div style={styles.inputRow}><h5>4. Can engineering specifications specified by customer be met?</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Customer Specified</label></div>
                            <div style={styles.inputGroup}><label>Indian Equivalent</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><h6>4.1 Material</h6></div>
                            <div style={styles.inputGroup}>
                                <select className="form-select" aria-label="Default select example">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <select className="form-select" aria-label="Default select example">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><h6>4.2 Tolerance</h6></div>
                            <div style={styles.inputGroup}>
                                <select value={tolerance} onChange={(e) =>setTolerance(e.target.value)} className="form-select" aria-label="Default select example">
                                    <option value="Greater than 0.5">Greater than 0.5</option>
                                    <option value="0.1 - 0.5">0.1 - 0.5</option>
                                    <option value="Less than 0.1">Less than 0.1</option>
                                </select>
                                <text style={{fontSize: "11px", color: "gray"}}>Min tolerance specified in the drawing</text>
                            </div>
                            <div style={styles.inputGroup}></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>5. Any additional documents required?</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Achievable</label></div>
                            <div style={styles.inputGroup}><label>Need detailed study</label></div>
                            <div style={styles.inputGroup}><label>Not achievable</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>on Customer Spc. Requirement</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={customerSpecReq === "Achivable"} onClick={()=>setCustomerSpecReq("Achivable")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={customerSpecReq === "Need detailed study"} onClick={()=>setCustomerSpecReq("Need detailed study")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={customerSpecReq === "Not achievable"} onClick={()=>setCustomerSpecReq("Not achievable")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>MI Standard</label></div>
                            <div style={styles.inputGroup}><label>Customer Specific</label></div>
                            <div style={styles.inputGroup}><label>Not achievable</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>on Packing Spc.</label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={packingSpc === "MI Standard"} onClick={()=>setPackingSpc("MI Standard")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={packingSpc === "Customer Specific"} onClick={()=>setPackingSpc("Customer Specific")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={packingSpc === "Not achievable"} onClick={()=>setPackingSpc("Not achievable")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>6. Any sample required from the customer? </h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Available</label></div>
                            <div style={styles.inputGroup}><label>Not Required</label></div>
                            <div style={styles.inputGroup}><label>Essential to proceed</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={sample === "Available"} onClick={()=>setSample("Available")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={sample === "Not Required"} onClick={()=>setSample("Not Required")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={sample === "Essential to proceed"} onClick={()=>setSample("Essential to proceed")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><h5>7. Projected Volume</h5></div>
                            <div style={styles.inputGroup}><label>Monthly</label></div>
                            <div style={styles.inputGroup}><label>Yearly</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <input type="number" value={volumeMonthly} onChange={(e) => setVolumeMonthly(e.target.value)} style={{padding: "8px", border: "1px solid #ccc", borderRight: "none", borderRadius: "6px 0 0 6px", outline: "none"}} onFocus={(e) => e.target.select()}/>
                                    {/* Unit Selector */}
                                    <select value={unit1} onChange={(e) => setUnit1(e.target.value)} style={{width:"75px",padding: "8px", border: "1px solid #ccc", borderRadius: "0 6px 6px 0", outline: "none", background: "#f9f9f9"}}>
                                        <option value="Num">Num</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Ton">Ton</option>
                                    </select>
                                </div>
                                <text>{volumeMonthlyInTon} Ton</text>
                            </div>
                            <div style={styles.inputGroup}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <input type="number" value={volumeYearly} onChange={(e) => setVolumeYearly(e.target.value)} style={{padding: "8px", border: "1px solid #ccc", borderRight: "none", borderRadius: "6px 0 0 6px", outline: "none"}} onFocus={(e) => e.target.select()}/>
                                    {/* Unit Selector */}
                                    <select value={unit2} onChange={(e) => setUnit2(e.target.value)} style={{width:"75px",padding: "8px", border: "1px solid #ccc", borderRadius: "0 6px 6px 0", outline: "none", background: "#f9f9f9"}}>
                                        <option value="Num">Num</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Ton">Ton</option>
                                    </select>
                                </div>
                                <text>{volumeYearlyInTon} Ton</text>
                            </div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>8. Considering Project Volume, is spare capacity available?</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Yes</label></div>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>No</label></div>                
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={spare === "Yes"} onClick={()=>setSpare("Yes")}/></div>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={spare === "No"} onClick={()=>setSpare("No")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            {spare === "No" && <>
                                <div style={styles.inputGroup}><label>If No Then Give Reason</label>
                                <input type="name" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type Reason..." style={styles.select}/></div>   
                            </>}
                        </div><br/>
                        <div style={styles.inputRow}><h5>9. Statutory and Regulatory Requirement?</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label>No</label></div>
                            <div style={styles.inputGroup}><label>Yes, & Complied</label></div>
                            <div style={styles.inputGroup}><label>Yes, Will be complied</label></div>
                            <div style={styles.inputGroup}><label>Cannot comply</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={statuttery === "No"} onClick={()=>setStatuttery("No")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={statuttery === "Yes, & Complied"} onClick={()=>setStatuttery("Yes, & Complied")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={statuttery === "Yes, Will be complied"} onClick={()=>setStatuttery("Yes, Will be complied")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={statuttery === "Cannot comply"} onClick={()=>setStatuttery("Cannot comply")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>10. Any Un stated Requirements?</h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Yes</label></div>
                            {unstared === "Yes" && <div style={styles.inputGroup}><label>Un stated Requirement</label></div>}
                            {unstared !== "Yes" && <div style={styles.inputGroup}><label></label></div>}
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>No</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={unstared === "Yes"} onClick={()=>setUnstared("Yes")}/></div>
                            {unstared === "Yes" && <div style={styles.inputGroup}><input type="text" value={unstaredval} onChange={(e) => setUnstaredval(e.target.value)} placeholder="Type Un stated required..." style={styles.select}/></div>}
                            {unstared !== "Yes" && <div style={styles.inputGroup}><label></label></div>}
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={unstared === "No"} onClick={()=>setUnstared("No")}/></div>
                        </div><br/>
                        <div style={styles.inputRow}><h5>11. Business Risk  </h5></div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><label>Low</label></div>
                            <div style={styles.inputGroup}><label>Med</label></div>
                            <div style={styles.inputGroup}><label>High</label></div>
                        </div>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}><label></label></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={risk === "Low"} onClick={()=>setRisk("Low")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={risk === "Med"} onClick={()=>setRisk("Med")}/></div>
                            <div style={styles.inputGroup}><input className="form-check-input border-dark" type="checkbox" checked={risk === "High"} onClick={()=>setRisk("High")}/></div>
                        </div>
                        <div style={styles.inputRow}>
                            {(risk === "Med" || risk === "High") && <>
                                <div style={styles.inputGroup}>
                                    <input type="text" value={riskReason} onChange={(e) => setRiskReason(e.target.value)} placeholder="Type Reason..." style={styles.select}/>
                                </div>
                            </>}
                        </div>
                        </section>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setTab1(true)}>Close</button>
                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveChanges}>Save Change</button>
                    </div>
                  </div>
                }
              </div>
            </div>
           
          </td>
        </tr>
      ))}
      </tbody>
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
    textAlign: 'left',
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
},
outputBox3: {
  padding: '15px',
  backgroundColor: '#edeea4ff',      // light red
  borderLeft: '5px solid #a7b430ff', // red
  borderRadius: '5px',
  color: '#646328ff'                 // dark red text
}
};

export default Inquiry;
