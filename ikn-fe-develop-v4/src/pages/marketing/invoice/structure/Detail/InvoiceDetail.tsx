import { Form, Flex, Divider, Descriptions } from 'antd';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { generateRAInvoicePDF } from '@/utils/generatePdf/generateRAInvoicePDF';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { useState } from '@/hooks/React/useState';
import { useEffect } from '@/hooks/React/useEffect';
import { Card, Table } from '@/components/ui';
import {
  Item as ItemsPo,
  Data as DataDetail,
  InvoiceTax,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';
import { handleMessageError } from '@/utils/func/func';

type BankAccountDetail = {
  id?: string;
  bankName?: string | null;
  bankAccountNumber?: string | null;
};

type InvoiceDetailData = DataDetail & {
  bankAccountId?: string | null;
  BankAccount?: BankAccountDetail | null;
  amountTax?: number | null;
  totalAmount?: number | null;
  amountWithTax?: number | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | Date | null;
  namaAtasan?: string | null;
  jabatanAtasan?: string | null;
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

type DetailItem = ItemsPo & {
  quantity?: number | null;
  qtyKirim?: number | null;
  priceProduct?: number | null;
  kodeBarangProduct?: string | null;
  namabarangProduct?: string | null;
  satuanProduct?: string | null;
  spesifikasiProduct?: string | null;
  unitProduct?: string | null;
};

type DetailSpbSection = {
  id: string;
  noSpb: string;
  items: DetailItem[];
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formInv] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataInvoice, setDataInvoice] = useState<InvoiceDetailData | null>(null);
  const [dataSourceItems, setDataSourceItems] = useState<DetailItem[] | DetailSpbSection[]>([]);
  const [dataSourcePajak, setDataSourcePajak] = useState<InvoiceTax[]>([]);

  useEffect(() => {
    fetchDataInvoiceById();
  }, []);

  const fetchDataInvoiceById = async () => {
    try {
      setLoading(true);

      if (id) {
        const data = (await InvoiceAxios.fetchDataInvoiceById(id)) as InvoiceDetailData;

        setDataInvoice(data || null);

        const invoiceData = data;

        const spb = invoiceData?.spb ?? invoiceData?.InvoiceDetail?.[0]?.SPB;
        const purchaseOrder = spb?.purchaseOrder;

        form.setFieldsValue({
          orderNumber: purchaseOrder?.orderNumber,
          customerName: purchaseOrder?.customerName,
          date: purchaseOrder?.date ? dayjs(purchaseOrder.date) : null,
          description: purchaseOrder?.description,
          franco: purchaseOrder?.franco,
          status: purchaseOrder?.status,
          totalAmount: data?.totalAmount,
          purchaseOrderId: purchaseOrder?.id,
          invoiceNumber: data?.invoiceNumber,
          invoiceDate: data?.invoiceDate ? dayjs(data.invoiceDate) : null,
          subtotalAmount: purchaseOrder?.subtotalAmount,
          address: purchaseOrder?.customer?.address,
        });

        formInv.setFieldsValue({
          bankName: data?.BankAccount?.bankName ?? undefined,
          bankAccountNumber: data?.BankAccount?.bankAccountNumber ?? undefined,
          invoiceDateManual: data?.invoiceDate ? dayjs(data.invoiceDate) : undefined,
          ttdName: data?.namaAtasan ?? undefined,
          jabatan: data?.jabatanAtasan ?? undefined,
        });

        const invoiceDetails = invoiceData?.InvoiceDetail ?? [];

        const isNewInvoice =
          invoiceDetails.length > 0 &&
          invoiceDetails.some((detail) => detail?.spbId && detail?.itemsSpbId);

        if (isNewInvoice) {
          const groupedSpbs: Record<string, DetailSpbSection> = {};

          invoiceDetails.forEach((detail) => {
            const spbId = detail?.spbId;
            if (!spbId) return;

            if (!groupedSpbs[spbId]) {
              groupedSpbs[spbId] = {
                id: spbId,
                noSpb: detail?.SPB?.noSpb ?? '-',
                items: [],
              };
            }

            const item = detail?.itemsSPB;
            if (!item) return;

            groupedSpbs[spbId].items.push({
              ...item,
              key:
                detail?.itemsSpbId ?? detail?.id ?? `${spbId}-${groupedSpbs[spbId].items.length}`,

              quantity: detail?.quantity ?? 0,
              qtyKirim: detail?.quantity ?? 0,

              priceProduct: Number(item?.priceProduct ?? item?.unitPrice ?? detail?.unitPrice ?? 0),

              kodeBarangProduct: item?.kodeBarangProduct ?? '',

              namabarangProduct: item?.namabarangProductInvoice ?? item?.namabarangProduct ?? '',

              satuanProduct: item?.satuanProduct ?? '',
              spesifikasiProduct: item?.spesifikasiProduct ?? '',
              stockProduct: Number(item?.stockProduct ?? 0),
              unitProduct: item?.unitProduct ?? '',
            });
          });

          setDataSourceItems(Object.values(groupedSpbs));
        } else {
          const detailItems: DetailItem[] = invoiceDetails.length
            ? (invoiceDetails
                .map((detail) => {
                  const item = detail?.itemsSPB;
                  if (!item) return null;

                  return {
                    ...item,
                    quantity: detail?.quantity ?? item?.quantity ?? 0,
                    qtyKirim: item?.qtyKirim ?? detail?.quantity ?? item?.quantity ?? 0,
                    priceProduct: Number(
                      item?.priceProduct ?? item?.unitPrice ?? detail?.unitPrice ?? 0
                    ),
                  };
                })
                .filter(Boolean) as DetailItem[])
            : purchaseOrder?.items || [];

          setDataSourceItems(detailItems);
        }

        setDataSourcePajak(data?.invoiceTaxes || []);
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
      render: (_: number, record: InvoiceTax) => {
        const taxValue = Number(record?.taxValue ?? 0);

        return <span>{globalHelpers.currencyFormatter(taxValue * 100)}%</span>;
      },
    },
    {
      title: 'Jumlah Pajak',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'center',
      render: (_: number, record: InvoiceTax) => {
        return <span>Rp {globalHelpers.currencyFormatter(Number(record?.taxAmount ?? 0))}</span>;
      },
    },
  ];

  const columns: TableColumnsType<DetailItem> = [
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
      render: (_: number, record: DetailItem) => {
        return <span>Rp {globalHelpers.currencyFormatter(Number(record?.priceProduct ?? 0))}</span>;
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
      dataIndex: 'qtyKirim',
      key: 'qtyKirim',
      align: 'center',
      render: (_: number, record: DetailItem) => {
        return (
          <span>
            {globalHelpers.currencyFormatter(Number(record?.qtyKirim ?? record?.quantity ?? 0))}
          </span>
        );
      },
    },
  ];

  const hargaTotal = Number(dataInvoice?.totalAmount ?? 0);
  const hargaTotalSetelahPajak = Number(dataInvoice?.amountWithTax ?? 0);

  const onDownloadInvoice = () => {
    if (dataInvoice) {
      const dataTTD: InvoiceInterfaces.DataTTDType = {
        bankName: dataInvoice?.BankAccount?.bankName ?? '',
        bankAccountNumber: dataInvoice?.BankAccount?.bankAccountNumber ?? '',
        invoiceDate: dataInvoice?.invoiceDate ? dayjs(dataInvoice.invoiceDate) : undefined,
        ttdName: dataInvoice?.namaAtasan ?? '',
        jabatan: dataInvoice?.jabatanAtasan ?? '',
      } as InvoiceInterfaces.DataTTDType;

      generateRAInvoicePDF({
        ...dataInvoice,
        dataTTD,
      } as any);
    }
  };

  const isNewInvoice = dataInvoice?.amountTax !== null && dataInvoice?.amountTax !== undefined;

  return (
    <Card
      title={<TitleCardDetail title="Detail Invoice rs" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={<ButtonFile onClick={onDownloadInvoice} />}
    >
      <Card
        title={<TitleCardItems title="Detail Invoice" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Pesanan">
            {form.getFieldValue('orderNumber') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Nomor Invoice">
            {dataInvoice?.invoiceNumber || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Keterangan">
            {form.getFieldValue('description') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Customer">
            {form.getFieldValue('customerName') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Franco">
            {form.getFieldValue('franco') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Alamat Customer">
            {form.getFieldValue('address') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal Invoice">
            {dataInvoice?.invoiceDate ? dayjs(dataInvoice.invoiceDate).format('DD/MMMM/YYYY') : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal Pesanan">
            {form.getFieldValue('date')
              ? dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')
              : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Bank">
            {dataInvoice?.BankAccount?.bankName || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="No. Rekening">
            {dataInvoice?.BankAccount?.bankAccountNumber || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Nama Atasan">
            {dataInvoice?.namaAtasan || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Jabatan Atasan">
            {dataInvoice?.jabatanAtasan || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Harga Total">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>Rp. {globalHelpers.currencyFormatter(hargaTotal)}</p>

              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangRupiah(hargaTotal)}
              </p>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Harga Total Setelah Pajak">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>Rp. {globalHelpers.currencyFormatter(hargaTotalSetelahPajak)}</p>

              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangRupiah(hargaTotalSetelahPajak)}
              </p>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card
        title={<TitleCardItems title="Pesanan Item" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        {!isNewInvoice ? (
          <Table<DetailItem>
            columns={columns}
            dataSource={dataSourceItems as DetailItem[]}
            pagination={false}
            bordered
            scroll={{ x: 'max-content' }}
          />
        ) : (
          (dataSourceItems as DetailSpbSection[]).map((spb, index) => (
            <div
              key={spb.id}
              style={{
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f0f0f0',
                  border: '1px solid #d9d9d9',
                  borderBottom: 'none',
                  borderRadius: '8px 8px 0 0',
                  padding: '10px 14px',
                }}
              >
                <strong>No. SPB: {spb.noSpb}</strong>

                <span>SPB {index + 1}</span>
              </div>

              <Table<DetailItem>
                columns={columns}
                dataSource={spb.items}
                pagination={false}
                bordered
                scroll={{ x: 'max-content' }}
              />
            </div>
          ))
        )}
      </Card>

      <Card
        title={<TitleCardItemsList title="Daftar Pajak" />}
        style={{
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          marginTop: 10,
        }}
      >
        <Table<InvoiceTax>
          columns={columnsPajak}
          dataSource={dataSourcePajak}
          rowKey="id"
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Flex gap="small" style={{ marginTop: 10 }}>
        <Buttonback loading={loading} />
        <ButtonAdd loading={loading} />
      </Flex>
    </Card>
  );
}
