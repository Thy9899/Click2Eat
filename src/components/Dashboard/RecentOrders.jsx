import "./RecentOrders.css";

const RecentOrders = () => {
  const sample = [
    { id: 1, product: "Burger", price: "$5.00" },
    { id: 2, product: "Pizza", price: "$8.00" },
    { id: 3, product: "Coffee", price: "$2.00" },
  ];

  return (
    <div className="recent-box">
      <h3>Recent Orders</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {sample.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
