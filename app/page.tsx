"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashCard from "./(dashboard)/DashCard";

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
  const [userData, setUserData] = useState<User | null>(null);
  const [mainData, setMainData] = useState({
    products: [] as any[],
    category: [] as any[],
    orders: [] as any[],
    users: [] as any[],
  });
  const [productPieChartData, setProductPieChart] = useState<{
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

  const [orderPieChartData, setOrderPieChart] = useState<{
    labels: string[];
    datasets: [
      {
        data: number[];
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)"
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
    setProductPieChart({
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
    const OrderLabels = ["Shipping", "Delivered", "Pending"];
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
    setOrderPieChart({
      labels: OrderLabels,
      datasets: [
        {
          data: orderData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 205, 86, 0.6)",
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
      const [productResp, userResp, orderResp] = await Promise.all([
        axios.get("/api/dashboard/card-data/products"),
        axios.get("/api/dashboard/card-data/user"),
        axios.get("/api/dashboard/card-data/orders"),
      ]);
      updateCardData("Products", productResp.data);
      updateCardData("Stock", productResp.data);
      updateCardData("Users", userResp.data);
      updateCardData("Orders", orderResp.data);
      updateCardData("Gross Profit", orderResp.data);
    } catch (error) {
      router.push("/login");
    }
  };

  return (
    <main className="w-[90%] mx-auto bg-[#f6f6f6] flex justify-center items-center max-h-[100vh]">
      <section className="my-6 w-full">
        <div className="w-full mb-4">
          <p className="font-semibold text-xl">
            {`${greet}, ${userData?.name || ""}`}
          </p>{" "}
          <p className="text-sm mt-1 text-black/60">
            Here what&lsquo;s happening with your store
          </p>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          {dashCardData.map((card, index) => (
            <DashCard key={index} data={card} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
