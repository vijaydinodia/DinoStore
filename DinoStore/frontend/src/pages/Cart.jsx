import axios from "axios";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../css/cart.css";

const Cart = ({ search }) => {
  const [cartData, setCartData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // fetch cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "http://localhost:9898/api/cart/getCart",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setCartData(result.data);
        setOriginalData(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // select one
  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // select all
  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData.map((item) => item._id));
    }
  };

  // bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          axios.delete(`http://localhost:9898/api/cart/deleteCart/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ),
      );

      setCartData((prev) =>
        prev.filter((item) => !selectedItems.includes(item._id)),
      );
      setOriginalData((prev) =>
        prev.filter((item) => !selectedItems.includes(item._id)),
      );

      setSelectedItems([]);
    } catch (err) {
      console.log(err);
    }
  };

  // single delete
  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:9898/api/cart/deleteCart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCartData((prev) => prev.filter((item) => item._id !== id));
      setOriginalData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // total
  const totalPrice = cartData.reduce(
    (acc, item) => acc + Number(item.price),
    0,
  );

  // search
  useEffect(() => {
    if (!search || search.trim() === "") {
      setCartData(originalData);
      return;
    }

    const delay = setTimeout(() => {
      const filtered = originalData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      );

      setCartData(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, originalData]);

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Cart</h1>

      {/* controls */}
      <div className="cart-controls">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            cartData.length > 0 && selectedItems.length === cartData.length
          }
        />

        <button
          className="bulk-delete-btn"
          onClick={handleBulkDelete}
          disabled={selectedItems.length === 0}
        >
          Delete Selected ({selectedItems.length})
        </button>

        <span className="cart-summary">Total: ₹{totalPrice.toFixed(2)}</span>

        <span className="cart-summary">Cart Size: {cartData.length}</span>
      </div>

      {cartData.length === 0 ? (
        <h3 className="empty-text">No items in cart</h3>
      ) : (
        <div className="cart-grid">
          {cartData.map((item) => (
            <div key={item._id} className="cart-card">
              <input
                type="checkbox"
                className="cart-checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelect(item._id)}
              />

              <div className="cart-img">
                <LazyLoadImage
                  src={item.image}
                  alt={item.title}
                  effect="blur"
                  width="100%"
                  height="150px"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <h4 className="cart-title-text">{item.title}</h4>
              <p className="cart-price">₹{item.price}</p>

              <button
                className="remove-btn"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
