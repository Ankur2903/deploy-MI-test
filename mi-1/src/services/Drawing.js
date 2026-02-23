import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "http://localhost:8080/drawing";
const token = localStorage.getItem('token')

// GET all Drawings
export const fetchDrawings = async () => {
    try {
        const response = await fetch(`${BASE_URL}/alldrawings`, {
          method: "POST", // default method, can be omitted
          headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure correct content type
          }
        });
        const data = await response.json();
        return data;
    } catch (err) {
    console.error("Error fetching drawings:", err.message);
    }
};

// Add new Drawings
export const addDrawing = async ({ profileName, profileDescription, profileReferenceNo, shapes, thickness, image}) => {
    try {
        const url = `${BASE_URL}/adddrawing`;
        const response = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ profileName, profileDescription, profileReferenceNo, shapes, thickness, image })
        });
        const result1 = await response.json();
        const { success, message, error } = result1;
        if(success) handleSuccess(message)
        else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }
        else if(!success) handleError(message)
    }
    catch(err) {
        handleError(err);
    }
}

// Edit Drawings

export const editDrawing = async ({ id, profileName, profileDescription, profileReferenceNo, shapes, thickness, image }) => {     
    try {
        const response = await fetch(`${BASE_URL}/editdrawing`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, profileName, profileDescription, profileReferenceNo, shapes, thickness, image}),
        });

        const result1 = await response.json();
        const { success, message, error } = result1;
        if (success) handleSuccess(message);
        else if (error) {
            const details = error?.details?.[0]?.message || message || "Unknown error";
            handleError(details);
        } 
        else handleError(message || "Failed");
    } catch (err) {
        alert(err.message || "Failed to update drawing.");
    }
}

// Delete Drawings
export const deleteDrawing = async ({id}) => {
    try {
        const response = await fetch(`${BASE_URL}/deletedrawing`, {
        method: "DELETE", // default method, can be omitted
            headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
            },
            body: JSON.stringify({ id: id })
        });
        const result = await response.json();
        const {success, message, error} = result;
        if(success){
            handleSuccess(message)
            return true;
        }
        else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }
        else if(!success) handleError(message)
    } catch (error) {
        alert("Failed to delete drawing:", error);
    }
}