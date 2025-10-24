import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Quản lý người dùng",
    },
    {
      key: "/messages",
      icon: <MessageOutlined />,
      label: "Quản lý tin nhắn",
    },
    ...(admin?.role === "super_admin"
      ? [
          {
            key: "/admin/create",
            icon: <UserAddOutlined />,
            label: "Tạo admin",
          },
        ]
      : []),
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      width={250}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#1890ff" }}>Menu</h3>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          borderRight: 0,
          background: "#fff",
        }}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
