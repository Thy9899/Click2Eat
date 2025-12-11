import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import "./SaleChart.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SalesChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 10],
      },
    ],
  };

  return (
    <div className="sale-chart">
      <h3>Sales Overview</h3>
      <Line data={data} />
    </div>
  );
};

export default SalesChart;
