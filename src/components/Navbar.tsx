import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "10px",
        backgroundColor: "#222",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Link to="/" style={{ color: "white", margin: "0 15px" }}>
        🏠 Startseite
      </Link>
    </nav>
  );
}
