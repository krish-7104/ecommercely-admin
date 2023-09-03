"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashCard from "./(dashboard)/DashCard";
import {
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const GREETINGS = {
  morning: "Good Morning",
  afternoon: "Good Afternoon",
  evening: "Good Evening",
};

type User = {
  name: string;
  email: string;
  userId: string;
};

type DashCardData = {
  title: string;
  data: number;
  type: string;
  today: number;
  percentage: number;
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
    title: "Category",
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
  const [userData, setUserData] = useState<User | null>(null);
  const [mainData, setMainData] = useState({
    products: [] as any[],
    category: [] as any[],
    orders: [] as any[],
    users: [] as any[],
  });
  const [pieChartData, setPieChartData] = useState<{
    labels: string[];
    datasets: [
      {
        data: number[];
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ];
      }
    ];
  }>();

  const [analysisData, setAnalysisData] = useState<
    { name: string; Orders: any; Profit: any }[]
  >([]);

  useEffect(() => {
    getUserTokenData();
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

  const getUserTokenData = async () => {
    try {
      const resp = await axios.get("/api/auth/user");
      setUserData(resp.data.user);
    } catch (error: any) {
      router.push("/login");
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
    } else if (title === "Category") {
      setMainData((prevMainData) => ({
        ...prevMainData,
        category: data.category,
      }));
      updatedCardData[index].data = data.totalCategory;
      updatedCardData[index].today = data.changesToday;
      updatedCardData[index].percentage = data.percentageIncrease;
      updatedCardData[index].type =
        data.percentageIncrease === 0
          ? "neutral"
          : data.percentageIncrease > 0
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
      updatedCardData[index].percentage = data.percentageIncreaseProfit;
      updatedCardData[index].type =
        data.percentageIncreaseProfit === 0
          ? "neutral"
          : data.percentageIncreaseProfit > 0
          ? "positive"
          : "negative";
    }
    setDashCardData(updatedCardData);
  };

  useEffect(() => {
    const categoryLabels = mainData.category.map((category) => category.name);
    const categoryData = mainData.category.map(
      (category) =>
        mainData.products.filter((product) => product.category === category.id)
          .length
    );
    setPieChartData({
      labels: categoryLabels,
      datasets: [
        {
          data: categoryData,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    });
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
      const monthIndex = orderDate.getMonth();
      monthlyOrderData[monthIndex]++;
      monthlyProfitData[monthIndex] += order.total;
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
      const [productResp, categoryResp, userResp, orderResp] =
        await Promise.all([
          axios.get("/api/dashboard/card-data/products"),
          axios.get("/api/dashboard/card-data/category"),
          axios.get("/api/dashboard/card-data/user"),
          axios.get("/api/dashboard/card-data/orders"),
        ]);

      updateCardData("Products", productResp.data);
      updateCardData("Stock", productResp.data);
      updateCardData("Category", categoryResp.data);
      updateCardData("Users", userResp.data);
      updateCardData("Orders", orderResp.data);
      updateCardData("Gross Profit", orderResp.data);
    } catch (error) {
      router.push("/login");
    }
  };

  return (
    <main className="w-full bg-[#f6f9fc] flex justify-center items-center">
      <section className="w-[92%]">
        <div className="my-6 flex justify-between items-start">
          <p className="font-semibold text-xl">
            {`${greet}, ${userData?.name || ""} 🙌`}
          </p>
        </div>
        <section className="my-6 flex justify-evenly items-start">
          <div className="w-full flex justify-start items-center">
            {dashCardData.map((card, index) => (
              <DashCard key={index} data={card} />
            ))}
          </div>
        </section>
        <section className="w-[92%] mx-auto my-10">
          <div className="w-full bg-white shadow-md border rounded-md p-4 flex justify-center items-center flex-col">
            <p className="font-semibold text-center my-4 text-xl">
              Profit Analysis
            </p>
            <BarChart width={1000} height={250} data={analysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Profit" fill="#82ca9d" />
            </BarChart>
          </div>
        </section>
        <section className="w-[92%] mx-auto my-10">
          <div className="w-full bg-white shadow-md border rounded-md p-4 flex justify-center items-center flex-col">
            <p className="font-semibold text-center my-4 text-xl">
              Orders Analysis
            </p>
            <BarChart width={1000} height={250} data={analysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Orders" fill="#8884d8" />
            </BarChart>
          </div>
        </section>
        <section className="w-[92%] mx-auto my-10 flex justify-between items-center">
          <section className="w-[40%] bg-white shadow-md border rounded-md flex justify-center items-center flex-col">
            <p className="font-semibold text-center mt-4 text-lg">
              Products in Each Category
            </p>
            <div className="w-[80%] flex justify-center items-center">
              {pieChartData &&
              pieChartData.labels &&
              pieChartData.labels.length !== 0 ? (
                <Pie data={pieChartData} />
              ) : (
                <p>No data available for the pie chart.</p>
              )}
            </div>
          </section>
          <section className="w-[40%] bg-white shadow-md border rounded-md flex justify-center items-center flex-col">
            <p className="font-semibold text-center mt-4 text-lg">
              Products in Each Category
            </p>
            <div className="w-[80%] flex justify-center items-center">
              {pieChartData &&
              pieChartData.labels &&
              pieChartData.labels.length !== 0 ? (
                <Pie data={pieChartData} />
              ) : (
                <p>No data available for the pie chart.</p>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Home;
