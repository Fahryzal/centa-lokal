import { useEffect, useState } from 'react';
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
import { Gauge, Money, Package, Stack, TagChevron, Unite } from '@phosphor-icons/react';
import ModalProdukPra from '../ModalBarangMentahIssue/ModalBarangMentahIssue';
import * as globalHelpers from '@/utils/helper';
import * as BarangMentahIssueAxios from '@pages/gudang/barang-mentah-issue/service/BarangMentahIssueAxios';
import { showNotification } from '@/contexts/services/notificationService';

export default function DrawerBarangMentahIssue({
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
      // Jika detail barang sudah memiliki ID, update berdasarkan ID tersebut
      if (values.id) {
        return prev.map((item: any) => (item.id === values.id ? { ...item, ...values } : item));
      }

      // Jika barang belum memiliki ID, cek berdasarkan masterRawMaterialId
      const index = prev.findIndex(
        (item: any) => item.masterRawMaterialId === values.masterRawMaterialId
      );

      if (index !== -1) {
        const newData = [...prev];
        newData[index] = {
          ...newData[index],
          ...values,
        };
        return newData;
      }

      // Jika barang benar-benar baru, tambahkan ke tabel
      return [...prev, values];
    });

    formItems.resetFields();
    seOpenDrawer(false);
  };

  const quantity = Form.useWatch('quantity', formItems);
  const nilaiSatuan = Form.useWatch('nilaiSatuan', formItems);

  // Hitung ulang harga saat quantity atau nilaiSatuan berubah
  useEffect(() => {
    if (quantity != null && nilaiSatuan != null) {
      formItems.setFieldsValue({
        harga: Number(quantity) * Number(nilaiSatuan),
      });
    }
  }, [quantity, nilaiSatuan, formItems]);

  const handleRowDoubleClick = async (record: any) => {
    const data = await BarangMentahIssueAxios.fetchfindOneStockSummaryById(record.id);
    if (!data) {
      return showNotification('warning', 'Peringatan', 'Stok Tidak Ada');
    }
    formItems.setFieldsValue({
      masterRawMaterialId: record.id,
      itemCode: record.itemCode,
      itemName: record.itemName,
      unit: record.unit.nama,
      Satuan: record.satuan,
      nilaiSatuan: data?.averageCost || 0,
      accountCode: record.accountCode,
      accountName: record?.account?.name || '',
      stok: data?.stock || 0,
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
                rules={[{ required: true, message: 'Masukan accountCode!' }]}
              >
                <Input
                  disabled
                  style={{ flex: 1, width: '100%' }}
                  placeholder="Masukan accountCode"
                />
              </Form.Item>

              <Form.Item
                label="accountName"
                name="accountName"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: true, message: 'Masukan accountName!' }]}
              >
                <Input
                  disabled
                  style={{ flex: 1, width: '100%' }}
                  placeholder="Masukan accountName"
                />
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
                <Form.Item name="id" hidden>
                  <Input />
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
                label="Jumlah Barang"
                name="quantity"
                rules={[
                  { required: true, message: 'Masukan Jumlah Barang!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        value === undefined ||
                        value === null ||
                        value === '' ||
                        Number(value) <= Number(getFieldValue('stok'))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Jumlah Barang tidak boleh lebih dari Stok!');
                    },
                  }),
                ]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Jumlah Barang"
                  stringMode
                  decimalSeparator=","
                  formatter={(value) => value?.toString().replace('.', ',') ?? ''}
                  parser={(value) => (value?.replace(',', '.') ?? '') as any}
                />
              </Form.Item>

              <Form.Item
                label="Harga Dikeluarkan"
                name="harga"
                rules={[{ required: true, message: 'Masukan Harga!' }]}
              >
                <InputNumber
                  disabled
                  controls={false}
                  style={{ width: '100%' }}
                  prefix={<Money size={16} />}
                  placeholder="Harga"
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
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
                label="Harga Satuan"
                name="nilaiSatuan"
                rules={[{ required: true, message: 'Masukan Nilai Satuan!' }]}
              >
                <InputNumber
                  disabled
                  controls={false}
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Nilai Satuan"
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

              <Form.Item
                label="Stok"
                name="stok"
                rules={[{ required: true, message: 'Masukan stok!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix={<Gauge size={16} />}
                  placeholder="stok"
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
