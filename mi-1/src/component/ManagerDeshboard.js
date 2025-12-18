import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../App.css'

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem('token')

  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch("https://deploy-mi-test-api.vercel.app/data", {
            method: "GET", // default method, can be omitted
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json", // Ensure correct content type
            },
          });
          const data = await response.json();
          setUsers(data);
        } catch (err) {
          console.error("Error fetching users:", err.message);
        }
      };
  
      fetchUsers();
    }, [location]);  // Runs only once on component mount
  
  const addUser = (id) => {
    if(selectedUsers.includes(id)){
      setSelectedUsers((prevSelected) => prevSelected.filter((userId) => userId !== id));
    } else {
      setSelectedUsers((prevSelected) => [...prevSelected, id]);
    }
  };

  const updateUserStatus = async (selectedUsers ,status) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/update-status`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        body: JSON.stringify({ status: status, selectedUsers : selectedUsers }) // Send status in the request body
        });
      // Update the user list after successful update
     for(let i=0;i<selectedUsers.length;i++){
        const id = selectedUsers[i];
        setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: status} : user
        ));
     }
      setSelectedUsers([]);
      const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const changeType = async (selectedUsers) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/change-type`, {
        method: "PUT", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        body: JSON.stringify({ selectedUsers: selectedUsers })
        });
      for(let i=0;i<selectedUsers.length;i++){
          const id = selectedUsers[i];
          setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, manager: !user.manager } : user
          ));
      }
      setSelectedUsers([]);
      const message = await response.json();
    } catch (error) {
      alert("Failed to change user type");
    }
  }

  const deleteUser = async (selectedUsers) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/delete`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        body: JSON.stringify({ selectedUsers: selectedUsers })
        });
        for(let i=0;i<selectedUsers.length;i++){
          const id = selectedUsers[i];
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        }
      setSelectedUsers([]);
      const message = await response.json();
    } catch (error) {
      alert("Failed to update status");
    }
  };


  return (
    <div>
      <div  style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }}>
        {/* Centered Heading */}
        <h2 style={{ flex: 1, marginLeft: "40vw" }}>User Details</h2>
        {/* Button Group */}
        <div className="btn-group" role="group" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-1" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Change User Type</button>
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
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => changeType(selectedUsers)}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-2" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Change Status</button>
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
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => updateUserStatus(selectedUsers,"approved")}>Approve</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal"  onClick={() => updateUserStatus(selectedUsers,"rejected")}>Reject</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" style={{ backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Remove</button>
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
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteUser(selectedUsers)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table border="1" style={{ borderCollapse: "collapse", width: "10 0%" }}></table>
      <thead>
        <tr>
          <th style={{ width: "2vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}></th>
          <th style={{ width: "13vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Name</th>
          <th style={{ width: "15vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Email</th>
          <th style={{ width: "16vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Company</th>
          <th style={{ width: "11vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Department</th>
          <th style={{ width: "12vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Designation</th>
          <th style={{ width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Mobile No.</th>
          <th style={{ width: "5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>User Type</th>
          <th style={{ width: "5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Status</th>
          <th style={{ width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Time</th>
          <th style={{ width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Last Activity</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>
            <div className="form-check mx-3"><input className="form-check-input" type="checkbox" style={{borderRadius: "4px", borderWidth: "2px", borderColor: "black"}} checked={selectedUsers.includes(user._id)} onClick={() => addUser(user._id)}/></div>
          </td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.name}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.email}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.company}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.department}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.designation}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.phoneNo}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.manager}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.status}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.signupTime}</td>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>{user.lastactivity}</td>
        </tr>
      ))}
      </tbody>
    </div>
  );
};

export default ManagerDashboard;
