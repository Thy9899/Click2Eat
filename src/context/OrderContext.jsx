import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({
    orderId: null,
    action: null,
  });

  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // -----------------------------
  // FETCH ALL ORDERS
  // -----------------------------
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        "https://click2eat-backend-order-service.onrender.com/api/order/admin",
        getAxiosConfig()
      );
      setOrders(res.data.list || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FETCH ORDER BY ID
  // -----------------------------
  const fetchOrderById = async (order_id) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/${order_id}`,
        getAxiosConfig()
      );
      setCurrentOrder(res.data.order);
      return res.data.order;
    } catch (err) {
      toast.error("Failed to fetch order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // CONFIRM ORDER
  // -----------------------------
  const confirmOrder = async (orderId) => {
    setProcessing({ orderId, action: "confirm" });
    try {
      await axios.put(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/confirm/${orderId}`,
        {},
        getAxiosConfig()
      );
      toast.success("Order confirmed");
      fetchOrders();
    } catch {
      toast.error("Failed to confirm order");
    } finally {
      setProcessing({ orderId: null, action: null });
    }
  };

  // -----------------------------
  // CANCEL ORDER
  // -----------------------------
  const cancelOrder = async (orderId) => {
    setProcessing({ orderId, action: "cancel" });
    try {
      await axios.put(
        `https://click2eat-backend-order-service.onrender.com/api/order/admin/cancel/${orderId}`,
        {},
        getAxiosConfig()
      );
      toast.info("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setProcessing({ orderId: null, action: null });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        processing,
        fetchOrders,
        fetchOrderById,
        confirmOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
