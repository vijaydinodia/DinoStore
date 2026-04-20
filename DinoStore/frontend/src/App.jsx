import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// components
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./components/Login";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute ";
import Footer from "./components/Footer";

// data
import data from "./data/data";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <Header search={search} setSearch={setSearch} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home products={data} search={search} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product search={search} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart search={search} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
