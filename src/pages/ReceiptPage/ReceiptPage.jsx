import React, { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { toast } from "react-toastify";
import "./ReceiptPage.css";

const ReceiptPage = () => {
  const { currentOrder, loading, fetchOrderById } = useOrders();
  const [searchId, setSearchId] = useState("");

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.warning("Please enter an Order ID");
      return;
    }
    await fetchOrderById(searchId);
  };

  const handlePrint = () => {
    if (!currentOrder) return;

    // Get the receipt content
    const printContent = document.querySelector(".print-area").innerHTML;

    // Open new window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${currentOrder._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            h3 { text-align: center; margin-bottom: 20px; }
            p { margin: 4px 0; font-size: 16px; }
            strong { min-width: 130px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 16px; }
            th, td { padding: 8px; border: 1px solid #000; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            .summary-table { width: 100%; max-width: 380px; margin-top: 18px; border-collapse: collapse; rigth: 0; margin-left: auto;}
            .summary-table td { padding: 10px 12px; font-size: 16px; }
            .summary-table tr td:last-child { text-align: right; }
            .summary-total td { font-weight: 700; font-size: 16px; border-top: 2px solid #000; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div>
      <h2>Order Receipt</h2>

      <div className="receipt-container">
        <div className="receipt-header">
          {/* Search Box */}
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

          {/* Print Button */}
          <button className="print-btn" onClick={handlePrint}>
            <i className="bx bx-printer"></i> Print Receipt
          </button>
        </div>

        {/* LOADING */}
        {loading && <p>Loading order...</p>}

        {/* NO DATA */}
        {!loading && !currentOrder && (
          <p className="not-search">
            Please search an Order ID to view receipt.
          </p>
        )}

        {/* RECEIPT */}
        {currentOrder && (
          <div className="receipt-detail print-area">
            <h3>Order Receipt</h3>

            <p>
              <strong>Order ID:</strong> {currentOrder._id}
            </p>
            <p>
              <strong>Name:</strong> {currentOrder.shipping_address?.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {currentOrder.shipping_address?.phone}
            </p>
            <p>
              <strong>Address:</strong> {currentOrder.shipping_address?.city}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(currentOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {currentOrder.status}
            </p>

            {/* ITEMS */}
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${item.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SUMMARY */}
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Payment</td>
                  <td>{currentOrder.payment_method}</td>
                </tr>
                <tr>
                  <td>Payment Status</td>
                  <td>{currentOrder.payment_status}</td>
                </tr>
                <tr className="summary-total">
                  <td>Total</td>
                  <td>${currentOrder.total_price.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptPage;
