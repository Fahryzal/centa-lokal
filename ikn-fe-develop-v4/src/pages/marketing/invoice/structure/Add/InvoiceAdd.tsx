import {
  Calculator,
  Calendar,
  CheckCircle,
  Note,
  TagChevron,
  Truck,
  User,
  Plus,
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
  message,
  Tag,
  Divider,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { showNotification } from '@/contexts/services/notificationService';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerOrderPra from './DrawerInvoice/DrawerInvoice';
import { DollarCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ModalDeliveryPoPra from './ModalInvoice/ModalInvoice';
import ModalNumberAccount from './ModalInvoice/ModalNumberAccount';
import dayjs from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import DrawerInvoiceSpb from './DrawerInvoice/DrawerInvoiceSpb';

interface DataType {
  key: string;
  kodeBarangProduct: string;
  namabarangProduct: string;
  priceProduct: number;
  satuanProduct: string;
  spesifikasiProduct: string;
  stockProduct: number;
  unitProduct: string;
  qtyKirim: number;
}

interface TaxRow {
  id: string;
  taxType: string;
  taxValue: number;
  taxAmount: number;
  [key: string]: any;
}

export default function InvoiceAdd() {
  const [form] = Form.useForm();

  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [openBankAccount, setOpenBankAccount] = useState<boolean>(false);

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

  const [, setDataSourceItems] = useState<any[]>([]);
  const [dataSourcePajak, setDataSourcePajak] = useState<TaxRow[]>([]);
  const [purchaseOrderTaxes, setPurchaseOrderTaxes] = useState<any[]>([]);
  const [openDrawerSpb, setOpenDrawerSpb] = useState(false);
  const [selectedSpbs, setSelectedSpbs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isExistingInvoice, setIsExistingInvoice] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  globalHooks.useFetchOptions(unit, setUnit, InvoiceAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, InvoiceAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({
      ...prev,
      name: searchText,
    }));
  }, 1000);

  useEffect(() => {
    const loadInvoiceNumber = async () => {
      const purchaseOrderId = form.getFieldValue('purchaseOrderId');

      if (!purchaseOrderId) {
        form.setFieldsValue({
          invoiceNumber: undefined,
        });
        setIsExistingInvoice(false);
        return;
      }

      try {
        const invoiceResponse = await InvoiceAxios.fetchDataInvoice({
          page: 1,
          limit: 1000,
          invoiceNumber: null,
          orderNumber: form.getFieldValue('orderNumber') || null,
          customerName: null,
          typeInvoice: 'RA',
        });

        const invoices = Array.isArray(invoiceResponse?.data) ? invoiceResponse.data : [];

        const existingInvoice = invoices.find((invoice: any) => {
          return invoice.InvoiceDetail?.some(
            (detail: any) =>
              detail?.SPB?.purchaseOrderId === purchaseOrderId ||
              (detail?.spbId && detail?.SPB?.purchaseOrderId === purchaseOrderId)
          );
        });

        if (existingInvoice?.invoiceNumber) {
          form.setFieldsValue({
            invoiceNumber: existingInvoice.invoiceNumber,
          });
          setIsExistingInvoice(true);
          return;
        }

        const nextNumber = await InvoiceAxios.fetchNextRaInvoiceNumber();

        form.setFieldsValue({
          invoiceNumber: nextNumber,
        });

        setIsExistingInvoice(false);
      } catch (error) {
        console.error('Gagal mengambil nomor Invoice:', error);
        form.setFieldsValue({
          invoiceNumber: undefined,
        });
        setIsExistingInvoice(false);
      }
    };

    loadInvoiceNumber();
  }, [form]);

  const getSpbItems = (spb: any): any[] => {
    if (Array.isArray(spb?.itemsSPB)) {
      return spb.itemsSPB;
    }

    if (Array.isArray(spb?.items)) {
      return spb.items;
    }

    return [];
  };

  const getSpbSubtotal = (spb: any): number => {
    const subtotalAmount = Number(spb?.subtotalAmount ?? 0);

    if (subtotalAmount > 0) {
      return subtotalAmount;
    }

    return getSpbItems(spb).reduce(
      (total: number, item: any) => total + Number(item?.total ?? 0),
      0
    );
  };

  const calculateSubtotal = (spbs: any[]): number => {
    return spbs.reduce((total: number, spb: any) => total + getSpbSubtotal(spb), 0);
  };

  const calculateTaxes = (subtotal: number, taxes: any[]): TaxRow[] => {
    return (taxes || []).map((tax: any) => {
      const taxValue = Number(tax?.taxValue ?? 0);
      const taxAmount = subtotal * taxValue;

      return {
        ...tax,
        id: tax.id,
        taxType: tax.taxType,
        taxValue,
        taxAmount,
      };
    });
  };

  const recalculateInvoice = () => {
    const subtotal = calculateSubtotal(selectedSpbs);

    const taxes = calculateTaxes(subtotal, purchaseOrderTaxes);

    const totalTax = taxes.reduce((total, tax) => total + Number(tax.taxAmount ?? 0), 0);

    const totalAmount = subtotal + totalTax;

    const totalPPh22 = taxes
      .filter((tax) => tax.taxType === 'PPh 22')
      .reduce((total, tax) => total + Number(tax.taxAmount ?? 0), 0);

    const totalPPh23 = taxes
      .filter((tax) => tax.taxType === 'PPh 23')
      .reduce((total, tax) => total + Number(tax.taxAmount ?? 0), 0);

    const totalAmountReal = totalAmount - totalPPh22 - totalPPh23;

    setDataSourcePajak(taxes);

    form.setFieldsValue({
      subtotalAmount: subtotal,
      totalAmount,
      totalAmountReal,
    });
  };

  useEffect(() => {
    recalculateInvoice();
  }, [selectedSpbs, purchaseOrderTaxes]);

  const columnsPajak: TableColumnsType<TaxRow> = [
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
      render: (_: any, record: TaxRow) => {
        const taxValue = Number(record?.taxValue ?? 0);

        return <span>{globalHelpers.currencyFormatter(taxValue * 100)}%</span>;
      },
    },
    {
      title: 'Jumlah Pajak',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'center',
      render: (_: any, record: TaxRow) => {
        return <span>Rp {globalHelpers.currencyFormatter(Number(record?.taxAmount ?? 0))}</span>;
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
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(Number(record?.qtyKirim ?? 0))}</span>;
      },
    },
  ];

  const handleRowDoubleClick = (record: any) => {
    form.setFieldsValue({
      orderNumber: record.orderNumber,
      customerName: record.customerName,
      date: record.date ? dayjs(record.date) : null,
      description: record.description,
      franco: record.franco,
      status: record.status,
      totalAmount: 0,
      totalAmountReal: 0,
      subtotalAmount: 0,
      purchaseOrderId: record.id,
    });
    loadInvoiceNumber(record.id);

    setSelectedSpbs([]);
    setDataSourceItems([]);

    const taxes = record?.PurchaseOrderTax || [];

    setPurchaseOrderTaxes(taxes);

    setDataSourcePajak(
      taxes.map((tax: any) => ({
        ...tax,
        taxAmount: 0,
      }))
    );

    setOpen((current) => !current);
  };

  const loadInvoiceNumber = async (purchaseOrderId: string) => {
    if (!purchaseOrderId) {
      form.setFieldsValue({
        invoiceNumber: undefined,
        invoiceDate: undefined,
        bankAccountId: undefined,
        bankName: undefined,
        bankAccountNumber: undefined,
        namaAtasan: undefined,
        jabatanAtasan: undefined,
      });

      setIsExistingInvoice(false);
      return;
    }

    try {
      const existingInvoice = await InvoiceAxios.fetchRaInvoiceByPurchaseOrder(purchaseOrderId);

      console.log('EXISTING INVOICE:', existingInvoice);
      console.log('INVOICE DATE:', existingInvoice?.invoiceDate);

      if (existingInvoice?.invoiceNumber) {
        form.setFieldsValue({
          invoiceNumber: existingInvoice.invoiceNumber,
          invoiceDate: existingInvoice.invoiceDate
            ? dayjs(existingInvoice.invoiceDate).format('YYYY-MM-DD')
            : undefined,
          bankAccountId: existingInvoice.bankAccountId ?? undefined,
          bankName: existingInvoice.BankAccount?.bankName ?? undefined,
          bankAccountNumber: existingInvoice.BankAccount?.bankAccountNumber ?? undefined,
          namaAtasan: existingInvoice.namaAtasan ?? undefined,
          jabatanAtasan: existingInvoice.jabatanAtasan ?? undefined,
        });

        setIsExistingInvoice(true);
        return;
      }

      const nextNumber = await InvoiceAxios.fetchNextRaInvoiceNumber();

      form.setFieldsValue({
        invoiceNumber: nextNumber,
        invoiceDate: undefined,
        bankAccountId: undefined,
        bankName: undefined,
        bankAccountNumber: undefined,
        namaAtasan: undefined,
        jabatanAtasan: undefined,
      });

      setIsExistingInvoice(false);
    } catch (error) {
      console.error('Gagal mengambil data Invoice:', error);

      form.setFieldsValue({
        invoiceNumber: undefined,
        invoiceDate: undefined,
        bankAccountId: undefined,
        bankName: undefined,
        bankAccountNumber: undefined,
        namaAtasan: undefined,
        jabatanAtasan: undefined,
      });

      setIsExistingInvoice(false);
    }
  };

  const handleSelectBankAccount = (record: any) => {
    form.setFieldsValue({
      bankAccountId: record.id,
      bankName: record.bankName,
      bankAccountNumber: record.bankAccountNumber,
    });

    setOpenBankAccount(false);
  };

  const selectedSpbSections = useMemo(() => {
    return selectedSpbs.map((spb: any, index: number) => {
      const items = getSpbItems(spb);

      return {
        ...spb,
        sectionKey: spb.id || `spb-${index}`,
        items: items.map((item: any, itemIndex: number) => ({
          ...item,
          kodeBarangProduct: item?.kodeBarangProduct ?? '',
          namabarangProduct: item?.namabarangProductInvoice ?? item?.namabarangProduct ?? '',
          priceProduct: Number(item?.priceProduct ?? item?.unitPrice ?? 0),
          satuanProduct: item?.satuanProduct ?? '',
          spesifikasiProduct: item?.spesifikasiProduct ?? '',
          stockProduct: Number(item?.stockProduct ?? 0),
          unitProduct: item?.unitProduct ?? '',
          qtyKirim: Number(item?.qtyKirim ?? 0),
          key: item?.id ?? `${spb.id}-${itemIndex}`,
        })),
      };
    });
  }, [selectedSpbs]);

  const handleFinish = async (values: any) => {
    if (!values.purchaseOrderId) {
      showNotification('error', 'Gagal', 'Silakan pilih Nomor Pesanan terlebih dahulu');
      return;
    }

    if (!selectedSpbs.length) {
      showNotification('error', 'Gagal', 'Silakan pilih minimal satu SPB');
      return;
    }

    if (!values.invoiceNumber) {
      showNotification('error', 'Gagal', 'Nomor Invoice wajib diisi');
      return;
    }

    if (!values.invoiceDate) {
      showNotification('error', 'Gagal', 'Tanggal Invoice wajib diisi');
      return;
    }

    const spbIds = selectedSpbs.map((spb) => spb.id);

    try {
      setLoading(true);

      await InvoiceAxios.createInvoice({
        purchaseOrderId: values.purchaseOrderId,
        spbIds,
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate,
        bankAccountId: values.bankAccountId,
        namaAtasan: values.namaAtasan,
        jabatanAtasan: values.jabatanAtasan,
      });

      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Invoice');

      setLoading(false);
      form.resetFields();
    } catch (error) {
      console.error('Gagal membuat Invoice:', error);

      setLoading(false);

      showNotification('error', 'Gagal', 'Gagal Menambahkan Invoice');
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Buat Invoice" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <DrawerOrderPra
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <DrawerInvoiceSpb
        open={openDrawerSpb}
        setOpen={setOpenDrawerSpb}
        purchaseOrderId={form.getFieldValue('purchaseOrderId')}
        orderNumber={form.getFieldValue('orderNumber')}
        selectedSpbs={selectedSpbs}
        setSelectedSpbs={setSelectedSpbs}
      />

      <ModalDeliveryPoPra
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />

      <ModalNumberAccount
        open={openBankAccount}
        setOpen={setOpenBankAccount}
        handleRowDoubleClick={handleSelectBankAccount}
      />

      <Form
        layout="vertical"
        form={form}
        name="invoiceAdd"
        initialValues={{
          remember: true,
        }}
        onFinish={handleFinish}
        onFinishFailed={(errorInfo) => {
          console.log('VALIDASI INVOICE GAGAL:', errorInfo);
          message.error('Masih ada data Invoice yang wajib diisi');
        }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Form.Item name="bankAccountId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Form.Item
                label="Nomor Pesanan"
                style={{
                  flex: 1,
                  width: '100%',
                }}
                name="orderNumber"
                rules={[
                  {
                    required: true,
                    message: 'Masukan nilai nomor pesanan!',
                  },
                ]}
              >
                <Input
                  disabled
                  style={{
                    width: '100%',
                  }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Pesanan"
                />
              </Form.Item>

              <Tooltip title="Cari Nomor Pesanan">
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>

            <Form.Item
              name="purchaseOrderId"
              hidden
              rules={[
                {
                  required: true,
                  message: 'Masukan nilai purchaseOrderId!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Pelanggan"
              name="customerName"
              rules={[
                {
                  required: true,
                  message: 'Masukan customer!',
                },
              ]}
            >
              <Select
                prefix={<User />}
                showSearch
                disabled
                loading={customer.loading}
                placeholder="Pilih customer"
                optionFilterProp="label"
                onChange={() =>
                  setCustomer((prev) => ({
                    ...prev,
                    name: '',
                  }))
                }
                onSearch={onSearcCustomer}
                options={globalHelpers.toAntdOptions(customer.data || [], 'id', 'name')}
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Pesanan"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Masukan Tanggal Pesanan!',
                },
              ]}
              getValueFromEvent={(date) => (date ? date.format('YYYY-MM-DD') : null)}
              getValueProps={(value) => ({
                value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
              })}
            >
              <DatePicker
                prefix={<Calendar />}
                disabled
                style={{
                  width: '100%',
                }}
                placeholder="Tanggal Pesanan"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label="Harga Sebelum Pajak"
              name="subtotalAmount"
              rules={[
                {
                  required: true,
                  message: 'Masukan Total Amount!',
                },
              ]}
            >
              <InputNumber
                disabled
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{
                  width: '100%',
                }}
                prefix={<DollarCircleOutlined size={16} />}
                placeholder="Harga Sebelum Pajak"
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Invoice"
              name="invoiceDate"
              rules={[
                {
                  required: true,
                  message: 'Masukan tanggal invoice!',
                },
              ]}
              getValueFromEvent={(date) => (date ? date.format('YYYY-MM-DD') : null)}
              getValueProps={(value) => ({
                value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
              })}
            >
              <DatePicker
                prefix={<Calculator />}
                disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice}
                style={{
                  width: '100%',
                }}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item label="Nama Atasan" name="namaAtasan">
              <Input disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Nomor Invoice"
              style={{
                flex: 1,
                width: '100%',
              }}
              name="invoiceNumber"
              rules={[
                {
                  required: true,
                  message: 'Masukan nilai Nomor Invoice!',
                },
              ]}
            >
              <Input
                style={{
                  width: '100%',
                }}
                prefix={<TagChevron size={16} />}
                placeholder="Nomor Invoice"
                disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice}
              />
            </Form.Item>

            <Form.Item
              label="Keterangan"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Masukan Keterangan!',
                },
              ]}
            >
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<Note size={16} />}
                placeholder="Keterangan"
              />
            </Form.Item>

            <Form.Item
              label="Franco"
              name="franco"
              rules={[
                {
                  required: true,
                  message: 'Masukan Franco!',
                },
              ]}
            >
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<Truck size={16} />}
                placeholder="Franco"
              />
            </Form.Item>

            <Form.Item
              label="Total Tagihan"
              name="totalAmount"
              rules={[
                {
                  required: true,
                  message: 'Masukan Total Amount!',
                },
              ]}
            >
              <InputNumber
                disabled
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{
                  width: '100%',
                }}
                prefix={<DollarCircleOutlined size={16} />}
                placeholder="Total Tagihan"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Masukan Status!',
                },
              ]}
            >
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<CheckCircle size={16} />}
                placeholder="Status"
              />
            </Form.Item>

            <Form.Item label="Jabatan Atasan" name="jabatanAtasan">
              <Input disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice} />
            </Form.Item>

            <Form.Item name="totalAmountReal" hidden>
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title="Rekening"
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={11}>
              <Form.Item label="Bank" name="bankName">
                <Input
                  disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice}
                  readOnly
                />
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
                  disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice}
                  onClick={() => setOpenBankAccount(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </Col>

            <Col xs={24} sm={11}>
              <Form.Item label="No. Rekening" name="bankAccountNumber">
                <Input disabled={!form.getFieldValue('purchaseOrderId') || isExistingInvoice} />
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
              icon={<Plus />}
              disabled={!form.getFieldValue('purchaseOrderId')}
              onClick={() => setOpenDrawerSpb(true)}
              style={{
                width: 120,
              }}
            >
              Transaksi
            </Button>
          </div>

          {!selectedSpbSections.length ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: '#999',
              }}
            >
              Silakan pilih Nomor Pesanan kemudian klik Transaksi untuk memilih SPB.
            </div>
          ) : (
            selectedSpbSections.map((spb, index) => (
              <div
                key={spb.sectionKey}
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
                  <strong>No. SPB: {spb.noSpb || spb.noSPB || spb.id}</strong>

                  <Tag color="blue">SPB {index + 1}</Tag>
                </div>

                <Table<DataType>
                  columns={columns}
                  dataSource={spb.items}
                  pagination={false}
                  bordered
                  scroll={{
                    x: 'max-content',
                  }}
                />
              </div>
            ))
          )}

          {selectedSpbs.length > 0 && (
            <div
              style={{
                marginTop: 10,
              }}
            >
              <Tag color="blue">{selectedSpbs.length} SPB dipilih</Tag>
            </div>
          )}
        </Card>

        <Card
          title={<TitleCardItemsList title="Daftar Pajak" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table<TaxRow>
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
            pembeli. Anda akan menerima{' '}
            <b>Rp. {globalHelpers.currencyFormatter(form.getFieldValue('totalAmountReal') || 0)}</b>
            .
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
