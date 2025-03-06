import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import HomeGrid from "../../components/home/HomeGrid";
import { create } from "zustand";
import { Button } from "antd";

const countStore = create((set) => ({
  count: 1,
  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),
  decrease: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));

const HomePage = () => {
  const { count, increase, decrease } = countStore();
  const [home, setHome] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("home", "get");
    if (res) {
      setHome(res.list);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{count}</h1>
      <Button onClick={() => increase()}>+</Button>
      <Button onClick={() => (count > 0 ? decrease() : count)}>-</Button>
      <div className="row">
        {home.map((item, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4 rounded">
            <HomeGrid title={item.title} total={item.obj?.total} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
