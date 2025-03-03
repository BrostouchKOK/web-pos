import React from "react";
import { Form, Button, Input, Space } from "antd";
import { request } from "../../utils/helper";
import { setAccessToken, setProfile } from "../../store/profile.store";
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();



  // onLogin Function
  const onLogin = async (items) => {
    const params = {
      username: items.username,
      password: items.password,
    };
    const res = await request("auth/login", "post", params);
    if (res && !res.error) {
      setAccessToken(res.access_token);
      // local storage cannot store object
      // but can store string object
      setProfile(JSON.stringify(res.profile));
      navigate("/");
      
    } else {
      alert(JSON.stringifyk(res));
    }
  };
  return (
    <div className="w-50 bg-white m-auto px-4 py-3 rounded shadow">
      <h3>Login Page</h3>
      <Form layout="vertical" form={form} onFinish={onLogin}>
        <Form.Item label="Username" name="username">
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
