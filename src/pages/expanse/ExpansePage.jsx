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
import { configStore } from "../../store/configStore";

const ExpansePage = () => {
  const {config} = configStore
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
    const res = await request("expanse", "get", param);
    setLoading(true);
    if (res) {
      setLoading(false);
      setList(res.list);
    }
  };
  console.log(list)
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
        const res = await request("expense", "delete", {
          id: data.id,
        });
        // alert(JSON.stringify(res));

        if (res && !res.error) {
          Swal.fire(
            "Deleted!",
            res.message || "expense has been deleted.",
            "success"
          );
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete expense.", "error");
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
      const res = await request("expense", method, data);

      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "expense saved successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        getList(); // Refresh the table after saving
        onCancelModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res?.message || "Failed to save expense",
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
          <h5>Expense</h5>
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
          formRef.getFieldValue("id") ? "Edit expense" : "Create expense"
        }
        footer={null}
        onCancel={onCancelModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item label="expense_type_id" name={"expense_type_id"}>
            <Select
              placeholder = "Select exspanse type name"
              // options={config?.expense_type?.map((item,index)=>({
              //   label : item.name,
              //   value : item.id,
              // }))}
            />
          </Form.Item>
          <Form.Item label="Expanse Name" name={"name"}>
            <Input placeholder="Input expense name" />
          </Form.Item>
          <Form.Item label="Ref no" name={"ref_no"}>
            <Input placeholder="Input expense ref_no" />
          </Form.Item>
          <Form.Item label="Amount" name={"amount"}>
            <Input placeholder="Input expense amount" />
          </Form.Item>
          <Form.Item label="Remark" name={"remark"}>
            <Input placeholder="Input expense remark" />
          </Form.Item>
          <Form.Item label="Expense date" name={"expense_date"}>
            <Input placeholder="Input expense expense date" />
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
          // {
          //   key: "No",
          //   title: "No",
          //   render: (item, data, index) => index + 1,
          // },
          {
            key: "expense_type_id",
            title: "Expense type",
            dataIndex: "expanse_type_name",
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "ref_no",
            title: "Ref no",
            dataIndex: "ref_no",
          },
          {
            key: "amount",
            title: "Amount",
            dataIndex: "amount",
          },
          {
            key: "remark",
            title: "Remark",
            dataIndex: "remark",
          },
          {
            key: "expense_date",
            title: "Expense date",
            dataIndex: "expense_date",
          },
          {
            key: "create_by",
            title: "Create by",
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

export default ExpansePage;
