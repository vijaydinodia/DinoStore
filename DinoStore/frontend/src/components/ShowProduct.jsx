import React, { useState, useEffect } from "react";
import "../css/home.css";
import "../css/showProduct.css";
import ViewDetails from "./ViewDetails";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ShowProduct = ({ products }) => {
  const [data, setData] = useState(products || []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteSelected, setDeleteSelected] = useState([]);

  useEffect(() => {
    setData(products);
  }, [products]);

  //select signle :--->
  const handleSelect = (id) => {
    setDeleteSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  //select multiple :--->
  const handleSelectAll = () => {
    if (deleteSelected.length === data.length) {
      setDeleteSelected([]);
    } else {
      setDeleteSelected(data.map((item) => item._id));
    }
  };

  //permanenet delete single :--->
  const permanentlyDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:9898/api/products/deleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  //soft delete single product :--->
  const softDelete = async (id) => {
    try {
      const result = await axios.patch(
        `http://localhost:9898/api/products/softDeleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const updatedProduct = result.data.product || result.data;

      setData((prev) =>
        prev.map((item) => (item._id === id ? updatedProduct : item)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  //bulk delete products:--->
  const bulkDelete = async () => {
    try {
      await Promise.all(
        deleteSelected.map((id) =>
          axios.delete(
            `http://localhost:9898/api/products/deleteProduct/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
        ),
      );

      setData((prev) =>
        prev.filter((item) => !deleteSelected.includes(item._id)),
      );

      setDeleteSelected([]);
    } catch (err) {
      console.log(err);
    }
  };

  //bulk soft delete and restore :--->
  const bulkSoftDelete = async () => {
    try {
      const results = await Promise.all(
        deleteSelected.map((id) =>
          axios.patch(
            `http://localhost:9898/api/products/softDeleteProduct/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
        ),
      );

      const updatedProducts = results.map(
        (res) => res.data.product || res.data,
      );

      setData((prev) =>
        prev.map((item) => {
          const updated = updatedProducts.find((p) => p._id === item._id);
          return updated ? updated : item;
        }),
      );

      setDeleteSelected([]);
    } catch (err) {
      console.log(err);
    }
  };

  //add to cart single element :--->

  const handleAddToCartSingle = async (item) => {
    try {
      const payload = Array.isArray(item) ? item : [item];

      await axios.post(`http://localhost:9898/api/cart/addToCart`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Added to Cart ");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home">
      <h1 className="home-title">Products List</h1>

      {/* handle bulk controls :---> */}
      <div className="controls">
        <label>
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={data.length > 0 && deleteSelected.length === data.length}
          />
          Select All
        </label>

        <span style={{ fontSize: "14px" }}>
          Selected: {deleteSelected.length}
        </span>

        <div className="bulk-actions">
          <button
            className="btn btn-toggle active"
            disabled={deleteSelected.length === 0}
            onClick={bulkSoftDelete}
          >
            Soft Delete / Restore
          </button>

          <button
            className="btn btn-danger"
            disabled={deleteSelected.length === 0}
            onClick={bulkDelete}
          >
            Delete Selected
          </button>

          <button
            className="btn"
            disabled={deleteSelected.length === 0}
            onClick={() =>
              handleAddToCartSingle(
                data.filter((item) => deleteSelected.includes(item._id)),
              )
            }
          >
            Add Selected to Cart
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              className={`card ${
                deleteSelected.includes(item._id) ? "selected" : ""
              }`}
              key={item._id}
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                style={{
                  display: deleteSelected.length > 0 ? "block" : "none",
                }}
                checked={deleteSelected.includes(item._id)}
                onChange={() => handleSelect(item._id)}
              />
              <div className="card-img">
                <LazyLoadImage
                  src={item.image}
                  alt={item.title}
                  effect="blur"
                  placeholderSrc="https://dummyimage.com/300x300/cccccc/000000&text=Loading"
                  width="100%"
                  height="200px"
                  style={{ objectFit: "contain", padding: "10px" }}
                  threshold={200}
                />
              </div>

              <div className="card-body">
                <h3>{item.title}</h3>

                <p className="category">{item.category}</p>

                <p className="description">
                  {item.description?.slice(0, 60)}...
                </p>

                <div className="price-row">
                  <span className="price">₹{item.price}</span>
                  <span className="rating">⭐ {item.rating?.rate || 0}</span>
                </div>

                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Reviews: {item.rating?.count || 0}
                </p>

                {/* VIEW */}
                <button
                  className="btn"
                  onClick={() => setSelectedItem(item._id)}
                >
                  View Details
                </button>

                {/* DELETE */}
                <button
                  className="btn btn-danger"
                  onClick={() => permanentlyDelete(item._id)}
                >
                  Delete
                </button>

                {/* SOFT DELETE */}
                <button
                  className={`btn btn-toggle ${
                    item.active ? "active" : "inactive"
                  }`}
                  onClick={() => softDelete(item._id)}
                >
                  {item.active ? "Soft Delete" : "Restore"}
                </button>

                {/* add to cart */}
                <button
                  className="btn"
                  onClick={() => handleAddToCartSingle(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>No Products Found</h2>
        )}
      </div>

      {/* model */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>
              ✖
            </button>

            <ViewDetails viewItem_id={selectedItem} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
