import { CheckCircle, FilePdf, Note, TagChevron, Truck } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Table,
  Tooltip,
  InputNumber,
} from 'antd';
import { useState } from 'react';
import * as DeliveryOrderRNAxios from '@pages/marketing-rn/delivery-order-rn/service/DeliveryOrderRNAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import * as DeliveryOrderRNInterfaces from '@pages/marketing-rn/delivery-order-rn/interface/DeliveryOrderRNInterfaces';

import type { TableColumnsType } from 'antd';
import DrawerOrderPra from './DrawerDeliveryOrderEksporRN/DrawerDeliveryOrderEksporRN';
import { DollarCircleFilled, SearchOutlined } from '@ant-design/icons';
import ModalDeliveryPoPra from './ModalDeliveryOrderEksporRN/ModalDeliveryPoEksporRN';
import dayjs from 'dayjs';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { showNotification } from '@/contexts/services/notificationService';
import TextTerbilangDollar from '@/components/atoms/Text/TextTerbilangDollar';
import AdditionalChargesForm from '../Components/AdditionalChargesForm';

export default function DeliveryOrderEksporRNAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

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
  const [open, setOpen] = useState(false);

  const onFinish = async (values: DeliveryOrderRNInterfaces.PayloadDORN) => {
    try {
      setLoading(true);
      await DeliveryOrderRNAxios.posDeliveryOrderRN({
        purchaseOrderId: values.purchaseOrderId,
        typeSalesDelivery: 'RN_EKSPOR',
      });
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/delivery-order-prn-ekspor');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, DeliveryOrderRNAxios.fetchDataUnit, [unit.nama]);
  globalHooks.useFetchOptions(customer, setCustomer, DeliveryOrderRNAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  const columns: TableColumnsType<DeliveryOrderRNInterfaces.DatumType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarangProduct',
      key: 'kodeBarangProduct',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namabarangProduct',
      key: 'namabarangProduct',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'priceProduct',
      key: 'priceProduct',
      align: 'center',
      render: (priceProduct: number) => {
        return <span>${globalHelpers.currencyFormatter(priceProduct || 0)}</span>;
      },
    },
    {
      title: 'Satuan',
      dataIndex: 'satuanProduct',
      key: 'satuanProduct',
      align: 'center',
    },
    {
      title: 'Spesifikasi',
      dataIndex: 'spesifikasiProduct',
      key: 'spesifikasiProduct',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unitProduct',
      key: 'unitProduct',
      align: 'center',
    },
    {
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
  ];

  const handleRowDoubleClick = (record: DeliveryOrderRNInterfaces.DatumType) => {
    form.setFieldsValue({
      orderNumber: record.orderNumber,
      customerId: record.customerId,
      date: dayjs(record.date),
      description: record.description,
      franco: record.franco,
      customerName: record.customerName,
      status: record.status,
      totalAmount: record.subtotalAmount,
      purchaseOrderId: record.id,
    });
    formAdd.setFieldValue('additionalCharges', record?.additionalCharges);
    setDataSourceItems(record.items);
    setOpen((open) => !open);
  };
  return (
    <Card
      title={<TitleCardAdd title="Tambah Pengiriman Pesanan (RN Ekspor)" />}
      style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerOrderPra
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <ModalDeliveryPoPra
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />

      <Form
        layout="vertical"
        form={form}
        name="delivery-order-form"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item
                label="purchaseOrderId"
                name="purchaseOrderId"
                style={{ display: 'none' }}
                rules={[{ required: true, message: 'Masukkan nilai purchaseOrderId!' }]}
              >
                <Input disabled prefix={<FilePdf size={16} />} placeholder="purchaseOrderId" />
              </Form.Item>

              <Form.Item
                label="Nomor Pesanan"
                name="orderNumber"
                style={{ flex: 1 }}
                rules={[{ required: true, message: 'Masukkan nomor pesanan!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nomor Pesanan" />
              </Form.Item>

              <Tooltip title="Cari Nomor Pesanan">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  shape="circle"
                  onClick={() => setOpen(true)}
                />
              </Tooltip>
            </div>

            <Form.Item
              label="Pelanggan"
              name="customerName"
              rules={[{ required: true, message: 'Masukkan nama customer!' }]}
            >
              <Select
                showSearch
                disabled
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
              rules={[{ required: true, message: 'Masukkan tanggal order!' }]}
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
                disabled
                style={{ width: '100%' }}
                placeholder="Tanggal Order"
              />
            </Form.Item>

            <Form.Item
              label="Total Harga"
              name="totalAmount"
              rules={[{ required: true, message: 'Masukkan total harga!' }]}
              extra={<TextTerbilangDollar properti="totalAmount" form={form} />}
            >
              <InputNumber
                disabled
                controls={false}
                style={{ width: '100%' }}
                placeholder="Total Harga"
                prefix={<DollarCircleFilled />}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Keterangan"
              name="description"
              rules={[{ required: true, message: 'Masukkan keterangan!' }]}
            >
              <Input disabled prefix={<Note size={16} />} placeholder="Keterangan" />
            </Form.Item>

            <Form.Item
              label="Franco"
              name="franco"
              rules={[{ required: true, message: 'Masukkan Franco!' }]}
            >
              <Input disabled prefix={<Truck size={16} />} placeholder="Franco" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Masukkan status!' }]}
            >
              <Input disabled prefix={<CheckCircle size={16} />} placeholder="Status" />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{ marginTop: 24, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<DeliveryOrderRNInterfaces.DatumType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>

        <AdditionalChargesForm form={formAdd} totalBarang={form.getFieldValue('totalAmount')} />

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </div>
      </Form>
    </Card>
  );
}
