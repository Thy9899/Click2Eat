import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import StockPage from "./pages/StockPage/StockPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import Setting from "./pages/Setting/Setting";
function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
