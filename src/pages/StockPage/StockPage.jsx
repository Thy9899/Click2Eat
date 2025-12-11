import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StockPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";

const API_URL =
  "https://click2eat-backend-product-service.onrender.com/api/products";

const Stock = () => {
  // 🔐 Get token and user from AuthContext
  const { token, user } = useContext(AuthContext);

  // ==========================
  // 🔹 COMPONENT STATES
  // ==========================
  const [isOpen, setIsOpen] = useState(false); // Form popup
  const [products, setProducts] = useState([]); // All products
  const [editId, setEditId] = useState(null); // Product id for editing
  const [loading, setLoading] = useState(false);

  // Search + Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    price: "",
    discount: "",
    subtotal: 0,
    total: 0,
    image: null,
  });

  // ==========================
  // 🔹 FETCH PRODUCTS
  // ==========================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.list || []);
    } catch (error) {
      toast.error("Error fetching products");
    }
    setLoading(false);
  };

  // ==========================
  // 🔹 FORM INPUT HANDLING
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto calculate subtotal + total
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.price) || 0;
      const discount = parseFloat(updated.discount) || 0;

      const subtotal = price - (price * discount) / 100;
      const total = qty * subtotal;

      updated.subtotal = subtotal.toFixed(2);
      updated.total = total.toFixed(2);

      return updated;
    });
  };

  // Handle image file
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // ==========================
  // 🔹 SAVE PRODUCT (ADD/EDIT)
  // ==========================
  const handleSave = async () => {
    // Validate fields
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.quantity ||
      !formData.price ||
      formData.discount === ""
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "image") formDataToSend.append(key, formData[key]);
      });

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formDataToSend, config);
        toast.success("Product updated successfully");
      } else {
        await axios.post(API_URL, formDataToSend, config);
        toast.success("Product added successfully");
      }

      fetchProducts();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving product");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      quantity: "",
      price: "",
      discount: "",
      subtotal: 0,
      total: 0,
      image: null,
    });
    setEditId(null);
  };

  // ==========================
  // 🔹 EDIT PRODUCT
  // ==========================
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      discount: product.discount,
      subtotal: product.unit_price,
      total: product.total,
      image: product.image,
    });

    setEditId(product.product_id);
    setIsOpen(true);
  };

  // ==========================
  // 🔹 DELETE PRODUCT
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.info("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  // ==========================
  // 🔹 SEARCH + PAGINATION
  // ==========================
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ==========================
  // 🔹 UI RENDER
  // ==========================
  return (
    <div>
      <h2>Stock Management</h2>

      <div className="content-container">
        {/* ==========================
            🔍 SEARCH + ADD PRODUCT
        =========================== */}
        <div className="popup-container">
          <div className="search-box d-inline-block me-3">
            <i className="bx bx-search-alt icon"></i>
            <input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            className="open-btn btn btn-success"
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
          >
            <i className="bx bx-plus"></i> Add New
          </button>

          {/* ==========================
              📝 POPUP FORM
          =========================== */}
          {isOpen && (
            <div className="popup-overlay" onClick={() => setIsOpen(false)}>
              <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <h4>{editId ? "Edit Product" : "Add New Product"}</h4>

                {/* Auto generated fields */}
                {["name", "category", "quantity"].map((f) => (
                  <div className="mb-3 text-start" key={f}>
                    <label className="form-label text-capitalize">{f}:</label>
                    <input
                      type={f === "quantity" ? "number" : "text"}
                      className="form-control"
                      name={f}
                      value={formData[f]}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                {/* Description */}
                <div className="mb-3 text-start">
                  <label className="form-label">Description:</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Price */}
                <div className="mb-3 text-start">
                  <label className="form-label">Price ($):</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                {/* Discount */}
                <div className="mb-3 text-start">
                  <label className="form-label">Discount (%):</label>
                  <input
                    type="number"
                    className="form-control"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>

                {/* Image */}
                <div className="mb-3 text-start">
                  <label className="form-label">Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />

                  {formData.image && (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? `${formData.image}`
                          : URL.createObjectURL(formData.image)
                      }
                      alt="preview"
                      width="100"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Calculated fields */}
                <div className="mb-3 text-start">
                  <label className="form-label">Subtotal:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${formData.subtotal}`}
                    readOnly
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Total:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${formData.total}`}
                    readOnly
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-danger close-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    X
                  </button>

                  <button className="btn btn-primary" onClick={handleSave}>
                    <i className={editId ? "bx bx-edit-alt" : "bx bx-save"}></i>
                    {editId ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================
            📦 PRODUCTS TABLE
        =========================== */}
        {loading ? (
          <div className="spinner-border text-info spinner-center"></div>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, index) => (
                <tr key={p.product_id}>
                  <td>{startIndex + index + 1}</td>

                  <td>
                    {p.image ? (
                      <img src={p.image} width="40" height="40" alt="" />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.quantity}</td>
                  <td>${p.price}</td>
                  <td>{p.discount}%</td>
                  <td>${p.unit_price}</td>
                  <td>${p.total}</td>
                  <td>{p.created_by || "—"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(p)}
                    >
                      <i className="bx bxs-edit"></i>
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.product_id)}
                    >
                      <i className="bx bxs-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ==========================
            📄 PAGINATION
        =========================== */}
        <div className="pagination-container mt-3">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => goToPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default Stock;
