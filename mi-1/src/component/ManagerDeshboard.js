import React, { useState, useEffect } from "react";
import CollectData from "../CollectData";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenModal = (id) => {
    setSelectedUserId(id);
  };

  const updateUserStatus = async (id,status) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/update-status/${id}`, {
        method: "PUT", // default method, can be omitted
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          },
        body: JSON.stringify({ status: status })
        });
      // Update the user list after successful update
     setUsers((prevUsers) =>
        prevUsers.map((user) =>
         user._id === id ? { ...user, status: status} : user
        ));
      const message = await response.json();
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
         <th style={{ width: "10vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Name</th>
          <th style={{ width: "14vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Email</th>
          <th style={{ width: "16vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Company</th>
          <th style={{ width: "11vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Department</th>
          <th style={{ width: "11vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Designation</th>
          <th style={{ width: "6vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Mobile No.</th>
          <th style={{ width: "5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>User Type</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Change User Type</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Status</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Change Status</th>
          <th style={{ width: "4vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Remove</th>
          <th style={{ width: "5.5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Signup Time</th>
          <th style={{ width: "5.5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Last Activity</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.name}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.email}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.company}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.department}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.designation}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.phoneNo}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.manager === true ? 'Admin' : 'User'}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-1" onClick={() => handleOpenModal(user._id)} style={{backgroundColor: 'green'}}>Change</button>
          <div class="modal fade-dark" id="exampleModal-1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Change User Type</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   Are you sure you want to change this user's access Type to the website?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => changeType(selectedUserId)}>Update</button>
                </div>
              </div>
            </div>
          </div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.status}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-2" onClick={() => handleOpenModal(user._id)} style={{backgroundColor: 'green'}}>Change</button>
          <div class="modal fade-dark" id="exampleModal-2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Change Status</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   Are you sure you want to change this user's access status to the website?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => updateUserStatus(selectedUserId,"approved")}>Approve</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => updateUserStatus(selectedUserId,"rejected")}>Reject</button>
                </div>
              </div>
            </div>
          </div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" onClick={() => handleOpenModal(user._id)} style={{backgroundColor: 'red'}}>Remove</button>
          <div class="modal fade-dark" id="exampleModal-3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Remove User</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  Are you sure you want to revoke this user's access to the website?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteUser(selectedUserId)}>Update</button>
                </div>
              </div>
            </div>
          </div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.signupTime}</td>
          <td style={{textAlign: "center", border: "1px solid black" ,fontSize: "13px"}}>{user.lastactivity}</td>
        </tr>
      ))}
      </tbody>
    </div>
  );
};

export default ManagerDashboard;
