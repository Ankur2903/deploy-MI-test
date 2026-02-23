import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "http://localhost:8080/product";
const token = localStorage.getItem('token')

// GET all materials
export const fetchMaterials = async () => {
    try {
    const response = await fetch(`${BASE_URL}/allmaterials`, {
        method: "POST", // default method, can be omitted
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
        }
    });
    const data = await response.json();
    return data;
    } catch (err) {
        console.error("Error fetching materials:", err.message);
    }
};

// Add new material
export const addMaterial = async ({ materialName, grade, material, ysMin, ysMax, utsMin, utsMax, elMin, elMax, density, c, mn, s, p , si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax}) => {
    try {
        const response = await fetch(`${BASE_URL}/addmaterial`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json',
            
          },
          body: JSON.stringify({ materialName, grade, material, ysMin, ysMax, utsMin, utsMax, elMin, elMax, density, c, mn, s, p , si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax})
        })
        const result = await response.json();
        const {success, message, error} = result;
        if(success){
            handleSuccess(message)
            return true;
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
}

// Edit material

export const editMaterial = async ({ selectedMaterials, newMaterialName, newGrade, newMaterial, newYSMin, newYSMax, newUTSMin, newUTSMax, newElMin, newElMax, newDensity, newC, newMn, newS, newP, newSi, newOthers, newCE, newZincCoating, newZincCoatingMin, newZincCoatingMax}) => {     
    try {
      const response = await fetch(`${BASE_URL}/editmaterial`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ selectedMaterials, newMaterialName, newGrade, newMaterial, newYSMin, newYSMax, newUTSMin, newUTSMax, newElMin, newElMax, newDensity, newC, newMn, newS, newP, newSi, newOthers, newCE, newZincCoating, newZincCoatingMin, newZincCoatingMax })
        });
        const result = await response.json();
        const {success, message, error} = result;
         if(success){
          handleSuccess(message)
          return true;
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
          handleError(message)
        }
    } catch (error) {
      alert("Failed to update status");
    }
}

// Delete material
export const deleteMaterial = async ({selectedMaterials}) => {
    try {
      const response = await fetch(`${BASE_URL}/deletematerial`, {
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
          handleSuccess(message)
          return true;
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
          handleError(message)
        }
    } catch (error) {
      alert("Failed to update status");
    }
}

