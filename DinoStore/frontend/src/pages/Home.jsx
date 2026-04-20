import React, { useEffect, useState } from "react";
import "../css/home.css";
import axios from "axios";
import Form from "../data/form";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SortPrice from "../components/SortPrice";
import "../css/controls.css";

const Home = ({ products, search }) => {
  const [data, setData] = useState(products || []);
  const [selectItems, setSelectItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setData(products);
  }, [products]);

  const handleSubmitToDb = async (ele) => {
    try {
      await axios.post(
        "http://localhost:9898/api/products/createproduct",
        Array.isArray(ele) ? ele : [ele],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert("Data added to database ");
    } catch (err) {
      console.log(err);
      alert("Error: " + err.message);
    }
  };

  const handleSelectAll = () => {
    if (data.length === selectItems.length) {
      setSelectItems([]);
    } else {
      setSelectItems(data.map((item) => item.id || item._id));
    }
  };

  const handleSelect = (id) => {
    setSelectItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const addProduct = (newProduct) => {
    setData((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    setShowModal(false);
  };

  const searchProduct = async (search) => {
    try {
      const result = await axios.get(
        `http://localhost:9898/api/products/searchProduct?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setData(products || []);
      return;
    }

    const delay = setTimeout(() => {
      searchProduct(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, products]);

  return (
    <div className="home">
      {/* form model */}
      <button className="open-btn" onClick={() => setShowModal(true)}>
        Open Form
      </button>

      <span className="selectedItem-count">
        Selected Items: {selectItems.length}
      </span>

      <h1 className="home-title">Explore Products</h1>
      <SortPrice setProducts={setData} />
      <div className="controls">
        <span className="select-all">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={data.length > 0 && selectItems.length === data.length}
          />
          Select all items
        </span>

        <button
          className="add-db-btn"
          disabled={selectItems.length === 0}
          onClick={() =>
            handleSubmitToDb(
              data.filter((item) => selectItems.includes(item.id || item._id)),
            )
          }
        >
          Add to Database
        </button>
      </div>

      {/* grid */}
      <div className="grid">
        {data.map((ele) => (
          <div className="card" key={ele._id}>
            <input
              type="checkbox"
              style={{ display: selectItems.length > 0 ? "block" : "none" }}
              checked={selectItems.includes(ele._id || ele.id)}
              onChange={() => handleSelect(ele._id || ele.id)}
            />

            <div className="card-img">
              <LazyLoadImage
                src={ele.image}
                alt={ele.title}
                effect="blur"
                width="100%"
                height="180px"
                style={{ objectFit: "contain", padding: "15px" }}
                threshold={200}
              />
            </div>

            <div className="card-body">
              <h3>{ele.title}</h3>
              <p className="category">{ele.category}</p>

              <div className="price-row">
                <span className="price">₹{ele.price}</span>
                <span className="rating">⭐ {ele.rating?.rate}</span>
              </div>

              <button className="btn" onClick={() => handleSubmitToDb(ele)}>
                Add to database
              </button>
            </div>
          </div>
        ))}
      </div>

      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>

            <Form addProduct={addProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
