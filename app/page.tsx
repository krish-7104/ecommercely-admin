"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashCard from "./(dashboard)/DashCard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
const GREETINGS = {
  morning: "Good Morning",
  afternoon: "Good Afternoon",
  evening: "Good Evening",
};

const dashCardDefaultData = [
  {
    title: "Orders",
    data: 0,
    type: "neutral",
    today: 0,
    percentage: 0,
  },
  {
    title: "Gross Profit",
    data: 0,
    type: "neutral",
    today: 0,
    percentage: 0,
  },
  {
    title: "Products",
    data: 0,
    type: "neutral",
    today: 0,
    percentage: 0,
  },
  {
    title: "Stock",
    data: 0,
    type: "neutral",
    today: 0,
    percentage: 0,
  },
  {
    title: "Users",
    data: 0,
    type: "neutral",
    today: 0,
    percentage: 0,
  },
];

const Home = () => {
  const router = useRouter();
  const [greet, setGreeting] = useState(GREETINGS.morning);
  const [dashCardData, setDashCardData] = useState([...dashCardDefaultData]);
  const userData = useSelector((state: any) => state?.userData);
  const [mainData, setMainData] = useState({
    products: [] as any[],
    category: [] as any[],
    orders: [] as any[],
    users: [] as any[],
  });
  const [orderPieChart, setOrderPieChart] =
    useState<{ name: string; value: number; color: string }[]>();
  const [lowStockProducts, setLowStockProducts] = useState<
    { id: string; name: string; quantity: number; price: number }[]
  >([]);

  const [analysisData, setAnalysisData] = useState<
    { name: string; Orders: any; Profit: any }[]
  >([]);

  useEffect(() => {
    getCardData();
    getGreetText();
  }, []);

  const getGreetText = () => {
    const hour = new Date().getHours();
    if (hour <= 12) {
      setGreeting(GREETINGS.morning);
    } else if (hour <= 18) {
      setGreeting(GREETINGS.afternoon);
    } else {
      setGreeting(GREETINGS.evening);
    }
  };

  const updateCardData = (title: string, data: any) => {
    const index = dashCardData.findIndex((card) => card.title === title);
    const updatedCardData = [...dashCardData];
    if (title === "Products") {
      setMainData((prevMainData) => ({
        ...prevMainData,
        products: data.products,
      }));
      updatedCardData[index].data = data.totalProducts;
      updatedCardData[index].today = data.changesTodayProduct;
      updatedCardData[index].percentage = data.percentageIncreaseProduct;
      updatedCardData[index].type =
        data.percentageIncreaseProduct === 0
          ? "neutral"
          : data.percentageIncreaseProduct > 0
          ? "positive"
          : "negative";
    } else if (title === "Stock") {
      updatedCardData[index].data = data.totalQuantity;
      updatedCardData[index].today = data.changesTodayStock;
      updatedCardData[index].percentage = data.percentageIncreaseStock;
      updatedCardData[index].type =
        data.percentageIncreaseStock === 0
          ? "neutral"
          : data.percentageIncreaseStock > 0
          ? "positive"
          : "negative";
    } else if (title === "Users") {
      setMainData((prevMainData) => ({
        ...prevMainData,
        users: data.users,
      }));
      updatedCardData[index].data = data.totalUser;
      updatedCardData[index].today = data.changesToday;
      updatedCardData[index].percentage = data.percentageIncrease;
      updatedCardData[index].type =
        data.percentageIncrease === 0
          ? "neutral"
          : data.percentageIncrease > 0
          ? "positive"
          : "negative";
    } else if (title === "Orders") {
      setMainData((prevMainData) => ({
        ...prevMainData,
        orders: data.orders,
      }));
      updatedCardData[index].data = data.totalOrders;
      updatedCardData[index].today = data.changesTodayOrder;
      updatedCardData[index].percentage = data.percentageIncreaseOrder;
      updatedCardData[index].type =
        data.percentageIncreaseOrder === 0
          ? "neutral"
          : data.percentageIncreaseOrder > 0
          ? "positive"
          : "negative";
    } else if (title === "Gross Profit") {
      updatedCardData[index].data = data.totalProfit;
      updatedCardData[index].today = data.changesTodayProfit;
      if (data.percentageIncreaseProfit > 100) {
        updatedCardData[index].percentage = 100;
      } else {
        updatedCardData[index].percentage = data.percentageIncreaseProfit;
      }

      updatedCardData[index].type =
        data.percentageIncreaseProfit === 0
          ? "neutral"
          : data.percentageIncreaseProfit > 0
          ? "positive"
          : "negative";
    } else if (title === "Category") {
      setMainData((prevMainData) => ({
        ...prevMainData,
        category: data.category,
      }));
    }
    setDashCardData(updatedCardData);
  };

  useEffect(() => {
    const OrderLabels = ["Shipping", "Delivered", "Pending"];
    const color = ["#8884d8", "#82ca9d", "#ffc658"];
    const orderData = [
      mainData.orders.reduce(
        (sum, order) => sum + (order.status === "Shipping" ? 1 : 0),
        0
      ),
      mainData.orders.reduce(
        (sum, order) => sum + (order.status === "Delivered" ? 1 : 0),
        0
      ),
      mainData.orders.reduce(
        (sum, order) => sum + (order.status === "Pending" ? 1 : 0),
        0
      ),
    ];
    let orderDataForChart = OrderLabels.map((item, index) => {
      return {
        name: item,
        value: orderData[index],
        color: color[index],
      };
    });
    setOrderPieChart(orderDataForChart);
    
    const lowStock = mainData.products
      .filter((product) => product.quantity <= 10)
      .map((product) => ({
        id: product.id,
        name: product.product_name,
        quantity: product.quantity,
        price: product.price,
      }))
      .sort((a, b) => a.quantity - b.quantity);
    setLowStockProducts(lowStock);
  }, [mainData]);

  useEffect(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyOrderData = Array(12).fill(0);
    const monthlyProfitData = Array(12).fill(0);

    mainData.orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const orderYear = orderDate.getFullYear(); // Get the year of the order
      const currentYear = new Date().getFullYear(); // Get the current year
      if (orderYear === currentYear) {
        // Check if the order's year matches the current year
        const monthIndex = orderDate.getMonth();
        monthlyOrderData[monthIndex]++;
        monthlyProfitData[monthIndex] += order.total;
      }
    });

    const analysisData = months.map((month, index) => ({
      name: month,
      Orders: monthlyOrderData[index],
      Profit: monthlyProfitData[index],
    }));

    setAnalysisData(analysisData);
  }, [mainData]);

  const getCardData = async () => {
    try {
      const [productResp, userResp, orderResp, categoryResp] =
        await Promise.all([
          axios.get("/api/dashboard/card-data/products"),
          axios.get("/api/dashboard/card-data/user"),
          axios.get("/api/dashboard/card-data/orders"),
          axios.get("/api/dashboard/card-data/category"),
        ]);
      updateCardData("Products", productResp.data);
      updateCardData("Stock", productResp.data);
      updateCardData("Users", userResp.data);
      updateCardData("Orders", orderResp.data);
      updateCardData("Gross Profit", orderResp.data);
      updateCardData("Category", categoryResp.data);
    } catch (error) {
      router.push("/login");
    }
  };

  return (
    <main className="mx-auto bg-[#f6f6f6] flex justify-center h-[100vh] container overflow-x-hidden">
      {userData && (
        <section className="mt-6 w-[92%]">
          <div className="w-full mb-4">
            <p className="font-semibold text-xl">
              {`${greet}, ${userData?.name || ""}`}
            </p>
            <p className="text-sm mt-1 text-slate-500">
              Here what&lsquo;s happening with your store
            </p>
          </div>
          <div className="w-full flex justify-center items-center gap-4">
            {dashCardData.map((card, index) => (
              <DashCard key={index} data={card} />
            ))}
          </div>
          <p className="mt-6 mb-2 text-lg font-medium text-gray-700">
            Profit Every Month (2024)
          </p>
          <div className="w-full flex flex-col justify-center items-center mb-6 bg-white p-4 rounded-xl shadow">
            <AreaChart
              width={850}
              height={250}
              data={analysisData}
              margin={{ top: 10, right: 30, left: 18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                fontSize={13}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                fontSize={13}
                tick={{ fill: '#666' }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="Profit"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </div>
          <p className="mt-6 mb-2 text-lg font-medium text-gray-700">
            Orders Every Month (2024)
          </p>
          <div className="w-full flex flex-col justify-center items-center mb-6 bg-white p-4 rounded-xl shadow">
            <AreaChart
              width={850}
              height={250}
              data={analysisData}
              margin={{ top: 10, right: 30, left: 18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#8884d8"
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                fontSize={13}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                fontSize={13}
                tick={{ fill: '#666' }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="Orders"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                name="Orders"
              />
            </AreaChart>
          </div>
          <section className="w-full flex gap-x-10 justify-evenly items-center">
            <div className="w-1/2">
              <p className="mt-6 mb-2 text-lg font-medium text-gray-700">
                Order Stats
              </p>
              <div className="w-full flex flex-col justify-center items-center mb-6 bg-white p-4 rounded-xl shadow">
                <PieChart width={800} height={300}>
                  <Pie
                    data={orderPieChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                  >
                    {orderPieChart?.map((data, index) => (
                      <Cell key={`cell-${index}`} fill={data.color}></Cell>
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
            <div className="w-1/2">
              <p className="mt-6 mb-2 text-lg font-medium text-gray-700">
                Low Stock Products
              </p>
              <div className="w-full flex flex-col justify-center items-center mb-6 bg-white p-4 rounded-xl shadow">
                {lowStockProducts.length > 0 ? (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Product Name</th>
                          <th className="text-right p-3 text-sm font-semibold text-gray-700">Stock</th>
                          <th className="text-right p-3 text-sm font-semibold text-gray-700">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-800">{product.name}</td>
                            <td className="p-3 text-sm text-right">
                              <span className={`font-semibold ${product.quantity <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-right text-gray-600">₹{product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center h-64">
                    <p className="text-gray-500">No products with low stock</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          <div className="h-6 w-full"></div>
        </section>
      )}
      {!userData && (
        <div className="flex justify-center items-center flex-col">
          <Loader2 className="animate-spin" />
          <p className="mt-2 text-gray-700">Getting Things Ready!</p>
        </div>
      )}
    </main>
  );
};

export default Home;
