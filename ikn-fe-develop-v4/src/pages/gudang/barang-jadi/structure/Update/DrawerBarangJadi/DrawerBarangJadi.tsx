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
  Select,
  FormInstance,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Folders, Gauge, Package, Stack, TagChevron, Unite } from '@phosphor-icons/react';
import ModalProdukPra from '../ModalBarangJadi/ModalBarangJadi';
const { TextArea } = Input;
import { useDebounce, useFetchOptions } from '@/hooks';
import * as UnitAxios from '@/pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';

export default function DrawerBarangJadi({
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
    setDataSourceItems((prev: BarangJadiInterfaces.BarangJadiType[]) => {
      const index = prev.findIndex(
        (item: BarangJadiInterfaces.BarangJadiType) => item.finishedGoodId === values.finishedGoodId
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
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const nilaiSatuan = Form.useWatch('nilaiSatuan', formItems);
  const quantity = Form.useWatch('quantity', formItems);

  useEffect(() => {
    formItems.setFieldValue('totalBerat', nilaiSatuan * quantity);
  }, [nilaiSatuan, quantity]);

  const handleRowDoubleClick = (record: any) => {
    formItems.setFieldsValue({
      finishedGoodId: record.id,
      kodeBarang: record.kodeBarang,
      namaBarang: record.namaBarang,
      kategori: record.kategori,
      satuan: record.satuan,
      nilaiSatuan: record.nilaiSatuan,
    });
    setOpen(false);
    // Bisa set state atau panggil fungsi untuk "select" row ini
  };

  const onClose = () => {
    seOpenDrawer(false);
  };

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Form.Item
                  label="productId"
                  name="finishedGoodId"
                  style={{ width: '100%', display: 'none' }}
                  rules={[{ required: true, message: 'Masukan id!' }]}
                >
                  <Input disabled style={{ flex: 1, width: '100%' }} placeholder="Masukan id" />
                </Form.Item>
                <Form.Item
                  label="Kode Barang"
                  name="kodeBarang"
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
                name="namaBarang"
                rules={[{ required: true, message: 'Masuka Nama Barang!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<Package size={16} />}
                  placeholder="Nama Barang"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Nilai Satuan"
                name="nilaiSatuan"
                rules={[{ required: true, message: 'Masukan Jumlah Satuan!' }]}
              >
                <InputNumber
                  formatter={helperGlobal.formatter}
                  parser={helperGlobal.parser}
                  controls={false}
                  disabled
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Jumlah Satuan"
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
                  formatter={helperGlobal.formatter}
                  parser={helperGlobal.parser}
                />
              </Form.Item>

              <Form.Item
                label="Spesifikasi"
                name="spesifikasi"
                rules={[{ required: true, message: 'Masukan spesifikasi!' }]}
              >
                <TextArea style={{ width: '100%' }} placeholder="spesifikasi" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Kategori"
                name="kategori"
                rules={[{ required: true, message: 'Masukan kategori!' }]}
              >
                <Input prefix={<Folders />} disabled placeholder="Kategori" />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: 'Masukan unit barang jadi' }]}
              >
                <Select
                  prefix={<Unite />}
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih unit"
                  optionFilterProp="label"
                  onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                  onSearch={onSearchUnit}
                  options={helperGlobal.toAntdOptions(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>
              <Form.Item
                label="satuan"
                name="satuan"
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
                label="Total Berat"
                name="totalBerat"
                rules={[{ required: true, message: 'Masukan total!' }]}
              >
                <InputNumber
                  formatter={helperGlobal.formatter}
                  parser={helperGlobal.parser}
                  controls={false}
                  disabled
                  style={{ width: '100%' }}
                  prefix={<Stack size={16} />}
                  placeholder="Total"
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
