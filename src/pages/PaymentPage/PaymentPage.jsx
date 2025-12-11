import React, { useState } from "react";
import { usePayment } from "../../context/PaymentContext";
import { ToastContainer, toast } from "react-toastify";
import "./PaymentPage.css";

const PaymentPage = () => {
  // ✅ Get states & functions from PaymentContext
  const {
    currentOrder, // Order object returned after search
    loading, // Loading state (searching / paying)
    paymentStatus, // "success" | "failed" | null
    fetchOrderById, // Function to fetch order by ID
    processPayment, // Function to simulate payment process
  } = usePayment();

  // Local state for the input box
  const [searchId, setSearchId] = useState("");

  // 🔎 Handle order search
  const handleSearch = () => {
    if (!searchId.trim()) return toast.warning("Please enter an Order ID");
    fetchOrderById(searchId);
  };

  // 💳 Handle payment process
  const handlePayment = () => {
    if (!currentOrder) return;
    processPayment(currentOrder._id, "Credit Card");
  };

  return (
    <div>
      <h2>Payment</h2>

      <div className="payment-container">
        {/* 🔍 Search Box */}
        <div className="search-box d-inline-block me-3">
          <i className="bx bx-search-alt icon"></i>
          <input
            type="text"
            placeholder="Enter Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <div className="pay-cus-info">
          {/* ✅ Display Order Data when found */}
          {currentOrder && (
            <div className="order-box">
              <table className="stock-table or-tb">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Cstomer Name</th>
                    <th>Phone Number</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{currentOrder._id}</td>
                    <td>{currentOrder.shipping_address.fullName}</td>
                    <td>{currentOrder.shipping_address.phone}</td>
                    <td>${currentOrder.total_price}</td>
                    <td>{currentOrder.status}</td>
                    <td>{currentOrder.payment_status}</td>
                  </tr>
                </tbody>
              </table>

              {/* 💳 Pay Now Button */}
              <button
                className="pay-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>

              {/* 🟢 Payment Success Message */}
              {paymentStatus === "success" && (
                <p className="payment-success">Payment Successful!</p>
              )}

              {/* 🔴 Payment Failed Message */}
              {paymentStatus === "failed" && (
                <p className="payment-failed">Payment Failed!</p>
              )}
            </div>
          )}
        </div>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default PaymentPage;
