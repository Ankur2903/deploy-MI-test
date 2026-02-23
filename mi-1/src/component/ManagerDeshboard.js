import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchUsers, deleteUser, updateUserStatus, changeType } from '../services/User';
import '../App.css'

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem('token')

  useEffect(() => {
      const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
      };
      loadUsers();
    }, [location]);  // Runs only once on component mount

  const addUser = (id) => {
    if(selectedUsers.includes(id)){
      setSelectedUsers((prevSelected) => prevSelected.filter((userId) => userId !== id));
    } else {
      setSelectedUsers((prevSelected) => [...prevSelected, id]);
    }
  };

  const handleClickChangeStatus = async (selectedUsers ,status) => {
    const result = await updateUserStatus({selectedUsers ,status});
    for(let i=0;i<selectedUsers.length;i++){
      const id = selectedUsers[i];
      setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status: status} : user
      ));
    }
    setSelectedUsers([]);
  };

  const handleClickChangeUserType = async (selectedUsers, type) => {
    const result = await changeType({selectedUsers, type});
    for(let i=0;i<selectedUsers.length;i++){
        const id = selectedUsers[i];
        setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, manager: type } : user
        ));
      }
      setSelectedUsers([]);
  }

  const handleClickRemove = async (selectedUsers) => {
    const result = await deleteUser({selectedUsers});
    for(let i=0;i<selectedUsers.length;i++){
      const id = selectedUsers[i];
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    }
    setSelectedUsers([]);
  };

  return (
    <div>
      <div  style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }}>
        {/* Centered Heading */}
        <h2 style={{ flex: 1, marginLeft: "40vw" }}>User Details</h2>
        {/* Button Group */}
        <div className="btn-group" role="group" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-1" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Change User Type</button>
          <div className="modal fade-dark" id="exampleModal-1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Change User Type</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                   Are you sure you want to change this user's access Type to the website?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={() => handleClickChangeUserType(selectedUsers, "User")}>User</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={() => handleClickChangeUserType(selectedUsers, "Super User")}>Super User</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={() => handleClickChangeUserType(selectedUsers, "Admin")}>Admin</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-2" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Change Status</button>
          <div className="modal fade-dark" id="exampleModal-2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Change Status</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                   Are you sure you want to change this user's access status to the website?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={() => handleClickChangeStatus(selectedUsers,"approved")}>Approve</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={() => handleClickChangeStatus(selectedUsers,"rejected")}>Reject</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal-3" style={{ backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>Remove</button>
          <div className="modal fade-dark" id="exampleModal-3" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Remove User</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to revoke this user's access to the website?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleClickRemove(selectedUsers)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table border="1" style={{ borderCollapse: "collapse", width: "10 0%" }}></table>
      <thead>
        <tr>
          <th style={{position: "sticky",top: "0", width: "2vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}></th>
          <th style={{position: "sticky",top: "0", width: "13vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Name</th>
          <th style={{position: "sticky",top: "0", width: "15vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Email</th>
          <th style={{position: "sticky",top: "0", width: "16vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Company</th>
          <th style={{position: "sticky",top: "0", width: "11vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Department</th>
          <th style={{position: "sticky",top: "0", width: "12vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Designation</th>
          <th style={{position: "sticky",top: "0", width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Mobile No.</th>
          <th style={{position: "sticky",top: "0", width: "5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>User Type</th>
          <th style={{position: "sticky",top: "0", width: "5vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Status</th>
          <th style={{position: "sticky",top: "0", width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Time</th>
          <th style={{position: "sticky",top: "0", width: "7vw", border: "1px solid black", backgroundColor: '#1b065c', color: 'white',textAlign: "center",fontSize: "15px"}}>Last Activity</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td style={{textAlign: "center", border: "1px solid black",fontSize: "13px" }}>
            <div className="form-check mx-3"><input className="form-check-input" type="checkbox" style={{borderRadius: "4px", borderWidth: "2px", borderColor: "black"}} checked={selectedUsers.includes(user._id)} onChange={() => addUser(user._id)}/></div>
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
