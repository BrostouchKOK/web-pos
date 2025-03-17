import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import cafeLogo from "../../assets/img/logos/cafe-logo.jpg";
import messi from "../../assets/img/users/messi.jpg";
import {
  getProfile,
  setAccessToken,
  setProfile,
} from "../../store/profile.store";
import {configStore} from "../../store/configStore"
import { request } from "../../utils/helper";
const { Header, Content, Footer, Sider } = Layout;

// onCickMenu function
// const navigate = useNavigate();
// const onClickMenu = (item)=>{
//   navigate(item.key);
// }

const items = [
  {
    key: "",
    label: "Dashboard",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "customer",
    label: "Customer",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "order",
    label: "Order",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "pos",
    label: "POS",
    icon: <PieChartOutlined />,
    children: null,
  },

  {
    key: "product",
    label: "Product",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "product",
        label: "List Product",
        children: null,
      },
      {
        key: "product/category",
        label: "Catefory",
        children: null,
      },
    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "supplier",
        label: "Supplier",
        children: null,
      },
      {
        key: "purchase",
        label: "List Purchase",
        children: null,
      },
      {
        key: "purchase_product",
        label: "Purchase Product",
        children: null,
      },
    ],
  },
  {
    key: "expanse",
    label: "Expanse",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "expanse_type",
        label: "Expanse Type",
        children: null,
      },
      {
        key: "expanse",
        label: "Expanse",
        children: null,
      },
    ],
  },
  {
    key: "employee",
    label: "Employee",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "employee",
        label: "Employee",
        children: null,
      },
      {
        key: "payroll",
        label: "Payroll",
        children: null,
      },
    ],
  },
  {
    key: "user",
    label: "User",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "user",
        label: "User",
        children: null,
      },
      {
        key: "role",
        label: "Role",
        children: null,
      },
      {
        key: "role_permission",
        label: "Role Permission",
        children: null,
      },
    ],
  },
  {
    key: "setting",
    label: "Setting",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "currency",
        label: "Currency",
        children: null,
      },
      {
        key: "language",
        label: "Language",
        children: null,
      },
    ],
  },
];
const MasterLayout = () => {
  const {setConfig} =  configStore();
  const profile = getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
    getConfig();
  }, []);
  const onClickMenu = (item) => {
    navigate(item.key);
  };
  // onLogout Function
  const onLogout = () => {
    setAccessToken("");
    setProfile("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

  const itemsDrowdown = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Setting
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Change Password
        </a>
      ),
      icon: <SmileOutlined />,
      // disabled: true,
    },
    {
      key: "logout",
      danger: true,
      label: "Logout",
    },
  ];

  const getConfig = async () => {
    const res = await request("config", "get");
    if (res) {
      setConfig(res);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          // onClick={onClickMenu}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <header>
          <div className="bg-white mx-3 rounded p-3 mt-2 mb-2 shadow d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={cafeLogo}
                width={60}
                height={60}
                className="rounded-circle"
                alt=""
              />
              <div className="mx-3 text-center">
                <h5>POS System</h5>
                <span className="fw-bold">Compute & Phone Shop</span>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {/* <div>{profile && <Button onClick={onLogout}>Logout</Button>}</div> */}
              <div className="mx-3 text-center">
                <h5>{profile?.name}</h5>
                <span className="fw-bold">{profile?.role_name}</span>
              </div>
              <Dropdown
                menu={{
                  items: itemsDrowdown,
                  onClick: (e) => {
                    if (e.key == "logout") {
                      onLogout();
                    }
                  },
                }}
              >
                <img
                  src={messi}
                  width={60}
                  height={60}
                  className="rounded-circle cursor-pointer"
                />
              </Dropdown>
            </div>
          </div>
        </header>
        <Content
          style={{
            margin: "0 16px",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MasterLayout;
