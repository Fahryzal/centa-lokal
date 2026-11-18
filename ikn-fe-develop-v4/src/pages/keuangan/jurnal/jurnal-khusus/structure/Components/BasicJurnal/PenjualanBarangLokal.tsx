import { Form, Descriptions } from 'antd';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import { showNotification } from '@/contexts/services/notificationService';
import { useState } from '@/hooks/React/useState';
import { useEffect } from '@/hooks/React/useEffect';
import { Card, Table } from '@/components/ui';
import {
  Item as ItemsPo,
  InvoiceTax,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';
import { handleMessageError } from '@/utils/func/func';

export default function PenjualanBarangLokal({ dataBasic }: { dataBasic: any }) {
  const [form] = Form.useForm();
  const [dataSourceItems, setDataSourceItems] = useState<ItemsPo[]>([]);
  const [dataSourcePajak, setDataSourcePajak] = useState<InvoiceTax[] | []>([]);

  useEffect(() => {
    fetchDataInvoiceById();
  }, [dataBasic]);

  const fetchDataInvoiceById = async () => {
    try {
      const data = dataBasic?.spb;
      form.setFieldsValue({
        orderNumber: data?.orderNumber,
        customerName: data?.customerName,
        date: dayjs(data?.date),
        description: data?.description,
        franco: data?.franco || '-',
        status: data?.status,
        noSpb: data?.noSpb || '-',
        totalAmount: data?.invoice?.amountWithTax || 0,
        purchaseOrderId: data?.purchaseOrderId,
        invoiceNumber: data?.invoice?.invoiceNumber || '-',
        invoiceDate: dayjs(data?.invoice?.invoiceDate),
        subtotalAmount: data?.invoice?.subtotalAmount || 0,
        address: data?.franco,
        harga: data?.subtotalAmount || 0,
      });
      setDataSourceItems(data?.itemsSPB || []);
      setDataSourcePajak(data?.invoice?.invoiceTaxes || []);
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
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

  return (
    <Card
      title={<TitleCardDetail title="Detail Penjualan" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Card
        title={<TitleCardItems title="Detail Penjualan Barang Lokal" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Pesanan">
            {form.getFieldValue('orderNumber')}
          </Descriptions.Item>
          <Descriptions.Item label="Nomor SPB/Lokal">
            {form.getFieldValue('noSpb')}
          </Descriptions.Item>
          <Descriptions.Item label="Keterangan">
            {form.getFieldValue('description')}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {form.getFieldValue('customerName')}
          </Descriptions.Item>
          <Descriptions.Item label="Harga" style={{ maxWidth: 200 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>Rp. {globalHelpers.currencyFormatter(form.getFieldValue('harga') || 0)}</p>
              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangRupiah(form.getFieldValue('harga') || 0)}
              </p>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Alamat Customer" style={{ maxWidth: 200 }}>
            {form.getFieldValue('address')}
          </Descriptions.Item>
          <Descriptions.Item label="Harga Total (+Pajak)">
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
            {dayjs(form.getFieldValue('invoiceDate')).format('DD/MMMM/YYYY')}
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
      </Form>
    </Card>
  );
}
