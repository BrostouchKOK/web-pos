import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const CategoryPage = () => {
  const [list, setList] = useState([]);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    description: "",
    status: "",
    parentId: null,
  });

  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    const res = await request("category", "get");
    if (res) {
      setList(res.list);
      console.log(res.list);
    }
  };
  // btn onClick Edit
  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
    });
  };
  // btn onClick Delete
  const onClickDelete = async (data, index) => {
    const res = await request("category", "delete", {
      id: data.id,
    });
    alert(JSON.stringify(res));
  };
  // Add Btn
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  // onCancel Btn
  const onCancelModal = () => {
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
  };


  const onFinish = async (items) => {
    var data = {
      name: items.name,
      description: items.description,
      status: items.status,
    };

    try {
      const res = await request("category", "post", data);

      console.log("Response:", res); // Debugging log

      if (res && !res.error) {
        message.success(res.message || "Category added successfully!");
        onCancelModal();
      } else {
        message.error(res.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to add category.");
    }
  };

  // onFinish Function
  // const onFinish = async (items) => {
  //   var data = {
  //     name: items.name,
  //     description: items.description,
  //     status: items.status,
  //   };

  //   try {
  //     const res = await request("category", "post", data);
  //     console.log("Response:", res); // Debugging

  //     if (res && !res.error) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success!",
  //         text: res.message || "Category saved successfully!",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });

  //       getList(); // Refresh the table after saving
  //       onCancelModal();
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error!",
  //         text: res?.message || "Failed to save category",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: "An error occurred while saving.",
  //     });
  //   }
  // };

  return (
    <div>
      <Button type="primary" onClick={onClickAddBtn}>
        + New
      </Button>

      <Modal
        open={state.visibleModal}
        title={"New Category"}
        footer={null}
        onCancel={onCancelModal}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name={"name"}>
            <Input placeholder="Input category name" />
          </Form.Item>
          <Form.Item label="Desctiption" name={"description"}>
            <Input.TextArea placeholder="Input category description" />
          </Form.Item>
          <Form.Item label="Status" name={"status"}>
            <Select
              placeholder="Select status"
              options={[
                {
                  label: "Avtive",
                  value: 1,
                },
                {
                  label: "Inactive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <Space className="mt-2">
            <Button onClick={onCancelModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        className="mt-2"
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "id",
            title: "Id",
            dataIndex: "id",
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (status) =>
              status ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "action",
            title: "Action",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  danger
                  onClick={() => onClickDelete(data)}
                >
                  <MdDelete className="fs-5" />
                </Button>
                <Button type="primary" onClick={() => onClickEdit(data)}>
                  <MdEdit className="fs-5" />
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CategoryPage;
