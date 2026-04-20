import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewDetails = ({ viewItem_id }) => {
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    if (!viewItem_id) return;

    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:9898/api/products/getOne/${viewItem_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        console.log("API RESULT:", result.data);

        setViewItem(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [viewItem_id]);

  if (!viewItem) return <p>Loading...</p>;

  return (
    <div>
      <h2>{viewItem.title}</h2>

      <img
        src={viewItem.image}
        alt={viewItem.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "contain",
        }}
      />

      <p>
        <strong>Category:</strong> {viewItem.category}
      </p>
      <p>
        <strong>Description:</strong> {viewItem.description}
      </p>
      <p>
        <strong>Price:</strong> ₹{viewItem.price}
      </p>
      <p>
        <strong>Rating:</strong> ⭐ {viewItem.rating?.rate}
      </p>
      <p>
        <strong>Reviews:</strong> {viewItem.rating?.count}
      </p>
    </div>
  );
};

export default ViewDetails;
