import { Button, Result, Spin } from "antd";
import React from "react";
import { getServerStatus } from "../../store/service.store";

const MainPage = ({ children, laoding }) => {
  const Info = {
    404: {
      message: "404-Route Not Found",
      sub: "404-Route Not Found",
    },
    403: {
      message: "403-Unauthorized",
      sub: "Sorry, you are not authorized to access this page",
    },
    500: {
      message: "500-Internal Server Error",
      sub: "Internal Server Error Pls Contact to Amin",
    },
    "error": {
      message: "Cannot Connect To Server",
      sub: "Server Sleeping",
    },
  };
  const server_status =getServerStatus();
  const isServerError =
    server_status == "403" || server_status == "500" || server_status == "404" || server_status == "error";
  if (isServerError) {
    return (
      <Result
        status={server_status + ""}
        title={Info[server_status].message}
        subTitle={Info[server_status].sub}
        extra={<Button type="primary">Back Home</Button>}
      />
    );
  }
  return (
    <div>
      <Spin spinning={laoding}>{children}</Spin>
    </div>
  );
};

export default MainPage;
