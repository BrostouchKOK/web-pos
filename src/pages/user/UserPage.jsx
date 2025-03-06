import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const UserPage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    role: [],
    loading: false,
    visibleModal: false,
  });
  useEffect(() => {
    getList();
  }, []);

  // fetch getLisht user form api Function
  const getList = async () => {
    const res = await request("auth/get-list", "get");
    if (res && !res.error) {
      setState((prev) => ({
        ...prev,
        list: res.list,
        role: res.role,
      }));
    }
  };

  // onClickEdit Function
  const onClickEdit = (data) => {
    alert(data);
  };

  // onClickDelete Function
  const onClickDelete = (danger) => {};

  // onCloseModal Function
  const onCloseModal = () => {
    setState((prev) => ({
      ...state,
      visibleModal: false,
    }));
    form.resetFields();
  };
  // onOpenModal Function
  const onOpenModal = () => {
    setState((prev) => ({
      ...state,
      visibleModal: true,
    }));
  };
  // onFinish Function
  const onFinish = async (items) => {
    // alert(JSON.stringify(items));
    if(items.password !== items.confirm_password){
      Swal.fire({
        icon : "warning",
        title : "Error",
        text: "password and confirm password not match! please try again!"
      })
      return
    }
    const data = {
      ...items,
      // name : items.name,
      // username : items.username,
      // password : items.password,
      // role : items.role,
      // is_active : items.is_active,
    };
    const res = await request("auth/register", "post", data);
    try {
      if (res && !res.error) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          timer: 2000,
          text: res.message || "User Save Successfully!",
          showConfirmButton: false,
        });
        onCloseModal();
        getList();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to create user",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        icon: "error",
        text: "An error occurred while saving.",
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <h5>User</h5>
          <Input.Search className="mx-4" placeholder="Search here..." />
        </div>
        <div>
          <Button type="primary" onClick={onOpenModal}>
            New +
          </Button>
        </div>
      </div>
      <Modal
        title="Create New User"
        footer={null}
        open={state.visibleModal}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please confirm password!",
              },
            ]}
          >
            <Input.Password placeholder="confirm password" />
          </Form.Item>
          <Form.Item
            name="role_id"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select role!",
              },
            ]}
          >
            <Select placeholder="select role" options={state.role} />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Status"
            // initialValue={1}
            rules={[
              {
                required: true,
                message: "Please select status!",
              },
            ]}
          >
            <Select
              placeholder="select status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "InActive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <Space>
            <Button onClick={onCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: "No",
            render: (_, __, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "username",
            title: "Username",
            dataIndex: "username",
          },
          {
            key: "role_name",
            title: "Role Name",
            dataIndex: "role_name",
          },
          {
            key: "is_active",
            title: "Status",
            dataIndex: "is_active",
            render: (isActive) => {
              console.log("Rendering Status:", isActive); // Debugging
              return isActive === 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              );
            },
          },
          {
            key: "create_by",
            title: "Crete By",
            dataIndex: "create_by",
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (value, data, index) => (
              <Space>
                <Button type="primary" onClick={() => onClickEdit(data)}>
                  <MdEdit className="fs-5" />
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => onClickDelete(data)}
                >
                  <MdDelete className="fs-5" />
                </Button>
              </Space>
            ),
          },
        ]}
      ></Table>
    </div>
  );
};

export default UserPage;
