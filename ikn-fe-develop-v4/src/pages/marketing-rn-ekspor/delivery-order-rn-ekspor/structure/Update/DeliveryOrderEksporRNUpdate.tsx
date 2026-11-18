import { Calendar, Note, TagChevron, Truck, User } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, Select, DatePicker, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerOrderPra from './DrawerDeliveryOrderEksporRN/DrawerDeliveryOrderEksporRN';
import dayjs from 'dayjs';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default function DeliveryOrderEkpsorRNUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
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
        showNotification('success', 'Berhasil', 'Berhasil Ubah Data');
        setTimeout(() => {
          navigate('/po-order-prn-ekspor');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Ubah Data');
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
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
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
  return (
    <Card
      title={<TitleCardEdit title="Edit Pengiriman Pesanan (RN Ekspor)" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerOrderPra
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />
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
              label="Nomor Pesanan"
              name="orderNumber"
              rules={[{ required: true, message: 'Masukan nilai nomor pesanan!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nomor Pesanan"
              />
            </Form.Item>

            <Form.Item
              label="Pelanggan"
              name="customerId"
              rules={[{ required: true, message: 'Masukan unit!' }]}
            >
              <Select
                prefix={<User />}
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
              label="Tanggal Pesanan"
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
                prefix={<Calendar />}
                style={{ width: '100%' }}
                placeholder="Tanggal Order"
                format={'YYYY-MM-DD'}
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
                prefix={<Note size={16} />}
                placeholder="Keterangan"
              />
            </Form.Item>

            <Form.Item
              label="Franco"
              name="franco"
              rules={[{ required: true, message: 'Masuka Franco!' }]}
            >
              <Input style={{ width: '100%' }} prefix={<Truck size={16} />} placeholder="Franco" />
            </Form.Item>
          </Col>
        </Row>
        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<DataType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
