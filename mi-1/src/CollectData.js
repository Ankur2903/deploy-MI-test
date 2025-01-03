import React, { useState, useEffect } from "react";

function CollectData({setUsers, setPermission} ) {
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const token = localStorage.getItem('token')
            const response = await fetch("https://deploy-mi-test-api.vercel.app/data", {
              method: "GET", // default method, can be omitted
              headers: {
                 'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json", // Ensure correct content type
              },
            });
            const data = await response.json();
            if(data){
              console.log("welcome")
              setUsers(data);
              setPermission(true);
            }
            else setPermission(false)
            
          } catch (err) {
            console.error("Error fetching users:", err.message);
          }
        };
    
        fetchUsers();
      }, []);  // Runs only once on component mount
    
    return(
        null
    )
}

export default CollectData
