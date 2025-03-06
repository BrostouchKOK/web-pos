import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import { Button, Form, Input, message, Modal, Space, Table, Tag } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const UserPage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
  });
  useEffect(() => {
    getList();
  }, []);

  // fetch getList role form api Function
  const getList = async () => {
    const res = await request("role", "get");
    if (res && !res.error) {
      setState((prevState) => ({
        ...prevState,
        list: res.list,
      }));
    }
  };

  // onClickEdit Function
  const onClickEdit = (data) => {
    form.setFieldsValue({
      ...data,
      // id : data.id,
      // name : data.name,
      // code : data.code,
    });
    handleOpenModal();
  };

  // onClickDelete Function
  const onClickDelete = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await request("role","delete", {
          id: data.id,
        });

        if (res && !res.error) {
          Swal.fire("Deleted!", "role has been deleted.", "success");
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete category.", "error");
        }
      }
    });
  };

  // onFinish Function
  const onFinish = async (items) => {
    const data = {
      id: form.getFieldValue("id"),
      name: items.name,
      code: items.code,
    };
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }
    const res = await request("role", method, data);
    if (res && !res.error) {
      Swal.fire({
        title: "Success!",
        text: res.message || "Role created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      handleCloseModal();
      getList();
    } else {
      Swal.fire({
        title: "Error!",
        text: res.error || "Somthing when wrong!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  // handleOpenModal Function
  const handleOpenModal = () => {
    setState((prevState) => ({
      ...prevState,
      visible: true,
    }));
  };

  // handleCloseModal Function
  const handleCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      visible: false,
    }));
    form.resetFields(); // reset form after success
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <h5>Role</h5>
          <Input.Search className="mx-4" placeholder="Search here..." />
        </div>
        <div>
          <Button type="primary" onClick={handleOpenModal}>
            New +
          </Button>
        </div>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Update Role" : "Create Role"}
        open={state.visible}
        footer={null}
        onCancel={handleCloseModal}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          // className="w-50 m-auto shadow py-3 px-5 rounded"
        >
          <Form.Item name="name" label="Role Name">
            <Input placeholder="role name" />
          </Form.Item>
          <Form.Item name="code" label="Role Code">
            <Input placeholder="role code" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        className="mt-3"
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
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "is_active",
            title: "Status",
            render: (value, data, index) =>
              value ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
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
