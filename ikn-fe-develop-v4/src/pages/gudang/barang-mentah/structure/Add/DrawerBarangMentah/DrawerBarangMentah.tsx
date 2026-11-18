import { useState } from 'react';
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
  FormInstance,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Gauge, Package, Stack, TagChevron, Unite } from '@phosphor-icons/react';
import ModalProdukPra from '../ModalBarangMentah/ModalBarangMentah';
import * as globalHelpers from '@/utils/helper';

export default function DrawerBarangMentah({
  openDrawer,
  seOpenDrawer,
  setDataSourceItems,
  formItems,
}: Readonly<{
  openDrawer: boolean;
  seOpenDrawer: Function;
  setDataSourceItems: Function;
  formItems: FormInstance;
}>) {
  const [open, setOpen] = useState(false);
  const onFinishItems = async (values: any) => {
    setDataSourceItems((prev: any) => {
      const index = prev.findIndex(
        (item: any) => item.masterRawMaterialId === values.masterRawMaterialId
      );
      if (index !== -1) {
        const newData = [...prev];
        newData[index] = values;
        return newData;
      } else {
        return [...prev, values];
      }
    });
    formItems.resetFields();
    seOpenDrawer(false);
  };

  const handleRowDoubleClick = (record: any) => {
    formItems.setFieldsValue({
      masterRawMaterialId: record.id,
      itemCode: record.itemCode,
      itemName: record.itemName,
      unit: record.unit.nama,
      Satuan: record.satuan,
      accountCode: record.accountCode,
      accountName: record?.account?.name || '',
    });
    setOpen(false);
    // Bisa set state atau panggil fungsi untuk "select" row ini
  };

  const onClose = () => {
    seOpenDrawer(false);
  };

  return (
    <Drawer
      title="Input Items Barang"
      placement={'right'}
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
        <ModalProdukPra setOpen={setOpen} open={open} handleRowDoubleClick={handleRowDoubleClick} />
      )}
      <Form
        layout="vertical"
        form={formItems}
        name="items"
        initialValues={{ remember: true }}
        onFinish={onFinishItems}
      >
        <Card title="Item Barang" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="accountCode"
                name="accountCode"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: true, message: 'Masukan id!' }]}
              >
                <Input disabled style={{ flex: 1, width: '100%' }} placeholder="accountCode" />
              </Form.Item>

              <Form.Item
                label="accountName"
                name="accountName"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: true, message: 'Masukan id!' }]}
              >
                <Input disabled style={{ flex: 1, width: '100%' }} placeholder="accountName" />
              </Form.Item>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Form.Item
                  label="masterRawMaterialId"
                  name="masterRawMaterialId"
                  style={{ width: '100%', display: 'none' }}
                  rules={[{ required: true, message: 'Masukan id!' }]}
                >
                  <Input disabled style={{ flex: 1, width: '100%' }} placeholder="Masukan id" />
                </Form.Item>
                <Form.Item
                  label="Kode Barang"
                  name="itemCode"
                  style={{ width: '100%' }}
                  rules={[{ required: true, message: 'Masukan nilai Kode Barang!' }]}
                >
                  <Input
                    prefix={<TagChevron />}
                    disabled
                    style={{ flex: 1, width: '100%' }}
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
                name="itemName"
                rules={[{ required: true, message: 'Masuka Keterangan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<Package size={16} />}
                  placeholder="Keterangan"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Jumlah Diterima"
                name="quantity"
                rules={[{ required: true, message: 'Masukan Jumlah Barang!' }]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Jumlah Barang"
                  decimalSeparator=","
                  precision={2}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: 'Masuka unit!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<Unite size={16} />}
                  placeholder="unit"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Harga Total"
                name="hargaTotal"
                rules={[{ required: true, message: 'Masukan Nilai Harga!' }]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Nilai Harga"
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                />
              </Form.Item>

              <Form.Item
                label="satuan"
                name="Satuan"
                rules={[{ required: true, message: 'Masukan satuan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<Gauge size={16} />}
                  placeholder="satuan"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
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
