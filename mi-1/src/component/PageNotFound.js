import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "3rem", color: "#FF0000" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved. Go back to the{" "}
        <Link to="/" style={{ textDecoration: "none", color: "#007BFF" }}>
          Home Page
        </Link>
        .
      </p>
    </div>
  );
};

export default PageNotFound;
