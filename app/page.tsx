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

  const getCardData = async () => {
    const productResp = await axios.get("/api/dashboard/card-data/products");
    let updatedCardData = [...dashCardData];
    let index = updatedCardData.findIndex((card) => card.title === "Products");
    updatedCardData[index].data = productResp.data.totalProducts;
    updatedCardData[index].today = productResp.data.changesTodayProduct;
    updatedCardData[index].percentage =
      productResp.data.percentageIncreaseProduct;
    updatedCardData[index].type =
      productResp.data.percentageIncreaseProduct === 0
        ? "neutral"
        : productResp.data.percentageIncreaseProduct > 0
        ? "positive"
        : "negative";
    index = updatedCardData.findIndex((card) => card.title === "Stock");
    updatedCardData[index].data = productResp.data.totalQuantity;
    updatedCardData[index].today = productResp.data.changesTodayStock;
    updatedCardData[index].percentage =
      productResp.data.percentageIncreaseStock;
    updatedCardData[index].type =
      productResp.data.percentageIncreaseStock === 0
        ? "neutral"
        : productResp.data.percentageIncreaseStock > 0
        ? "positive"
        : "negative";
    setDashCardData(updatedCardData);

    const categoryResp = await axios.get("/api/dashboard/card-data/category");
    updatedCardData = [...dashCardData];
    index = updatedCardData.findIndex((card) => card.title === "Category");
    updatedCardData[index].data = categoryResp.data.totalCategory;
    updatedCardData[index].today = categoryResp.data.changesToday;
    updatedCardData[index].percentage = categoryResp.data.percentageIncrease;
    updatedCardData[index].type =
      categoryResp.data.percentageIncrease === 0
        ? "neutral"
        : categoryResp.data.percentageIncrease > 0
        ? "positive"
        : "negative";
    setDashCardData(updatedCardData);

    const userResp = await axios.get("/api/dashboard/card-data/user");
    updatedCardData = [...dashCardData];
    index = updatedCardData.findIndex((card) => card.title === "Users");
    updatedCardData[index].data = userResp.data.totalUser;
    updatedCardData[index].today = userResp.data.changesToday;
    updatedCardData[index].percentage = userResp.data.percentageIncrease;
    updatedCardData[index].type =
      userResp.data.percentageIncrease === 0
        ? "neutral"
        : userResp.data.percentageIncrease > 0
        ? "positive"
        : "negative";
    setDashCardData(updatedCardData);

    const orderResp = await axios.get("/api/dashboard/card-data/orders");
    updatedCardData = [...dashCardData];
    index = updatedCardData.findIndex((card) => card.title === "Orders");
    updatedCardData[index].data = orderResp.data.totalOrders;
    updatedCardData[index].today = orderResp.data.changesTodayOrder;
    updatedCardData[index].percentage = orderResp.data.percentageIncreaseOrder;
    updatedCardData[index].type =
      orderResp.data.percentageIncreaseOrder === 0
        ? "neutral"
        : orderResp.data.percentageIncreaseOrder > 0
        ? "positive"
        : "negative";
    index = updatedCardData.findIndex((card) => card.title === "Gross Profit");
    updatedCardData[index].data = orderResp.data.totalProfit;
    updatedCardData[index].today = orderResp.data.changesTodayProfit;
    updatedCardData[index].percentage = orderResp.data.percentageIncreaseProfit;
    updatedCardData[index].type =
      orderResp.data.percentageIncreaseProfit === 0
        ? "neutral"
        : orderResp.data.percentageIncreaseProfit > 0
        ? "positive"
        : "negative";
    setDashCardData(updatedCardData);
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
      </section>
    </main>
  );
};

export default Home;
