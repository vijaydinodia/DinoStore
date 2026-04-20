import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/signup.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const initialData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [form, setForm] = useState(initialData);
  const [error, setError] = useState({});

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

    if (!form.name) error.name = "Name is required";

    if (!form.email) {
      error.email = "Email is required";
    }

    if (!form.password) {
      error.password = "Password is required";
    } else if (form.password.length < 6) {
      error.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      error.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      error.confirmPassword = "Passwords do not match";
    }

    return error;
  };

  // signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = validationForm(form);

    if (Object.keys(errorObj).length === 0) {
      try {
        const { confirmPassword, ...userData } = form;
        console.log("userData >>>>>>", userData);
        await axios.post("http://localhost:9898/api/user/signup", userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Signup successful");

        setForm(initialData);

        navigate("/login");
      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Signup failed");
      }
    }

    setError(errorObj);
  };
  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter name..."
          value={form.name}
          onChange={handleChange}
        />
        {error.name && <p>{error.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter email..."
          value={form.email}
          onChange={handleChange}
        />
        {error.email && <p>{error.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Enter password..."
          value={form.password}
          onChange={handleChange}
        />
        {error.password && <p>{error.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password..."
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {error.confirmPassword && <p>{error.confirmPassword}</p>}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
