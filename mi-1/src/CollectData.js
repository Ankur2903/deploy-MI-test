import React, { useState, useEffect } from "react";

function CollectData({setUsers} ) {
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const token = localStorage.getItem('token')
            const response = await fetch("https://deploy-mi-test-4uaq62xeo-ankur2903s-projects.vercel.app/data", {
              method: "GET", // default method, can be omitted
              headers: {
                 'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json", // Ensure correct content type
              },
            });
            const datas = await response.json();
            const data = datas.Users;
            const permission = datas.permission;
            console.log("permission", permission)
            setUsers(data);
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
