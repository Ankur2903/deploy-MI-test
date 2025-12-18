import { useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../ulits';

function SaveDrawing({ shapes, thickness, id, oldprofileName, oldprofileDescription, oldprofileReferenceNo, image }) {
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileReferenceNo, setProfileReferenceNo] = useState("");
  const token = localStorage.getItem('token')

  useEffect(() => {
    setProfileName(oldprofileName || "");
    setProfileDescription(oldprofileDescription || "");
    setProfileReferenceNo(oldprofileReferenceNo || "");
  }, [oldprofileName, oldprofileDescription, oldprofileReferenceNo]);

  const handleClickSave = async() => {
        if(!profileName) return handleError('Please fill out profile name.')
        try {
          const url = "http://localhost:8080/drawing/adddrawing";
          const response = await fetch(url, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ profileName, profileDescription, profileReferenceNo, shapes, thickness, image })
          });
          const result1 = await response.json();
          const { success, message, error} = result1;
          if(success){
            handleSuccess(message)
          }else if(error){
              const details = error?.details[0].message;
              handleError(details)
          }else if(!success){
            handleError(message)
          }
        }
        catch(err) {
          console.log(err)
          handleError(err);
        }
      };

      const handleSaveChanges = async () => {
        if(!profileName) return handleError('Please fill out profile name.')
        try {
            const response = await fetch(`http://localhost:8080/drawing/editdrawing`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, profileName, profileDescription, profileReferenceNo, shapes, thickness, image}),
            });

            const result1 = await response.json();
            const { success, message, error } = result1;
            if (success) {
              handleSuccess(message);
            } else if (error) {
                const details = error?.details?.[0]?.message || message || "Unknown error";
                handleError(details);
            } else {
                handleError(message || "Failed");
            }
        } catch (err) {
            alert(err.message || "Failed to update drawing.");
        }
    };

  return (
      <>
        <div style={styles.container}>
            <h2 style={styles.title}>Save Drawing</h2> 
            <section style={styles.section}>
            <h4 style={styles.subHeading}></h4>
            <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                    <label>Profile Name</label>
                    <input type="text" value={profileName} placeholder="Type Profile Name..." style={styles.select} onChange={(e) => setProfileName(e.target.value)}/>
                </div>
                <div style={styles.inputGroup}>
                    <label>Profile Reference No</label>
                    <input type="text" value={profileReferenceNo} placeholder="Type Profile Reference No..." style={styles.select} onChange={(e) => setProfileReferenceNo(e.target.value)}/>
                </div>
            </div>
            <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                    <label>Profile Description</label>
                    <input type="text" value={profileDescription} placeholder="Type Profile Description..." style={styles.select} onChange={(e) => setProfileDescription(e.target.value)}/>
                </div>
            </div>
            
            </section>       
        </div>
        <div className="modal-footer">
            {id === null && <button type="button" className="btn btn-success" onClick={handleClickSave} data-bs-dismiss="modal">Save</button>}
            {id !== null && <button type="button" className="btn btn-primary" onClick={handleSaveChanges} data-bs-dismiss="modal">Save</button>}
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
    minWidth: '150px'
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

export default SaveDrawing;
