import { ArrowLeft, FilePdf, Plus } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  message,
  Flex,
  Select,
  DatePicker,
  Input,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerOrderPra from './DrawerInvoiceRN/DrawerInvoiceRN';
import dayjs from 'dayjs';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default function SalesReportRNUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<any>([]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      type Product = {
        productId: string;
        quantity: number;
        unitPrice: number;
        price: number;
      };

      function hitungTotalHarga(products: Product[]): number {
        return products.reduce((total, product) => {
          return total + product.quantity * (product.unitPrice || product.price);
        }, 0);
      }
      const picked = dataSourceItems
        .filter((item: any) => item.productId)
        .map(({ productId, quantity, unitPrice }: any) => ({
          productId,
          quantity,
          unitPrice,
        }));
      values = {
        ...values,
        description: '-',
        subtotalAmount: hitungTotalHarga(dataSourceItems),
        items: picked,
      };
      if (id) {
        await OrderPraAxios.updateOrderPra(id, values);
        messageApi.info('Berhasil Ubah Data');
        setTimeout(() => {
          navigate('/po-order-pra');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      messageApi.error('Gagal Ubah Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, OrderPraAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, OrderPraAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  useEffect(() => {
    getDataCode();
    getDataSalesOrderPradId();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await OrderPraAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const getDataSalesOrderPradId = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = await OrderPraAxios.fetchDataOrderPraById(id);
        console.log('data', data);
        const dataNew = data?.items?.map((item: any) => ({
          ...item.Product,
          unit: item?.Product?.unit?.nama,
          satuan: item?.Product?.satuan?.keterangan,
          quantity: item.quantity,
        }));
        setDataSourceItems(dataNew);
        form.setFieldsValue({
          orderNumber: data.orderNumber,
          customerId: data.customerId,
          date: dayjs(data.date, 'YYYY-MM-DD'),
          description: data.description,
          franco: data.franco,
        });
      }
      setLoading(false);
    } catch (e) {
      messageApi.error('Terjadi Kesalahan!');
      setLoading(false);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      key: 'kodeBarang',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      key: 'namaBarang',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      key: 'satuan',
      align: 'center',
    },
    {
      title: 'Spesifikasi',
      dataIndex: 'spesifikasi',
      key: 'spesifikasi',
      align: 'center',
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
    },
    {
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
  ];
  console.log('dataSourceItems', dataSourceItems);

  return (
    <Card title="Tambah Delivery Order RA" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <DrawerOrderPra
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Orde rNumber"
              name="orderNumber"
              rules={[{ required: true, message: 'Masukan nilai Order Number!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<FilePdf size={16} />}
                placeholder="Nilai Order Number"
              />
            </Form.Item>

            <Form.Item
              label="Pelanggan"
              name="customerId"
              rules={[{ required: true, message: 'Masukan unit!' }]}
            >
              <Select
                showSearch
                loading={unit.loading}
                placeholder="Pilih customer"
                optionFilterProp="label"
                onChange={() => setCustomer((prev) => ({ ...prev, name: '' }))}
                onSearch={onSearcCustomer}
                options={globalHelpers.toAntdOptions(customer.data || [], 'id', 'name')}
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Order"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Order!' }]}
              getValueFromEvent={(date) => {
                // simpan ke form dalam format string tanpa timezone
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => {
                // ubah dari string ke dayjs agar tampil di DatePicker
                return {
                  value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
                };
              }}
            >
              <DatePicker
                format={'YYYY-MM-DD'}
                style={{ width: '100%' }}
                placeholder="Tanggal Order"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Keterangan"
              name="description"
              rules={[{ required: true, message: 'Masuka Keterangan!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<FilePdf size={16} />}
                placeholder="Keterangan"
              />
            </Form.Item>

            <Form.Item
              label="Franco"
              name="franco"
              rules={[{ required: true, message: 'Masuka Franco!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<FilePdf size={16} />}
                placeholder="Franco"
              />
            </Form.Item>
          </Col>
        </Row>
        <Card title="Item Orders" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}
          >
            <Button
              type="primary"
              htmlType="button"
              onClick={() => seOpenDrawer(true)}
              style={{ width: 150 }}
            >
              Add Items
            </Button>
          </div>
          <Table<DataType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>

        <Flex gap="small">
          <Button
            loading={loading}
            onClick={() => navigate(-1)}
            color="green"
            htmlType="button"
            icon={<ArrowLeft />}
            style={{ width: '150px' }}
          >
            Back
          </Button>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              icon={<Plus />}
              style={{ width: '150px' }}
            >
              Edit Order Pra
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Card>
  );
}
