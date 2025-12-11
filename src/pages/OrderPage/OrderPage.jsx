import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderPage.css";

const OrderPage = () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search term
  const [searchTerm, setSearchTerm] = useState("");

  // Token for authentication
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // -----------------------------
  // FETCH ORDERS
  // -----------------------------
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://click2eat-backend-order-service.onrender.com/api/order/admin",
        axiosConfig
      );

      setOrders(res.data.list || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // -----------------------------
  // FORMAT MONEY
  // -----------------------------
  const formatMoney = (val) =>
    val != null && !Number.isNaN(Number(val))
      ? `$${Number(val).toFixed(2)}`
      : "-";

  // -----------------------------
  // CONFIRM ORDER
  // -----------------------------
  const handleConfirmOrder = async (orderId) => {
    setProcessingId(orderId);

    try {
      await axios.put(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/confirm/${orderId}`,
        {},
        axiosConfig
      );

      toast.success("Order confirmed!");
      await fetchOrders();
    } catch (err) {
      console.error("Confirm error:", err);
      toast.error("Failed to confirm order.");
    } finally {
      setProcessingId(null);
    }
  };

  // -----------------------------
  // CANCEL ORDER
  // -----------------------------
  const handleCancelOrder = async (orderId) => {
    setProcessingId(orderId);

    try {
      await axios.put(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/cancel/${orderId}`,
        {},
        axiosConfig
      );

      toast.info("Order cancelled.");
      await fetchOrders();
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order.");
    } finally {
      setProcessingId(null);
    }
  };

  // -----------------------------
  // SEARCH FILTER LOGIC
  // -----------------------------
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();

    return (
      order._id.toLowerCase().includes(term) || // Search by ID
      order.status?.toLowerCase().includes(term) || // Search by status
      order.payment_status?.toLowerCase().includes(term) || // Search by payment status
      order.payment_method?.toLowerCase().includes(term) || // Search by payment method
      order.shipping_address?.fullName?.toLowerCase().includes(term) // Search by customer name
    );
  });

  // -----------------------------
  // PAGINATION WITH SEARCH RESULTS
  // -----------------------------
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // -----------------------------
  // RENDER UI
  // -----------------------------
  return (
    <div>
      <h2>All Orders</h2>

      <div className="admin-orders-container">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* SEARCH BAR */}
        <div className="search-box d-inline-block me-3 order-seacrch">
          <i className="bx bx-search-alt icon"></i>
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          // SHOW LOADING SPINNER
          <div className="spinner-border text-info spinner-center"></div>
        ) : orders.length === 0 ? (
          // NO DATA FROM API
          <p>No orders found.</p>
        ) : filteredOrders.length === 0 ? (
          // NO MATCHED SEARCH RESULTS
          <p>Order not found.</p>
        ) : (
          // -----------------------------
          // DATA TABLE
          // -----------------------------
          <table className="stock-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Payment Method</th>
                <th>Shipping Address</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((order) => {
                // Ensure shipping address is an object
                let address = order.shipping_address;
                try {
                  if (typeof address === "string" && address.startsWith("{")) {
                    address = JSON.parse(address);
                  }
                } catch {
                  console.warn("Invalid address JSON:", address);
                }

                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{address?.fullName ?? "-"}</td>
                    <td>{order.status}</td>
                    <td>{formatMoney(order.total_price)}</td>
                    <td>{order.payment_status}</td>
                    <td>{order.payment_method ?? "-"}</td>
                    <td>
                      {address
                        ? `${address.line1 ?? ""}${
                            address.city ? ", " + address.city : ""
                          }`
                        : "-"}
                    </td>
                    <td>
                      {Array.isArray(order.items) && order.items.length
                        ? `${order.items.length} Items`
                        : "-"}
                    </td>

                    <td>
                      {order.status === "pending" ? (
                        <>
                          <div className="action-btn">
                            <button
                              onClick={() => handleConfirmOrder(order._id)}
                              className="confirm-btn"
                              disabled={processingId === order._id}
                            >
                              {processingId === order._id ? (
                                "Processing..."
                              ) : (
                                <i class="bx  bx-check"></i>
                              )}
                            </button>

                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="cancel-btn"
                              disabled={processingId === order._id}
                            >
                              {processingId === order._id ? (
                                "Processing..."
                              ) : (
                                <i class="bx  bx-x"></i>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <span>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
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

export default OrderPage;
