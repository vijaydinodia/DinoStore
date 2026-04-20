import React, { useState } from "react";
import "../css/form.css";

const Form = ({ addProduct }) => {
  const initialData = {
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: {
      rate: "",
      count: "",
    },
  };

  const [formData, setFormData] = useState(initialData);

  // Handle normal fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle nested rating fields
  const handleRatingChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      rating: {
        ...formData.rating,
        [name]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(formData);
    setFormData(initialData);
  };

  return (
    <div className="form-container">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <h4>Rating</h4>

        <input
          type="number"
          name="rate"
          placeholder="Rate"
          value={formData.rating.rate}
          onChange={handleRatingChange}
        />

        <input
          type="number"
          name="count"
          placeholder="Count"
          value={formData.rating.count}
          onChange={handleRatingChange}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Form;
