import axios from "axios";
import React, { useEffect, useState } from "react";
import ShowProduct from "../components/ShowProduct";
import SortPrice from "../components/SortPrice";
import "../css/controls.css";

const Product = ({ search }) => {
  const [DbData, setDbData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:9898/api/products/",
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        );

        setDbData(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

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

      setDbData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      return;
    }

    const delay = setTimeout(() => {
      searchProduct(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, DbData]);

  return (
    <>
      <SortPrice setProducts={setDbData} />
      <ShowProduct products={DbData} />
    </>
  );
};

export default Product;
