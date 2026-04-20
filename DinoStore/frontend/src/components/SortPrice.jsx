import axios from "axios";
import React from "react";
import "../css/SortPrice.css";
const SortPrice = ({ setProducts }) => {
  const sortProduct = async (operation) => {
    try {
      const result = await axios.get(
        `http://localhost:9898/api/products/sortProducts?operation=${operation}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setProducts(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sort-select">
      <select onChange={(e) => sortProduct(e.target.value)}>
        <option value="">Sort By Price</option>
        <option value="asc">Low → High</option>
        <option value="desc">High → Low</option>
      </select>
    </div>
  );
};

export default SortPrice;
