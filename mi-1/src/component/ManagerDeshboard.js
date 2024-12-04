import React, { useState, useEffect } from "react";
import CollectData from "../CollectData";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateUserStatus = async (id, newStatus) => {
    try {
      
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/update-status/${id}`, {
        method: "PUT", // default method, can be omitted
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ status: newStatus })
        });
      // Update the user list after successful update
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
      const message = await response.json();
      alert(message.message);
    } catch (error) {
      alert("Failed to update status");
    }
  };


  return (
    <div>
      <CollectData setUsers = {setUsers}/>
      <h2 style={{textAlign: "center"}}>Pending Users</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}></table>
      <thead>
        <tr>
          <th style={{ padding: "0 4.5vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Name</th>
          <th style={{ padding: "0 9vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Email</th>
          <th style={{ padding: "0 5.4vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Company</th>
          <th style={{ padding: "0 5.4vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Department</th>
          <th style={{ padding: "0 6vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Designation</th>
          <th style={{ padding: "0 2.2vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Status</th>
          <th style={{ padding: "0 0.1vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Approve</th>
          <th style={{ padding: "0 0.1vw", border: "1px solid black", backgroundColor: 'black', color: 'white'}}>Reject</th>
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
          <td style={{textAlign: "center", border: "1px solid black" }}>{user.status}</td>
          <td style={{textAlign: "center", border: "1px solid black" }}><button style={{backgroundColor: 'green'}}  onClick={() => updateUserStatus(user._id, "approved")}>Approve</button></td>
          <td style={{textAlign: "center", border: "1px solid black" }}><button style={{backgroundColor: 'red'}}  onClick={() => updateUserStatus(user._id, "rejected")}>Reject</button></td>
        </tr>
      ))}
      </tbody>
    </div>
  );
};

export default ManagerDashboard;
