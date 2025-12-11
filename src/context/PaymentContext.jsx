// React imports for context and state management
import React, { createContext, useContext, useState } from "react";

// Axios for making API requests
import axios from "axios";

// Toast notifications for showing success/error messages
import { toast } from "react-toastify";

// Create the payment context
const PaymentContext = createContext();

// Custom hook to access payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);

  // Prevent this hook from being used outside the PaymentProvider
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }

  return context;
};

// Provider that stores and shares payment data/functions
export const PaymentProvider = ({ children }) => {
  // The order retrieved from search
  const [currentOrder, setCurrentOrder] = useState(null);

  // Loading state for both search and payment
  const [loading, setLoading] = useState(false);

  // Payment status: "success", "failed", or null
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Backend base URL (cleaner & reusable)
  const BASE_URL =
    "https://click2eat-backend-order-service.onrender.com/api/order";

  /**
   * ===========================
   *  FETCH ORDER BY ID (ADMIN)
   * ===========================
   */
  const fetchOrderById = async (order_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to view this order.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/admin/${order_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentOrder(res.data.order);
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch order");
      console.error("fetchOrderById Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==============================
   *  PROCESS PAYMENT (REAL CALL)
   * ==============================
   */
  const processPayment = async (order_id, method) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in first.");
      return false;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/pay/${order_id}`,
        { payment_method: method },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Payment succeeded in backend
      setPaymentStatus("success");
      toast.success("Payment successful!");

      return res.data.order;
    } catch (err) {
      setPaymentStatus("failed");
      toast.error(err.response?.data?.error || "Payment failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ===============================
   *  RESET CHECKOUT (CLEAR STATES)
   * ===============================
   */
  const resetCheckout = () => {
    setCurrentOrder(null);
    setPaymentStatus(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        currentOrder,
        loading,
        paymentStatus,
        fetchOrderById,
        processPayment,
        resetCheckout,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
