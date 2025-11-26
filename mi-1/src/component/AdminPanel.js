import { useState } from "react";
import ManagerDashboard from "./ManagerDeshboard";
import Machine from "./Machine";
import Material from "./Material";

function AdminPanel() {
  const [activePage, setActivePage] = useState("home"); 

  return (
    <div style={{ display: "flex", height: "89vh" }}>
      {/* Left Panel */}
      <div style={{width: "10%", background: "#1da1f2", color: "Black", padding: "4px", display: "flex", flexDirection: "column", borderRadius: "5px", overflowY: "auto",}}>
        {/* <h2 style={{margin: "5px", fontSize: "20px", textAlign: "center" }}>Menu</h2> */}
        <button style={{background: "#2D2D44", color: "white", padding: "10px", margin: "4px 0", borderRadius: "10px", cursor: "pointer", fontSize: "16px", transition: "all 0.3s ease"}} onMouseOver={(e) => (e.target.style.background = "#444466")} onMouseOut={(e) => (e.target.style.background = "#2D2D44")} onClick={() => setActivePage("home")}>Users</button>
        <button style={{background: "#2D2D44", color: "white", padding: "10px", margin: "4px 0", borderRadius: "10px", cursor: "pointer", fontSize: "16px", transition: "all 0.3s ease"}} onMouseOver={(e) => (e.target.style.background = "#444466")} onMouseOut={(e) => (e.target.style.background = "#2D2D44")} onClick={() => setActivePage("about")}> Machines</button>
        <button style={{background: "#2D2D44", color: "white", padding: "10px", margin: "4px 0", borderRadius: "10px", cursor: "pointer", fontSize: "16px", transition: "all 0.3s ease"}} onMouseOver={(e) => (e.target.style.background = "#444466")} onMouseOut={(e) => (e.target.style.background = "#2D2D44")} onClick={() => setActivePage("material")}> Materials</button>
      </div>
        
      {/* Right Content */}
      <div style={{ flex: 1, padding: "0px" ,overflowY: "auto",}}>
        {activePage === "home" && <ManagerDashboard/>}
        {activePage === "about" && <Machine/>}
        {activePage === "material" && <Material/>}
      </div>
    </div>
  );
}

export default AdminPanel;
