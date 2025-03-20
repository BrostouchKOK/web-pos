import React, { useEffect, useState } from "react";
import { formatDateClient, request } from "../../utils/helper";
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

const EmployeePage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    description: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });
  const [formRef] = Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  // GetList Function
  const getList = async () => {
    var param = {
      txtSearch: state.txtSearch,
    };
    const res = await request("employee", "get", param);
    // alert(JSON.stringify(res));
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
      ...data,
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
        const res = await request("employee", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          Swal.fire(
            "Deleted!",
            res.message || "employee has been deleted.",
            "success"
          );
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete employee.", "error");
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
      ...items,
    };

    try {
      var method = "post";
      if (formRef.getFieldValue("id")) {
        // case update
        method = "put";
      }
      const res = await request("employee", method, data);

      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "employee saved successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        getList(); // Refresh the table after saving
        onCancelModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to save employee",
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
        <div className="d-flex w-100">
          <h5>Employee List</h5>
          <Input.Search
            className="mx-3 w-auto"
            allowClear
            placeholder="search here..."
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                txtSearch: e.target.value,
              }))
            }
            onSearch={getList}
          />
          <Button type="primary" onClick={getList}>
            Filter
          </Button>
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
          formRef.getFieldValue("id") ? "Edit Employee" : "Create Employee"
        }
        footer={null}
        onCancel={onCancelModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item label="Firstname" name={"firstname"}>
            <Input placeholder="firstname" />
          </Form.Item>
          <Form.Item label="Lastname" name={"lastname"}>
            <Input placeholder="lastname" />
          </Form.Item>
          <Form.Item label="Gender" name={"gender"}>
            <Select
              placeholder="Select gender"
              options={[
                {
                  label: "Male",
                  value: 1,
                },
                {
                  label: "Female",
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Telephone" name={"tel"}>
            <Input placeholder="Input employee telephone" />
          </Form.Item>
          <Form.Item label="Email" name={"email"}>
            <Input placeholder="Input employee email" />
          </Form.Item>
          <Form.Item label="Address" name={"address"}>
            <Input placeholder="address" />
          </Form.Item>
          <Form.Item label="position" name={"position"}>
            <Input placeholder="position" />
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
            key: "firstname",
            title: "firstname",
            dataIndex: "firstname",
          },
          {
            key: "lastname",
            title: "lastname",
            dataIndex: "lastname",
          },
          {
            key: "gender",
            title: "gender",
            dataIndex: "gender",
            render: (value) => (value ? "Male" : "Female"),
          },
          {
            key: "tel",
            title: "Tel",
            dataIndex: "tel",
          },
          {
            key: "email",
            title: "Email",
            dataIndex: "email",
          },
          {
            key: "address",
            title: "address",
            dataIndex: "address",
          },
          {
            key: "position",
            title: "position",
            dataIndex: "position",
          },
          {
            key: "create_at",
            title: "Create at",
            dataIndex: "create_at",
            render: (value) => formatDateClient(value),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  className="p-2"
                  type="primary"
                  danger
                  onClick={() => onClickDelete(data)}
                >
                  <MdDelete className="fs-6" />
                </Button>
                <Button
                  className="p-2"
                  type="primary"
                  onClick={() => onClickEdit(data)}
                >
                  <MdEdit className="fs-6" />
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default EmployeePage;
