import React, { useState, useEffect } from "react";
import CollectData from "../CollectData";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);

  const updateUserStatus = async (id) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/update-status/${id}`, {
        method: "PUT", // default method, can be omitted
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          }
        });
      // Update the user list after successful update
     setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: user.status === 'approved' ? 'rejected': 'approved'} : user
        ));
      const message = await response.json();
      alert(message.message);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const changeType = async (id) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/change-type/${id}`, {
        method: "PUT", // default method, can be omitted
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          }
        });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, manager: !user.manager } : user
        ));
      const message = await response.json();
      alert(message.message);
    } catch (error) {
      alert("Failed to change user type");
    }
  }

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/delete/${id}`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          }
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      const message = await response.json();
      alert(message.message);
    } catch (error) {
      alert("Failed to update status");
    }
  };


  return (
    <div>
      <CollectData setUsers = {setUsers}/>
      <h2 style={{textAlign: "center"}}>User Details</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}></table>
      <thead>
        <tr>
          <th style={{ width: "12vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Name</th>
          <th style={{ width: "16vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Email</th>
          <th style={{ width: "20vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Company</th>
          <th style={{ width: "10vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Department</th>
          <th style={{ width: "10vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Designation</th>
          <th style={{ width: "8vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Mobile No.</th>
          <th style={{ width: "6vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>User Type</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Change User Type</th>
          <th style={{ width: "6vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Status</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Change Status</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center"}}>Remove</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.name}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.email}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.company}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.department}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.designation}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.phoneNo}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.manager === true ? 'Admin' : 'User'}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}><button style={{backgroundColor: 'green'}} onClick={() => changeType(user._id)}>Change</button></td>
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.status}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}><button style={{backgroundColor: 'green'}} onClick={() => updateUserStatus(user._id)}>Change</button></td>
          <td style={{textAlign: "center", border: "1px solid black" }}><button style={{backgroundColor: 'red'}} onClick={() => deleteUser(user._id)}>Remove</button></td>
        </tr>
      ))}
      </tbody>
    </div>
  );
};

export default ManagerDashboard;
