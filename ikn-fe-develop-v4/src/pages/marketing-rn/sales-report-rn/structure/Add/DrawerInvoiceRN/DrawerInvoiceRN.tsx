import  { useState } from "react";
import {
  Button,
  Drawer,
  Space,
  Form,
  Card,
  Row,
  Col,
  Tooltip,
  Input,
  InputNumber,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilePdf } from "@phosphor-icons/react";
import ModalProdukPra from "../ModalInvoiceRN/ModalInvoiceRN";
export default function DrawerInvoiceRN({openDrawer, seOpenDrawer, setDataSourceItems}: Readonly<{openDrawer: boolean, seOpenDrawer: Function, setDataSourceItems: Function}>) {
  const [open, setOpen] = useState(false);
  const [formItems] = Form.useForm();
  const onFinishItems = async (values: any) => {
    console.log(values);
    setDataSourceItems((prev:any) => ([...prev, values]))
    formItems.resetFields();
    seOpenDrawer(false)
  };


    const handleRowDoubleClick = (record: any) => {
      console.log("Double clicked row:", record);
      formItems.setFieldsValue({
        productId: record.id,
        kodeBarang: record.kodeBarang,
        namaBarang: record.namaBarang,
        spesifikasi: record.spesifikasi,
        unitPrice: record.price,
        stock: record.stock,
        kategori: record.kategori.nama,
        satuan: record.satuan.keterangan,
        unit: record.unit.nama,
      });
      setOpen(false);
      // Bisa set state atau panggil fungsi untuk "select" row ini
    };

  const onClose = () => {
    seOpenDrawer(false);
  };

  return (
    <Drawer
      title="Input Invoice"
      placement={"right"}
      width={500}
      onClose={onClose}
      open={openDrawer}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
    >
     {open && (
        <ModalProdukPra
          setOpen={setOpen}
          open={open}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      )}
      <Form
        layout="vertical"
        form={formItems}
        name="items"
        initialValues={{ remember: true }}
        onFinish={onFinishItems}
      >
        <Card
          title="Item Orders"
          style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Form.Item
                  label="productId"
                  name="productId"
                  style={{ width: "100%", display:'none' }}
                  rules={[
                    { required: true, message: "Masukan productId!" },
                  ]}
                >
                  <Input
                    disabled
                    style={{ flex: 1, width: "100%" }}
                    placeholder="Masukan Kode Barang"
                  />
                </Form.Item>
                <Form.Item
                  label="Kode Barang"
                  name="kodeBarang"
                  style={{ width: "100%" }}
                  rules={[
                    { required: true, message: "Masukan nilai Kode Barang!" },
                  ]}
                >
                  <Input
                    disabled
                    style={{ flex: 1, width: "100%" }}
                    placeholder="Masukan Kode Barang"
                  />
                </Form.Item>

                <Tooltip title="search">
                  <Button
                    type="primary"
                    onClick={() => setOpen(true)}
                    shape="circle"
                    icon={<SearchOutlined />}
                  />
                </Tooltip>
              </div>

              <Form.Item
                label="Nama Barang"
                name="namaBarang"
                rules={[{ required: true, message: "Masuka Keterangan!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Keterangan"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Spesifikasi"
                name="spesifikasi"
                rules={[{ required: true, message: "Masuka spesifikasi!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Spesifikasi"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="satuan"
                name="satuan"
                rules={[{ required: true, message: "Masukan satuan!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="satuan"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Jumlah Barang"
                name="quantity"
                rules={[{ required: true, message: "Masuka Jumlah Barang!" }]}
              >
                <InputNumber
                controls={false}
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Jumlah Barang"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Kategori"
                name="kategori"
                rules={[{ required: true, message: "Masukan kategori!" }]}
              >
                <Input disabled placeholder="Kategori" />
              </Form.Item>

              <Form.Item
                label="Harga"
                name="unitPrice"
                rules={[{ required: true, message: "Masuka harga!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Harga"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Stock"
                name="stock"
                rules={[{ required: true, message: "Masuka stock!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="stock"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: "Masuka unit!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  prefix={<FilePdf size={16} />}
                  placeholder="unit"
                  disabled
                />
              </Form.Item>

             
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: 150 }}>
               Simpan
              </Button>
            </Form.Item>
          </div>
        </Card>
      </Form>
    </Drawer>
  );
}
