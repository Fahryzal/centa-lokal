import {
  Calculator,
  Calendar,
  CheckCircle,
  FilePdf,
  Note,
  TagChevron,
  Truck,
  User,
} from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Flex,
  Select,
  DatePicker,
  Input,
  Table,
  Tooltip,
  InputNumber,
} from 'antd';
import { useState } from 'react';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerOrderPra from './DrawerInvoiceRN/DrawerInvoiceRN';
import { DollarCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ModalDeliveryPoPra from './ModalInvoiceRN/ModalInvoiceRN';
import dayjs from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  kodeBarangProduct: string;
  namabarangProduct: string;
  priceProduct: number;
  satuanProduct: string;
  spesifikasiProduct: string;
  stockProduct: number;
  unitProduct: string;
}

export default function InvoiceAddRN() {
  const [form] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
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
  const [dataSourcePajak, setDataSourcePajak] = useState<any>([]);
  const [open, setOpen] = useState(false);

  globalHooks.useFetchOptions(unit, setUnit, InvoiceAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, InvoiceAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  const columnsPajak: TableColumnsType<DataType> = [
    {
      title: 'Tipe Pajak',
      dataIndex: 'taxType',
      key: 'taxType',
      align: 'center',
    },
    {
      title: 'Nilai Pajak',
      dataIndex: 'taxValue',
      key: 'taxValue',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.taxValue)}</span>;
      },
    },
    {
      title: 'Jumlah Pajak',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.taxAmount)}</span>;
      },
    },
  ];

  const columns: TableColumnsType<DataType> = [
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
      render: (_: any, record: any) => {
        return <span>Rp{globalHelpers.currencyFormatter(record.priceProduct)}</span>;
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
      title: 'Stok',
      dataIndex: 'stockProduct',
      key: 'stockProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.stockProduct)}</span>;
      },
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
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.quantity)}</span>;
      },
    },
  ];

  const handleRowDoubleClick = (record: any) => {
    console.log(record);
    let totalPPh22 = 0;
    let totalPPh23 = 0;
    console.log(' record?.PurchaseOrderTax', record?.PurchaseOrderTax);
    record?.PurchaseOrderTax?.forEach((tax: any) => {
      if (tax.taxType === 'PPh 22') {
        totalPPh22 = tax.taxAmount;
      }

      if (tax.taxType === 'PPh 23') {
        totalPPh23 = tax.taxAmount;
      }
    });

    console.log('totalPPh23', totalPPh23);
    form.setFieldsValue({
      orderNumber: record.orderNumber,
      customerName: record.customerName,
      date: dayjs(record.date),
      description: record.description,
      franco: record.franco,
      status: record.status,
      totalAmount: record.totalAmount,
      totalAmountReal: record.totalAmount - totalPPh22 - totalPPh23,
      subtotalAmount: record.subtotalAmount,
      purchaseOrderId: record.id,
    });
    setDataSourceItems(record.items || []);
    setDataSourcePajak(record.PurchaseOrderTax || []);
    setOpen((open) => !open);
  };
  return (
    <Card
      title={<TitleCardAdd title="Buat Invoice" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
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
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item
                label="totalAmountReal"
                style={{ flex: 1, width: '100%', display: 'none' }}
                name="totalAmountReal"
                rules={[{ required: true, message: 'Masukan nilai totalAmountReal!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Nilai totalAmountReal"
                />
              </Form.Item>

              <Form.Item
                label="purchaseOrderId"
                style={{ flex: 1, width: '100%', display: 'none' }}
                name="purchaseOrderId"
                rules={[{ required: true, message: 'Masukan nilai purchaseOrderId!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Nilai purchaseOrderId"
                />
              </Form.Item>

              <Form.Item
                label="Nomor Pesanan"
                style={{ flex: 1, width: '100%' }}
                name="orderNumber"
                rules={[{ required: true, message: 'Masukan nilai nomo pesanan!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Pesanan"
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
              label="Pelanggan"
              name="customerName"
              rules={[{ required: true, message: 'Masukan unit!' }]}
            >
              <Select
                prefix={<User />}
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
              label="Tanggal Pesanan"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Pesanan!' }]}
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
                disabled
                style={{ width: '100%' }}
                placeholder="Tanggal Pesanan"
                format={'YYYY-MM-DD'}
              />
            </Form.Item>

            <Form.Item
              label="Harga Sebelum Pajak"
              name="subtotalAmount"
              rules={[{ required: true, message: 'Masuka Total Amount!' }]}
            >
              <InputNumber
                disabled
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{ width: '100%' }}
                prefix={<DollarCircleOutlined size={16} />}
                placeholder="Total Amount"
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Invoice"
              name="invoiceDate"
              rules={[{ required: true, message: 'Masukan tanggal invoice!' }]}
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
                prefix={<Calculator />}
                style={{ width: '100%' }}
                placeholder="Tanggal invoice"
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Nomor Invoice"
              style={{ flex: 1, width: '100%' }}
              name="invoiceNumber"
              rules={[{ required: true, message: 'Masukan nilai Nomor Invoice!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nilai Invoice Number"
              />
            </Form.Item>

            <Form.Item
              label="Keterangan"
              name="description"
              rules={[{ required: true, message: 'Masuka Keterangan!' }]}
            >
              <Input
                disabled
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
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<Truck size={16} />}
                placeholder="Franco"
              />
            </Form.Item>

            <Form.Item
              label="Total Tagihan"
              name="totalAmount"
              rules={[{ required: true, message: 'Masuka Total Amount!' }]}
            >
              <InputNumber
                disabled
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{ width: '100%' }}
                prefix={<DollarCircleOutlined size={16} />}
                placeholder="Total Amount"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Masuka Status!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<CheckCircle size={16} />}
                placeholder="status"
              />
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

        <Card
          title={<TitleCardItemsList title="Daftar Pajak" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<DataType>
            columns={columnsPajak}
            dataSource={dataSourcePajak}
            scroll={{ x: 'max-content' }}
          />{' '}
          <p
            style={{
              color: 'green',
            }}
          >
            {' '}
            🧾 Catatan: PPh22 atau PPH23 jika ada, akan dipotong dan disetorkan langsung oleh
            pembeli. Anda akan menerima{' '}
            <b>Rp. {globalHelpers.currencyFormatter(form.getFieldValue('totalAmountReal') || 0)}</b>
            .
          </p>
        </Card>

        <Flex gap="small">
          <Buttonback />
          <ButtonAdd />
        </Flex>
      </Form>
    </Card>
  );
}
