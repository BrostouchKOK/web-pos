import React, { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { MdDelete, MdEdit, MdOutlineImageNotSupported } from "react-icons/md";
import Swal from "sweetalert2";
import MainPage from "../../components/layout/MainPage";
import { configStore } from "../../store/configStore";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ProductPage = () => {
  const [form] = Form.useForm();
  const { config } = configStore();
  const [state, setState] = useState({
    list: [],
    visibleModal: false,
    id: null,
    laoding: false,
  });
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  const [imageOptional, setImageOptional] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  // getList Function
  const getList = async () => {
    var param = {
      // sort hand
      ...filter,
      // txt_search : filter.txt_search,
      // category_id : filter.category_id,
      // brand : filter.brand,
    };
    const res = await request("product", "get", param);
    if (res && !res.error) {
      setState((prev) => ({
        ...prev,
        list: res.list,
      }));
    }
    // console.log(res);
  };
  console.log(state.list);

  // handleBtnNew Function
  const handleBtnNew = async () => {
    const res = await request("new_barcode", "post");
    // console.log(res);
    if (res && !res.error) {
      form.setFieldValue("barcode", res.barcode);
      setState((prev) => ({
        ...prev,
        visibleModal: true,
      }));
    }
  };

  // handleCancelModal Function
  const handleCancelModal = () => {
    setState((prev) => ({
      ...prev,
      visibleModal: false,
    }));
    form.resetFields();
    setImageDefault([]);
  };
  // aa
  // category_id	barcode	name	brand	description	qty	price	discount	status	image
  // handleFinish Function

  const handleFinish = async (item) => {
    try {
      var params = new FormData();
      params.append("name", item.name);
      params.append("category_id", item.category_id);
      params.append("barcode", item.barcode);
      params.append("brand", item.brand);
      params.append("description", item.description);
      params.append("qty", item.qty);
      params.append("price", item.price);
      params.append("discount", item.discount);
      params.append("status", item.status);

      // when update use this two more key
      params.append("image", form.getFieldValue("image")); // just name image
      params.append("id", form.getFieldValue("id"));

      if (item.image_default) {
        if (item.image_default.file.status === "removed") {
          params.append("image_remove","1");
        } else {
          params.append(
            "upload_image",
            item.image_default.file.originFileObj,
            item.image_default.file.name
          );
        }
      }
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("product", method, params);

      if (res && !res.error) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message,
          showConfirmButton: false,
          timer: 2000,
        });
        handleCancelModal();
        getList();
      } else if (res.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.error.barcode || "Barcode exist",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong! Please try again.",
        });
      }

      console.log(res);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred!",
      });
      console.error(error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChangeImageDefault = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);
  const handleChangeImageOptional = ({ fileList: newFileList }) =>
    setImageOptional(newFileList);

  // handleDelete Function
  const handleDelete = async (items) => {
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
        const res = await request("product", "delete", {
          id: items.id,
        });

        if (res && !res.error) {
          Swal.fire(
            "Deleted!",
            res.message || "Product has been deleted.",
            "success"
          );
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };
  const handleEdit = (items) => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
    }));
    form.setFieldsValue({
      ...items,
    });
    const imageProduct = [
      {
        uid: "-1",
        name: items.image,
        status: "done",
        url: `http://localhost/full_stack/POS_Phone_Shop_Images/${items.image}`,
      },
    ];
    if (items.image) {
      setImageDefault(imageProduct);
    }
  };

  // handleFilter Function
  const handleFilter = () => {
    getList();
  };
  return (
    <MainPage laoding={false}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex w-100">
          <h5>Product List</h5>
          <Input.Search
            className="mx-3 w-auto"
            allowClear
            placeholder="search here..."
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, txt_search: e.target.value }))
            }
            onSearch={getList}
          />
          <Select
            className="w-25"
            allowClear
            placeholder="Select category"
            options={config.category}
            onChange={(id) =>
              setFilter((prev) => ({ ...prev, category_id: id }))
            }
          />
          <Select
            className="mx-3"
            allowClear
            placeholder="Select brand"
            options={config?.brand}
            onChange={(id) => setFilter((prev) => ({ ...prev, brand: id }))}
          />
          <Button type="primary" onClick={handleFilter}>
            Filter
          </Button>
        </div>
        <div>
          <Button type="primary" onClick={handleBtnNew}>
            + New
          </Button>
        </div>
      </div>

      <Modal
        open={state.visibleModal}
        title={form.getFieldValue("id") ? "Edit Product" : "Create Product"}
        footer={null}
        onCancel={handleCancelModal}
        className="w-50"
      >
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Please fill in name",
                  },
                ]}
              >
                <Input placeholder="Product name" />
              </Form.Item>
              <Form.Item
                label="rand"
                name={"brand"}
                rules={[
                  {
                    required: true,
                    message: "Please select brand",
                  },
                ]}
              >
                <Select
                  placeholder="Select brand"
                  allowClear
                  options={config.brand}
                />
              </Form.Item>

              <Form.Item
                label="Qty"
                name={"qty"}
                rules={[
                  {
                    required: true,
                    message: "Please fill in qty",
                  },
                ]}
              >
                <InputNumber className="w-100" placeholder="qty" />
              </Form.Item>
              <Form.Item label="Status" name={"status"}>
                <Select
                  placeholder="Select status"
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
              <Form.Item label="Description" name={"description"}>
                <Input.TextArea placeholder="description" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category"
                name={"category_id"}
                rules={[
                  {
                    required: true,
                    message: "Please select category",
                  },
                ]}
              >
                <Select
                  placeholder="Select category"
                  allowClear
                  options={config.category}
                />
              </Form.Item>
              <Form.Item
                label="Price"
                name={"price"}
                rules={[
                  {
                    required: true,
                    message: "Please fill in price",
                  },
                ]}
              >
                <InputNumber className="w-100" placeholder="price" />
              </Form.Item>
              <Form.Item label="Barcode" name="barcode">
                <Input disabled placeholder="barcode" />
              </Form.Item>

              <Form.Item label="Discount" name={"discount"}>
                <InputNumber className="w-100" placeholder="discount" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Image" name={"image_default"}>
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              maxCount={1}
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item>
          <Form.Item label="Image(Optional)" name={"image_optional"}>
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={4}
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <Space className="mt-2 d-flex justify-content-end">
            <Button onClick={handleCancelModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        className="mt-2"
        dataSource={state.list}
        columns={[
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "category",
            title: "Category",
            dataIndex: "category_name",
          },
          {
            key: "brand",
            title: "Brand",
            dataIndex: "brand",
          },
          {
            key: "barcode",
            title: "Barcode",
            dataIndex: "barcode",
          },
          {
            key: "price",
            title: "Price",
            dataIndex: "price",
          },
          {
            key: "qty",
            title: "Qty",
            dataIndex: "qty",
          },
          {
            key: "discount",
            title: "Discount",
            dataIndex: "discount",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "image",
            title: "Image",
            dataIndex: "image",
            render: (value) =>
              // "C:/xampp/htdocs/full_stack/POS_Phone_Shop_Images/" + value,
              value ? (
                <Image
                  src={
                    "http://localhost/full_stack/POS_Phone_Shop_Images/" + value
                  }
                  style={{ width: 40 }}
                />
              ) : (
                <div
                  style={{ background: "#eee", width: 40, cursor: "pointer" }}
                >
                  <MdOutlineImageNotSupported className="w-100" />
                </div>
              ),
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
                  className="p-2"
                  type="primary"
                  danger
                  onClick={() => handleDelete(data)}
                >
                  <MdDelete className="fs-6" />
                </Button>
                <Button
                  className="p-2"
                  type="primary"
                  onClick={() => handleEdit(data)}
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

export default ProductPage;
