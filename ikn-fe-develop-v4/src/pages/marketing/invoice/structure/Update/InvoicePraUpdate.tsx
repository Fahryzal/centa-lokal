import { Calendar, CheckCircle, Note, TagChevron, Truck, User } from '@phosphor-icons/react';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Table,
  Tooltip,
} from 'antd';

import { useEffect, useState } from 'react';
import type { TableColumnsType } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import { useNavigate, useParams } from 'react-router';

import dayjs from 'dayjs';

import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import * as globalHelpers from '@/utils/helper';

import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';

import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';

import ModalNumberAccount from '../Add/ModalInvoice/ModalNumberAccount';

import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';

import type {
  Item as ItemsPo,
  Data as DataDetail,
  InvoiceTax,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';

import { useUpdateInvoice } from '@pages/marketing/invoice/hooks/useInvoice';

type BankAccountDetail = {
  id?: string;
  bankName?: string | null;
  bankAccountNumber?: string | null;
};

type InvoiceDetailRow = {
  id?: string | null;
  spbId?: string | null;
  itemsSpbId?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  total?: number | null;
  SPB?: any;
  itemsSPB?: any;
};

type InvoiceDetailData = DataDetail & {
  typeInvoice?: string | null;

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

  InvoiceDetail?: InvoiceDetailRow[];
};

type DetailItem = ItemsPo & {
  id?: string;

  quantity?: number | null;
  qtyKirim?: number | null;

  priceProduct?: number | null;

  kodeBarangProduct?: string | null;
  namabarangProduct?: string | null;
  satuanProduct?: string | null;
  spesifikasiProduct?: string | null;
  unitProduct?: string | null;
  stockProduct?: number | null;
};

type DetailSpbSection = {
  id: string;
  noSpb: string;
  items: DetailItem[];
};

export default function InvoiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [openBankAccount, setOpenBankAccount] = useState(false);

  const [dataSourceItems, setDataSourceItems] = useState<DetailItem[] | DetailSpbSection[]>([]);

  const [dataSourcePajak, setDataSourcePajak] = useState<InvoiceTax[]>([]);

  const { mutateAsync: updateInvoice } = useUpdateInvoice();

  useEffect(() => {
    fetchDataInvoice();
  }, [id]);

  const fetchDataInvoice = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const data = (await InvoiceAxios.fetchDataInvoiceById(id)) as InvoiceDetailData;

      if (!data) {
        throw new Error('Data Invoice tidak ditemukan');
      }

      if (data.typeInvoice !== 'RA') {
        throw new Error('Edit hanya dapat dilakukan untuk Invoice RA');
      }

      const invoiceDetails = data.InvoiceDetail ?? [];

      const spb = data.spb ?? invoiceDetails?.[0]?.SPB;

      const purchaseOrder = spb?.purchaseOrder;

      form.setFieldsValue({
        orderNumber: purchaseOrder?.orderNumber ?? '',

        customerName: purchaseOrder?.customerName ?? '',

        date: purchaseOrder?.date ? dayjs(purchaseOrder.date).format('DD/MM/YYYY') : '',

        description: purchaseOrder?.description ?? '',

        franco: purchaseOrder?.franco ?? '',

        invoiceNumber: data.invoiceNumber ?? '',

        invoiceDate: data.invoiceDate ? dayjs(data.invoiceDate) : null,

        subtotalAmount: data.totalAmount ?? purchaseOrder?.subtotalAmount ?? 0,

        totalAmount: data.amountWithTax ?? data.totalAmount ?? 0,

        status: data.status ?? '',

        bankAccountId: data.bankAccountId ?? '',

        bankName: data.BankAccount?.bankName ?? '',

        bankAccountNumber: data.BankAccount?.bankAccountNumber ?? '',

        namaAtasan: data.namaAtasan ?? '',

        jabatanAtasan: data.jabatanAtasan ?? '',
      });

      const isNewInvoice = invoiceDetails.length > 0;

      if (isNewInvoice) {
        const groupedSpbs: Record<string, DetailSpbSection> = {};

        invoiceDetails.forEach((detail) => {
          const spbId = detail?.spbId;

          if (!spbId || !detail?.itemsSPB) {
            return;
          }

          if (!groupedSpbs[spbId]) {
            groupedSpbs[spbId] = {
              id: spbId,
              noSpb: detail?.SPB?.noSpb ?? '-',
              items: [],
            };
          }

          const item = detail.itemsSPB;

          groupedSpbs[spbId].items.push({
            ...item,

            id: detail?.itemsSpbId ?? detail?.id ?? `${spbId}-${groupedSpbs[spbId].items.length}`,

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
        const legacySpb = data?.spb;

        if (!legacySpb) {
          setDataSourceItems([]);
          return;
        }

        const legacyItems = Array.isArray(legacySpb?.itemsSPB) ? legacySpb.itemsSPB : [];

        const detailItems: DetailItem[] = legacyItems.map((item: any) => ({
          ...item,

          id: item?.id,

          quantity: item?.quantity ?? 0,

          qtyKirim: item?.quantity ?? 0,

          priceProduct: Number(item?.priceProduct ?? item?.unitPrice ?? 0),

          kodeBarangProduct: item?.kodeBarangProduct ?? '',

          namabarangProduct: item?.namabarangProductInvoice ?? item?.namabarangProduct ?? '',

          satuanProduct: item?.satuanProduct ?? '',

          spesifikasiProduct: item?.spesifikasiProduct ?? '',

          stockProduct: Number(item?.stockProduct ?? 0),

          unitProduct: item?.unitProduct ?? '',
        }));

        setDataSourceItems([
          {
            id: legacySpb.id,
            noSpb: legacySpb.noSpb ?? '-',
            items: detailItems,
          },
        ]);
      }

      setDataSourcePajak(data.invoiceTaxes ?? []);
    } catch (error) {
      const message = handleMessageError(error);

      showNotification('error', 'Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBankAccount = (record: any) => {
    form.setFieldsValue({
      bankAccountId: record?.id ?? '',

      bankName: record?.bankName ?? '',

      bankAccountNumber: record?.bankAccountNumber ?? '',
    });

    setOpenBankAccount(false);
  };

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

      render: (_, record) => (
        <span>Rp {globalHelpers.currencyFormatter(Number(record?.priceProduct ?? 0))}</span>
      ),
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

      render: (_, record) => (
        <span>
          {globalHelpers.currencyFormatter(Number(record?.qtyKirim ?? record?.quantity ?? 0))}
        </span>
      ),
    },
  ];

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

      render: (_, record) => {
        const taxValue = Number(record?.taxValue ?? 0);

        return <span>{globalHelpers.currencyFormatter(taxValue * 100)}%</span>;
      },
    },
    {
      title: 'Jumlah Pajak',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'center',

      render: (_, record) => (
        <span>Rp {globalHelpers.currencyFormatter(Number(record?.taxAmount ?? 0))}</span>
      ),
    },
  ];

  const handleFinish = async (values: any) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID Invoice tidak ditemukan');

      return;
    }

    if (!values.invoiceNumber?.trim()) {
      showNotification('error', 'Gagal', 'Nomor Invoice wajib diisi');

      return;
    }

    try {
      setLoading(true);

      await updateInvoice({
        id,

        data: {
          invoiceNumber: values.invoiceNumber.trim(),

          invoiceDate: dayjs(values.invoiceDate).toISOString(),

          bankAccountId: values.bankAccountId || undefined,

          namaAtasan: values.namaAtasan?.trim() || undefined,

          jabatanAtasan: values.jabatanAtasan?.trim() || undefined,
        },
      });

      showNotification('success', 'Berhasil', 'Berhasil Ubah Data Invoice');

      setTimeout(() => {
        navigate(`/invoice`);
      }, 1000);
    } catch (error) {
      const message = handleMessageError(error);

      showNotification('error', 'Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Edit Invoice" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* MODAL BANK */}
      <ModalNumberAccount
        open={openBankAccount}
        setOpen={setOpenBankAccount}
        handleRowDoubleClick={handleSelectBankAccount}
      />
      <Form
        layout="vertical"
        form={form}
        name="invoiceEdit"
        onFinish={handleFinish}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* BANK ACCOUNT ID */}
        <Form.Item name="bankAccountId" hidden>
          <Input />
        </Form.Item>

        <Card
          title={<TitleCardItems title="Detail Invoice" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Nomor Pesanan" name="orderNumber">
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nomor Pesanan" />
              </Form.Item>

              <Form.Item label="Pelanggan" name="customerName">
                <Input disabled prefix={<User size={16} />} placeholder="Pelanggan" />
              </Form.Item>

              <Form.Item label="Tanggal Pesanan" name="date">
                <Input disabled prefix={<Calendar size={16} />} placeholder="Tanggal Pesanan" />
              </Form.Item>

              <Form.Item label="Harga Sebelum Pajak" name="subtotalAmount">
                <InputNumber
                  disabled
                  controls={false}
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                  style={{
                    width: '100%',
                  }}
                  prefix="Rp"
                  placeholder="Harga Sebelum Pajak"
                />
              </Form.Item>

              <Form.Item
                label="Tanggal Invoice"
                name="invoiceDate"
                rules={[
                  {
                    required: true,
                    message: 'Tanggal Invoice wajib diisi',
                  },
                ]}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  format="DD/MM/YYYY"
                  placeholder="Pilih Tanggal Invoice"
                />
              </Form.Item>

              {/* EDITABLE */}
              <Form.Item label="Nama Atasan" name="namaAtasan">
                <Input prefix={<User size={16} />} placeholder="Nama Atasan" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              {/* EDITABLE */}
              <Form.Item
                label="Nomor Invoice"
                name="invoiceNumber"
                rules={[
                  {
                    required: true,
                    message: 'Nomor Invoice wajib diisi',
                  },
                ]}
              >
                <Input prefix={<TagChevron size={16} />} placeholder="Nomor Invoice" />
              </Form.Item>

              <Form.Item label="Keterangan" name="description">
                <Input disabled prefix={<Note size={16} />} placeholder="Keterangan" />
              </Form.Item>

              <Form.Item label="Franco" name="franco">
                <Input disabled prefix={<Truck size={16} />} placeholder="Franco" />
              </Form.Item>

              <Form.Item label="Total Tagihan" name="totalAmount">
                <InputNumber
                  disabled
                  controls={false}
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                  style={{
                    width: '100%',
                  }}
                  prefix="Rp"
                  placeholder="Total Tagihan"
                />
              </Form.Item>

              <Form.Item label="Status" name="status">
                <Input disabled prefix={<CheckCircle size={16} />} placeholder="Status" />
              </Form.Item>

              {/* EDITABLE */}
              <Form.Item label="Jabatan Atasan" name="jabatanAtasan">
                <Input prefix={<User size={16} />} placeholder="Jabatan Atasan" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title="Rekening"
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={11}>
              <Form.Item label="Bank" name="bankName">
                <Input readOnly placeholder="Pilih Bank" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={2}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 24,
              }}
            >
              <Tooltip title="Pilih Rekening">
                <Button
                  type="primary"
                  onClick={() => setOpenBankAccount(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </Col>

            <Col xs={24} sm={11}>
              <Form.Item label="No. Rekening" name="bankAccountNumber">
                <Input disabled placeholder="Nomor Rekening" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {(dataSourceItems as DetailSpbSection[]).map((spb, index) => (
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
                <strong>No. SPB: {spb.noSpb || '-'}</strong>

                <span>SPB {index + 1}</span>
              </div>

              <Table<DetailItem>
                rowKey="id"
                columns={columns}
                dataSource={spb.items}
                pagination={false}
                bordered
                scroll={{
                  x: 'max-content',
                }}
              />
            </div>
          ))}
        </Card>

        <Card
          title={<TitleCardItemsList title="Daftar Pajak" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            marginTop: 10,
          }}
        >
          <Table<InvoiceTax>
            rowKey="id"
            columns={columnsPajak}
            dataSource={dataSourcePajak}
            pagination={false}
            bordered
            scroll={{
              x: 'max-content',
            }}
          />

          <Divider />

          <p
            style={{
              color: 'green',
              marginBottom: 0,
            }}
          >
            🧾 Catatan: PPh 22 atau PPh 23 jika ada, akan dipotong dan disetorkan langsung oleh
            pembeli.
          </p>
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
