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
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import MainPage from "../../components/layout/MainPage";
import { configStore } from "../../store/configStore";
import image_placeholder from "../../assets/image_placeholder.png";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProductPage = () => {
  const { config } = configStore();
  const [state, setState] = useState({
    visibleModal: false,
    list: [],
  });
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  const [imageOptional, setImageOptional] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  // getList Fucntion
  const getList = async () => {
    var param = {
      // text_search : filter.text_search,
      // category_id : filter.category_id,
      // brand : filter.brand,

      // sorthand
      ...filter,
    };
    const res = await request("product", "get", param);
    if (res && !res.error) {
      setState((prev) => ({
        ...prev,
        list: res.list,
      }));
    }
  };

  // handleNewBtn Functioin
  const handleNewBtn = async () => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
    }));
    const res = await request("new_barcode", "post");
    if (res && !res.error) {
      form.setFieldValue("barcode", res.barcode);
    }
    // form.setFieldsValue({
    //   name : "Apple 001",
    //   category_id : 1,
    //   brand : "Apple",
    //   price : 1000,
    //   qty : 10,
    // })
  };
  // handleCloseModal Function
  const handleCloseModal = () => {
    setState((prev) => ({
      ...prev,
      visibleModal: false,
    }));
    setImageDefault([]);
    setImageOptional([]);
    form.resetFields();
  };
  // onFinish Function
  const onFinish = async (items) => {
    console.log(items);

    // Create form data
    const params = new FormData();
    params.append("name", items.name);
    params.append("category_id", items.category_id);
    params.append("barcode", items.barcode);
    params.append("brand", items.brand);
    params.append("description", items.description);
    params.append("qty", items.qty);
    params.append("price", items.price);
    params.append("discount", items.discount);
    params.append("status", items.status);

    // when update use this two keys
    params.append("image", form.getFieldValue("image")); // just name image
    params.append("id", form.getFieldValue("id"));
    //

    if (items.image_default) {
      if (items.image_default.file.status === "removed") {
        params.append("image_remove", "1");
      } else {
        params.append(
          "image_upload",
          items.image_default.file.originFileObj,
          items.image_default.file.name
        );
      }
    }
    if(items.image_optional){
      // console.log(items.image_optional);
      items.image_optional.fileList.map((item,index)=>{
        // multiple image
        params.append(
          "image_upload_optoinal",
          item.originFileObj,
          item.name,
        )
      })
    }
    try {
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("product", method, params);
      if (res && !res.error) {
        Swal.fire({
          title: "Success!",
          text: res.message || "Product added successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setImageDefault([]); // Reset imageDefault
        setImageOptional([]); // Reset imageOptional
        handleCloseModal();
        getList();
      } else {
        Swal.fire({
          icon: "error",
          text: res.error.barcode,
          title: "Error!",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
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

  // handleFilter Function
  const handleFilter = () => {
    getList();
  };

  // handleDelete Functon
  const handleDelete = async (data, index) => {
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
        const res = await request("product", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          getList(); // Refresh the list after deletion
        } else {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  // handleEdit Function
  const handleEdit = (data, index) => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
    }));
    form.setFieldsValue({
      id: data.id,
      ...data,
    });
    if (data.image != "" && data.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: data.image,
          status: "done",
          url:
            "http://localhost/full_stack/POS_Phone_Shop_Images/" + data.image,
        },
      ];
      setImageDefault(imageProduct);
    }
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
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                txt_search: event.target.value,
              }))
            }
          />
          <Select
            placeholder="Select category"
            className="w-auto"
            allowClear
            options={config?.category?.map((items, index) => ({
              label: items.name,
              value: items.id,
            }))}
            onChange={(id) =>
              setFilter((prev) => ({
                ...prev,
                category_id: id,
              }))
            }
          />
          <Select
            placeholder="Select brand"
            className="w-auto mx-3"
            allowClear
            options={config?.brand?.map((items, index) => ({
              label: items.label,
              value: items.value,
            }))}
            onChange={(id) =>
              setFilter((prev) => ({
                ...prev,
                brand: id,
              }))
            }
          />
          <Button type="primary" onClick={handleFilter}>
            Filter
          </Button>
        </div>
        <div>
          <Button type="primary" onClick={handleNewBtn}>
            + New
          </Button>
        </div>
      </div>

      <Modal
        open={state.visibleModal}
        title={form.getFieldValue("id") ? "Edit product" : "Create New product"}
        footer={null}
        onCancel={handleCloseModal}
        width={700}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label="Product name"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Please input product name!",
                  },
                ]}
              >
                <Input placeholder="Input product name" />
              </Form.Item>
              <Form.Item
                label="Brand"
                name={"brand"}
                rules={[
                  {
                    required: true,
                    message: "Please select brand!",
                  },
                ]}
              >
                <Select
                  placeholder="Select brand"
                  allowClear
                  options={config?.brand}
                />
              </Form.Item>
              <Form.Item label="Bacode" name={"barcode"}>
                <Input disabled placeholder="barcode" />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name={"qty"}
                rules={[
                  {
                    required: true,
                    message: "Please input quantity!",
                  },
                ]}
              >
                <InputNumber
                  className="w-100"
                  placeholder="Input product qty"
                />
              </Form.Item>
              <Form.Item label="Desctiption" name={"description"}>
                <Input.TextArea placeholder="Input category description" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category"
                name={"category_id"}
                rules={[
                  {
                    required: true,
                    message: "Please select category!",
                  },
                ]}
              >
                <Select
                  placeholder="Select category"
                  allowClear
                  options={config?.category?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Product price"
                name={"price"}
                rules={[
                  {
                    required: true,
                    message: "Please input price!",
                  },
                ]}
              >
                <InputNumber
                  className="w-100"
                  placeholder="Input product price"
                />
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
              <Form.Item label="Product discount" name={"discount"}>
                <InputNumber
                  className="w-100"
                  placeholder="Input product discount"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Image" name={"image_default"}>
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              maxCount={1}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
            >
              <div>+ Upload</div>
            </Upload>
          </Form.Item>
          <Form.Item label="Image(Optional)" name={"image_optional"}>
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={5}
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeImageOptional}
            >
              <div>+ Upload</div>
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
          <div className="d-flex justify-content-end mt-2">
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </div>
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
            key: "barcode",
            title: "Barcode",
            dataIndex: "barcode",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "category_name",
            title: "Category Name",
            dataIndex: "category_name",
          },
          {
            key: "brand",
            title: "Brand",
            dataIndex: "brand",
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
            key: "image",
            title: "Image",
            dataIndex: "image",
            // render: (value) =>
            //   "http://localhost/full_stack/POS_Phone_Shop_Images/" + value,
            render: (value) =>
              value ? (
                <Image
                  src={
                    "http://localhost/full_stack/POS_Phone_Shop_Images/" + value
                  }
                  style={{ width: 40 }}
                />
              ) : (
                <div className="bg-secondary">
                  <Image src={image_placeholder} style={{ width: 40 }} />
                </div>
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
                  onClick={() => handleDelete(data)}
                >
                  <MdDelete className="fs-5" />
                </Button>
                <Button type="primary" onClick={() => handleEdit(data)}>
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

export default ProductPage;
