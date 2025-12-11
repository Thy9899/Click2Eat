import React, { useState, useEffect } from "react";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token"); // <-- get your JWT token
        const res = await fetch(
          "https://click2eat-backend-customer-service.onrender.com/api/customers/customer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setCustomers(data.list);
        } else {
          console.error("Failed to fetch customers:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // -----------------------------
  // SEARCH FILTER LOGIC
  // -----------------------------
  const filteredCustomers = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // -----------------------------
  // PAGINATION WITH SEARCH RESULTS
  // -----------------------------
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // if (loading) return <p>Loading customers...</p>;
  // if (!customers.length) return <p>No customers found.</p>;

  return (
    <div>
      <h2>Customers</h2>
      <div className="content-container">
        {/* SEARCH BAR */}
        <div className="search-box d-inline-block me-3 order-seacrch">
          <i className="bx bx-search-alt icon"></i>
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
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
                <th>Customer Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5}>No matching customers found.</td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer._id}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
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
      </div>
    </div>
  );
};

export default CustomersPage;
