import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "https://deploy-mi-test-api.vercel.app/machine";
const token = localStorage.getItem('token')

// GET all machines
export const fetchMachines = async () => {
    try {
        const response = await fetch(`${BASE_URL}/allmachine`, {
          method: "POST", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          }
        });
        const data = await response.json();
        return data
      } catch (err) {
        console.error("Error fetching machines:", err.message);
      }
};

// Add a new machine
export const addMachine = async ({ machineId, type, usableShaftLength, stripWidthMin, stripWidthMax, thicknessMin, thicknessMax, boxPerimeter, giCoating, numberOfStations }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/addmachine`, {
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
            handleSuccess(message)
            return true;
        } 
        else if (error) {
            const details = error?.details[0].message;
            handleError(details)
        } 
        else if (!success) handleError(message)
    }
    catch (err) {
        handleError(err);
    }
};

// Edit Machine
export const editMachine = async ({ selectedMachines, newMachineId, newType, newUsableShaftLength, newStripWidthMin, newStripWidthMax, newThicknessMin, newThicknessMax, newBoxPerimeter, newGiCoating, newNumberOfStations }) => {
    try {
        const response = await fetch(`${BASE_URL}/editmachine`, {
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
            handleSuccess(message);
            return true;
        } 
        else if (error) {
            const details = error?.details[0].message;
            handleError(details);
        } 
        else if (!success) handleError(message);
    } catch (error) {
        alert("Failed to update status");
    }
};

// Delete machine
export const deleteMachines = async ({selectedMachines}) => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${BASE_URL}/deletemachine`, {
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
          handleSuccess(message);
          return true;
        } 
        else if (error) {
          const details = error?.details[0].message;
          handleError(details)
        } 
        else if (!success) {
          handleError(message)
        }
      } catch (error) {
        alert("Failed to update status");
      }
};
