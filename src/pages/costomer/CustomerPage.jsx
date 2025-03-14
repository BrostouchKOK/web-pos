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

const CustomerPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    description: "",
    status: "",
    parentId: null,
    txtSearch : "",
  });
  const [formRef] = Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  // GetList Function
  const getList = async () => {
    var param = {
      txtSearch : state.txtSearch
    }
    const res = await request("customer", "get",param);
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
      ...data
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
        const res = await request("customer", "delete", {
          
          id: data.id,
        });
        // alert(JSON.stringify(res));

        if (res && !res.error) {
          Swal.fire("Deleted!", res.message || "customer has been deleted.", "success");
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete customer.", "error");
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
      const res = await request("customer", method, data);

      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "customer saved successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        getList(); // Refresh the table after saving
        onCancelModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to save customer",
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
          <h5>Customer List</h5>
          <Input.Search
            className="mx-3 w-auto"
            allowClear
            placeholder="search here..."
            onChange={(e)=>setState((prev)=>({
              ...prev,
              txtSearch : e.target.value,
            }))}
            onSearch={getList}
          />
          <Button type="primary" onClick={getList}>Filter</Button>
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
          formRef.getFieldValue("id") ? "Edit customer" : "Create customer"
        }
        footer={null}
        onCancel={onCancelModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item label="Name" name={"name"}>
            <Input placeholder="Input customer name" />
          </Form.Item>
          <Form.Item label="Telephone" name={"tel"}>
            <Input placeholder="Input customer telephone" />
          </Form.Item>
          <Form.Item label="Email" name={"email"}>
            <Input placeholder="Input customer email" />
          </Form.Item>
          <Form.Item label="Address" name={"address"}>
            <Input placeholder="Input customer address" />
          </Form.Item>
          <Form.Item label="Type" name={"type"}>
            <Input placeholder="Input customer type" />
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
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "tel",
            title: "Telephone",
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
            key: "type",
            title: "Type",
            dataIndex: "type",
          },
          {
            key: "create_by",
            title: "Create By",
            dataIndex: "create_by",
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

export default CustomerPage;
