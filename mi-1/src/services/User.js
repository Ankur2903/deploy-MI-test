import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "http://localhost:8080";
const token = localStorage.getItem('token')

// GET all Users
export const fetchUsers = async () => {
    try {
          const response = await fetch(`${BASE_URL}/data`, {
            method: "GET", // default method, can be omitted
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json", // Ensure correct content type
            },
          });
          const data = await response.json();
          return data;
        } catch (err) {
          console.error("Error fetching users:", err.message);
        }
};

// Update User Status
export const updateUserStatus = async ({ selectedUsers ,status}) => {
    try {
      const response = await fetch(`${BASE_URL}/update-status`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ status: status, selectedUsers : selectedUsers }) // Send status in the request body
        });
    } catch (error) {
      alert("Failed to update status");
    }
}

// Change User type
export const changeType = async ({ selectedUsers, type }) => {     
    try {
      const response = await fetch(`${BASE_URL}/change-type`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({type: type, selectedUsers: selectedUsers })
        });
        
      const message = await response.json();
    } catch (error) {
      alert("Failed to change user type");
    }
}

// Delete User
export const deleteUser = async ({selectedUsers}) => {
    try {
      const response = await fetch(`${BASE_URL}/delete`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ selectedUsers: selectedUsers })
        });
      // const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
}