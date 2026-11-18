import {
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
import { useEffect, useState } from 'react';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import { DollarCircleOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { generateInvoicePDF } from '@/utils/generatePdf/generateInvoicePDF';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';
import { showNotification } from '@/contexts/services/notificationService';
import {
  Data as DataDetail,
  InvoiceTax,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';

export default function SalesReportEksporRNDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataInvoice, setDataInvoice] = useState<DataDetail | null>(null);
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
  globalHooks.useFetchOptions(unit, setUnit, InvoiceAxios.fetchDataUnit, [unit.nama]);
  globalHooks.useFetchOptions(customer, setCustomer, InvoiceAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  useEffect(() => {
    fetchDataInvoiceById();
  }, []);

  const fetchDataInvoiceById = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = (await InvoiceAxios.fetchDataInvoiceById(id)) as any;
        setDataInvoice(data || null);
        form.setFieldsValue({
          orderNumber: data?.purchaseOrder.orderNumber,
          customerName: data?.purchaseOrder.customerName,
          date: dayjs(data?.purchaseOrder?.date),
          description: data?.purchaseOrder?.description,
          franco: data?.purchaseOrder?.franco,
          status: data?.purchaseOrder?.status,
          totalAmount: data?.purchaseOrder?.totalAmount,
          purchaseOrderId: data?.purchaseOrder?.id,
          invoiceNumber: data?.invoiceNumber,
          invoiceDate: dayjs(data?.invoiceDate),
          subtotalAmount: data?.purchaseOrder?.subtotalAmount,
        });
        setDataSourceItems(data?.purchaseOrder?.items || []);
        setDataSourcePajak(data?.invoiceTaxes || []);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const columnsPajak: TableColumnsType<InvoiceTax> = [
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

  const columns: TableColumnsType<DataDetail> = [
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
  const onDownloadInvoice = () => {
    if (dataInvoice) {
      generateInvoicePDF(dataInvoice as any);
    }
  };
  return (
    <Card
      title={<TitleCardDetail title="Detail Invoice" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={<ButtonFile onClick={onDownloadInvoice} />}
    >
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
                rules={[{ required: true, message: 'Masukan nilai nomor pesanan!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor pesanan"
                />
              </Form.Item>

              <Tooltip title="search">
                <Button disabled type="primary" shape="circle" icon={<SearchOutlined />} />
              </Tooltip>
            </div>

            <Form.Item
              label="Pelanggan"
              name="customerName"
              rules={[{ required: true, message: 'Masukan kustomer!' }]}
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
              extra={TextTerbilang({ form: form, properti: 'subtotalAmount' })}
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
                prefix={<Calendar />}
                disabled
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
                placeholder="Nilai Nomor Invoice"
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
              label="Harga Setelah Pajak"
              name="totalAmount"
              rules={[{ required: true, message: 'Masuka Total Amount!' }]}
              extra={TextTerbilang({ form: form, properti: 'totalAmount' })}
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
          <Table<DataDetail>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>

        <Card
          title={<TitleCardItemsList title="Daftar Pajak" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<InvoiceTax>
            columns={columnsPajak}
            dataSource={dataSourcePajak}
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
