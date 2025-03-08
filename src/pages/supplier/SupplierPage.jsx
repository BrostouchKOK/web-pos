import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import MainPage from "../../components/layout/MainPage";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { MdDelete, MdEditSquare } from "react-icons/md";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const SupplierPage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    list: [],
    visibleModal: false,
    txtSearch: "",
  });
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    const res_config = await request("config","get");
    console.log(res_config)
    setState((prev)=>({
      ...prev,
      loading : true,
    }))
    //txtSearch = VN101 => we can call it query parameter
    const res = await request(`supplier?txtSearch=${state.txtSearch}`, "get");
    try {
      if (res && !res.error) {
        setState((prev) => ({
          ...prev,
          list: res.list,
          loading : false,
        }));
      }
    } catch (error) {}
  };

  // HandleOpenModal Function
  const HandleOpenModal = () => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
    }));
  };

  // HandleCloseModal Function
  const HandleCloseModal = () => {
    setState((prev) => ({
      ...prev,
      visibleModal: false,
    }));
  };

  // handleOnFinish Function
  const handleOnFinish = async (items) => {
    // console.log(items);
    let data = {
      id: form.getFieldValue("id"),
      name: items.name,
      code: items.code,
      tel: items.tel,
      email: items.email,
      address: items.address,
      website: items.website,
    };

    try {
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("supplier", method, data);
      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Successfully!",
          showLoaderOnConfirm: false,
          timer: 2000,
          text: res.message || "Supplier Saved Successfully!",
        });
        getList();
        HandleCloseModal();
        form.resetFields();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to save category",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while saving.",
      });
    }
  };

  // handleDelete Function
  const handleDelete = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (resutl) => {
      if (resutl.isConfirmed) {
        const res = await request("supplier", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          Swal.fire("Deleted!", "Supplier has been deleted.", "success");
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete supplier.", "error");
        }
      }
    });
  };
  // handleEdit Function
  const handleEdit = (data) => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
    }));
    form.setFieldsValue({
      id: data.id,
      ...data,
    });
  };
  return (
    <MainPage laoding={state.loading}>
      <h1>{dayjs().format("DD-MMM-YYYY h:mm A")}</h1>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between">
          <h4>Supplier</h4>
          <Input.Search
            className="mx-3"
            placeholder="search here..."
            onChange={(value) =>
              setState((prev) => ({
                ...prev,
                txtSearch: value.target.value,
              }))
            }
            allowClear
            onSearch={getList}
          />
        </div>
        <div>
          <Button type="primary" onClick={HandleOpenModal}>
            New +
          </Button>
        </div>
      </div>

      <Modal
        title={
          form.getFieldValue("id") ? "Update Supplier" : "Create New Supplier"
        }
        open={state.visibleModal}
        footer={null}
        onCancel={HandleCloseModal}
      >
        <Form layout="vertical" form={form} onFinish={handleOnFinish}>
          <Form.Item name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="code" label="Code">
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item name="tel" label="Tel">
            <Input placeholder="tel" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="address" />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="website" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={HandleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
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
            key: "code",
            title: "Code",
            dataIndex: "code",
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
            title: "Address",
            dataIndex: "address",
          },
          {
            key: "website",
            title: "Website",
            dataIndex: "website",
          },
          {
            key: "create_at",
            title: "create_at",
            dataIndex: "create_at",
            render : (value) => dayjs(value).format("DD-MMM-YYYY h:mm A"),
          },
          {
            key: "action",
            title: "Action",
            render: (item, data, index) => (
              <Space>
                <Button type="primary">
                  <MdEditSquare
                    className="fs-6"
                    onClick={() => handleEdit(data)}
                  />
                </Button>
                <Button type="primary" danger>
                  <MdDelete
                    className="fs-6"
                    onClick={() => handleDelete(data)}
                  />
                </Button>
              </Space>
            ),
          },
        ]}
      ></Table>
    </MainPage>
  );
};

export default SupplierPage;
