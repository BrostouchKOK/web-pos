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
import MainPage from "../../components/layout/MainPage";

const CategoryPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    description: "",
    status: "",
    parentId: null,
  });
  const [formRef] = Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  // GetList Function
  const getList = async () => {
    const res = await request("category", "get");
    setLoading(true);
    if (res) {
      setLoading(false);
      setList(res.list);
      // console.log(res.list);
    }
  };
  // onClickEdit Function
  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
    });
    formRef.setFieldsValue({
      id: data.id, // hidden id
      name: data.name,
      description: data.description,
      status: data.status,
    });
  };
  // onClickDelete Function
  const onClickDelete = async (data, index) => {
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
        const res = await request("category", "delete", {
          id: data.id,
        });

        if (res && !res.error) {
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete category.", "error");
        }
      }
    });
  };

  // onClickAddBtn Function
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  // onCancel Btn
  const onCancelModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
  };

  // onFinish Function
  const onFinish = async (items) => {
    var data = {
      id: formRef.getFieldValue("id"),
      name: items.name,
      description: items.description,
      status: items.status,
    };

    try {
      var method = "post";
      if (formRef.getFieldValue("id")) {
        // case update
        method = "put";
      }
      const res = await request("category", method, data);

      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "Category saved successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        getList(); // Refresh the table after saving
        onCancelModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to save category",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while saving.",
      });
    }
  };

  return (
    <MainPage laoding={loading}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between align-items-center ">
          <h5>Category</h5>
          <Input.Search
            className="mx-3"
            allowClear
            placeholder="search here..."
          />
        </div>
        <div>
          <Button type="primary" onClick={onClickAddBtn}>
            + New
          </Button>
        </div>
      </div>

      <Modal
        open={state.visibleModal}
        title={
          formRef.getFieldValue("id") ? "Edit Category" : "Create Category"
        }
        footer={null}
        onCancel={onCancelModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
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
              {formRef.getFieldValue("id") ? "Update" : "Save"}
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
            align: "center",
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
    </MainPage>
  );
};

export default CategoryPage;
