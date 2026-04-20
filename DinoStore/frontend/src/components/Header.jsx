import React from "react";
import { Link } from "react-router-dom";
import "../css/header.css";
import "../css/controls.css";

const Header = ({ search, setSearch }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link className="logo" to={"/"}>
          Dino store
        </Link>

        <input
          type="text"
          name="search"
          className="search-input"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/product">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/Signup">Signup</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
