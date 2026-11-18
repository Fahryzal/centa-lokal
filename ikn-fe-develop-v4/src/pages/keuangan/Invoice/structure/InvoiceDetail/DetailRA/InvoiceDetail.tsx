import { TagChevron, Calendar } from '@phosphor-icons/react';
import { Form, Row, Col, Flex, Tooltip, Divider, Descriptions, DatePicker } from 'antd';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { generateInvoicePDF } from '@/utils/generatePdf/generateInvoicePDF';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import ModalNumberAccount from './ModalNumberAccount/ModalNumberAccount';
import { useState } from '@/hooks/React/useState';
import { useEffect } from '@/hooks/React/useEffect';
import { Button, Card, Input, Table } from '@/components/ui';
import {
  Item as ItemsPo,
  Data as DataDetail,
  InvoiceTax,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';
import { handleMessageError } from '@/utils/func/func';

type InvoiceDetailData = DataDetail & {
  spb?: any;
  InvoiceDetail?: Array<{
    id?: string | null;
    spbId?: string | null;
    itemsSpbId?: string | null;
    quantity?: number | null;
    unitPrice?: number | null;
    total?: number | null;
    SPB?: any;
    itemsSPB?: any;
  }>;
};

export default function InvoiceDetailRAFinance() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formInv] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataInvoice, setDataInvoice] = useState<InvoiceDetailData | null>(null);
  const [dataSourceItems, setDataSourceItems] = useState<ItemsPo[]>([]);
  const [dataSourcePajak, setDataSourcePajak] = useState<InvoiceTax[] | []>([]);

  useEffect(() => {
    fetchDataInvoiceById();
  }, []);

  const fetchDataInvoiceById = async () => {
    try {
      setLoading(true);

      if (id) {
        const data = (await InvoiceAxios.fetchDataInvoiceById(id)) as InvoiceDetailData;

        setDataInvoice(data || null);

        // Mendukung data Invoice RA lama dan baru
        const spb = data?.spb ?? data?.InvoiceDetail?.[0]?.SPB ?? null;

        const purchaseOrder = spb?.purchaseOrder ?? null;
        const customer = purchaseOrder?.customer ?? null;

        form.setFieldsValue({
          orderNumber: purchaseOrder?.orderNumber ?? '-',
          customerName: purchaseOrder?.customerName ?? '-',
          date: purchaseOrder?.date ? dayjs(purchaseOrder.date) : null,
          description: purchaseOrder?.description ?? '-',
          franco: purchaseOrder?.franco ?? '-',
          status: purchaseOrder?.status ?? '-',
          totalAmount: data?.amountWithTax ?? 0,
          purchaseOrderId: purchaseOrder?.id ?? null,
          invoiceNumber: data?.invoiceNumber ?? '',
          invoiceDate: data?.invoiceDate ? dayjs(data.invoiceDate) : null,
          subtotalAmount: purchaseOrder?.subtotalAmount ?? 0,
          address: customer?.address ?? '-',
        });

        // Mengambil seluruh item Purchase Order seperti mekanisme lama
        setDataSourceItems(purchaseOrder?.items ?? []);

        setDataSourcePajak(data?.invoiceTaxes ?? []);
      }
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    } finally {
      setLoading(false);
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
      render: (_: number, record: InvoiceTax) => {
        return <span>{globalHelpers.currencyFormatter(record.taxAmount)}</span>;
      },
    },
  ];

  const columns: TableColumnsType<ItemsPo> = [
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
      render: (_: number, record: ItemsPo) => {
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
      render: (_: number, record: ItemsPo) => {
        return <span>{globalHelpers.currencyFormatter(record.quantity)}</span>;
      },
    },
  ];
  const onDownloadInvoice = () => {
    if (dataInvoice) {
      const dataTTD: InvoiceInterfaces.DataTTDType = formInv.getFieldsValue();
      generateInvoicePDF({ ...dataInvoice, dataTTD } as any);
    }
  };

  const handleRowDoubleClick = (record: MasterAkunBankInterfaces.DataBankAccountType) => {
    formInv.setFieldsValue({
      bankAccountNumber: record.bankAccountNumber,
      bankName: record.bankName,
    });
    setOpen(false);
  };
  const watchInvoiceDateManual = Form.useWatch('invoiceDateManual', formInv);

  return (
    <Card
      title={<TitleCardDetail title="Detail Invoice rs" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={<ButtonFile onClick={onDownloadInvoice} />}
    >
      <ModalNumberAccount
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />
      <Card
        title={<TitleCardItems title="Detail Invoice" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          layout="vertical"
          form={formInv}
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
                  label="Pilih Bank"
                  style={{ flex: 1, width: '100%' }}
                  name="bankName"
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
                  <Button
                    shape="circle"
                    type="primary"
                    onClick={() => setOpen(true)}
                    icon={<SearchOutlined />}
                  />
                </Tooltip>
              </div>

              <Form.Item
                label="No. Rekening"
                style={{ flex: 1, width: '100%' }}
                name="bankAccountNumber"
                rules={[{ required: true, message: 'Masukan Rekening!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Rekening"
                />
              </Form.Item>

              <Form.Item
                label="Tanggal Invoice"
                style={{ flex: 1, width: '100%' }}
                name="invoiceDateManual"
                rules={[{ required: true, message: 'Masukan Tanggal Invoice!' }]}
              >
                <DatePicker
                  prefix={<Calendar />}
                  style={{ width: '100%' }}
                  placeholder="Tanggal Invoice"
                  format={'YYYY-MM-DD'}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Nama TTD"
                style={{ flex: 1, width: '100%' }}
                name="ttdName"
                rules={[{ required: true, message: 'Masukan Nama TTD!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nama TTD"
                />
              </Form.Item>

              <Form.Item
                label="Jabatan"
                style={{ flex: 1, width: '100%' }}
                name="jabatan"
                rules={[{ required: true, message: 'Masukan Jabatan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Jabatan"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Divider />
      <Card
        title={<TitleCardItems title="Detail Invoice" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Pesanan">
            {form.getFieldValue('orderNumber')}
          </Descriptions.Item>
          <Descriptions.Item label="Keterangan">
            {form.getFieldValue('description')}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {form.getFieldValue('customerName')}
          </Descriptions.Item>
          <Descriptions.Item label="Franco">{form.getFieldValue('franco')}</Descriptions.Item>
          <Descriptions.Item label="Alamat Customer" style={{ maxWidth: 200 }}>
            {form.getFieldValue('address')}
          </Descriptions.Item>
          <Descriptions.Item label="Harga Total">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>Rp. {globalHelpers.currencyFormatter(form.getFieldValue('totalAmount') || 0)}</p>
              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangRupiah(form.getFieldValue('totalAmount') || 0)}
              </p>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Invoice">
            {dayjs(watchInvoiceDateManual).format('DD/MMMM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Pesanan">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

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
          marginTop: 10,
        }}
      >
        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<ItemsPo>
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
