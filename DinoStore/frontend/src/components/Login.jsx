import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const initialData = {
    email: "",
    password: "",
  };

  const [form, setForm] = useState(initialData);
  const [error, setError] = useState({});

  const user = localStorage.getItem("user");
  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // validation
  const validationForm = (form) => {
    let error = {};
    if (!form.email) error.email = "email is required";
    if (!form.password) error.password = "Password is required";
    return error;
  };

  // login
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const errorObj = validationForm(form);

      if (Object.keys(errorObj).length === 0) {
        const result = await axios.post(
          "http://localhost:9898/api/user/login",
          form,
        );

        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);

        setForm(initialData);
        alert("Login successful");
        navigate("/product");
      }

      setError(errorObj);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter e-mail id ..."
          value={form.email}
          onChange={handleChange}
        />
        {error.email && <p>{error.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Enter password ..."
          value={form.password}
          onChange={handleChange}
        />
        {error.password && <p>{error.password}</p>}

        <p
          style={{
            cursor: "pointer",
            color: "#38bdf8",
            fontSize: "14px",
            textAlign: "right",
          }}
          onClick={() => navigate("/forgot")}
        >
          Reset Password
        </p>

        {user ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button type="submit">Login</button>
        )}
      </form>
    </div>
  );
};

export default Login;
