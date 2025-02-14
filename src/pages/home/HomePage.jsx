import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import HomeGrid from "../../components/home/HomeGrid";

const HomePage = () => {
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
