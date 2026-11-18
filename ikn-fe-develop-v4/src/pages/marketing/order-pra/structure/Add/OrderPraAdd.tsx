import { Calendar, Note, Plus, TagChevron, Truck } from '@phosphor-icons/react';
import { Form, Row, Col, Flex, Upload, Space, Popconfirm, Tooltip } from 'antd';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  SisternodeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import * as globalInterfaces from '@/utils/interfaces/interfacesGlobal';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
import { decodeToken } from '@/api/authService';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import DrawerOrderPra from '../Components/DrawerOrderPra/DrawerOrderPra';
import { showNotification } from '@/contexts/services/notificationService';
import ModalCustomer from '@/components/ModalCustomer/ModalCustomer';
import { handleMessageError } from '@/utils/func/func';
import dayjs from 'dayjs';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import { useState } from '@/hooks/React/useState';
import { useEffect } from '@/hooks/React/useEffect';
import DrawerPajakOrderPra from '../Components/DrawerOrderPra/DrawerPajakOrderPra';
import { Button, Card, DatePicker, Input, InputNumber, Table } from '@/components/ui';

export default function OrderPraAdd() {
  const navigate = useAppNavigate();
  const [form] = Form.useForm();
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [openDrawerPajak, setOpenDrawerPajak] = useState<{
    open: boolean;
    totalAmount: number;
    subtotalAmount: number; // DIUBAH
  }>({
    open: false,
    totalAmount: 0,
    subtotalAmount: 0, // DIUBAH
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<OrderPraInterfaces.ProductType[]>([]);

  const [dataSourcePajak, setDataSourcePajak] = useState<any[]>([]);

  const subtotalAmount = Form.useWatch('subtotalAmount', form) || 0;

  const totalPajak = dataSourcePajak.reduce((total, pajak) => {
    const taxType = String(pajak.taxType || '').toUpperCase();
    const taxValue = Number(pajak.taxValue || 0);

    // Ambil pajak PPN dari master pajak
    if (taxType.includes('PPN')) {
      return total + Number(subtotalAmount) * taxValue;
    }

    return total;
  }, 0);

  const totalSetelahPajak = Number(subtotalAmount) + totalPajak;

  const dataSourcePajakDisplay = dataSourcePajak.map((pajak) => {
    const taxType = String(pajak.taxType || '').toUpperCase();
    const taxValue = Number(pajak.taxValue || 0);

    if (taxType.includes('PPN')) {
      return {
        ...pajak,
        taxAmount: Number(subtotalAmount) * taxValue,
      };
    }

    return {
      ...pajak,
      taxAmount: 0,
    };
  });

  useEffect(() => {
    form.setFieldValue('totalAmount', totalSetelahPajak);
  }, [subtotalAmount, totalPajak, form]);

  useEffect(() => {
    const hargaTotal = globalHelpers.hitungTotalHarga(dataSourceItems);
    form.setFieldValue('subtotalAmount', hargaTotal);
  }, [dataSourceItems]);

  const onFinish = async (values: OrderPraInterfaces.PayloadOrderRAType) => {
    try {
      setLoading(true);

      const picked = dataSourceItems.map(
        ({
          productId,
          quantity,
          kategoriProduct,
          kodeBarangProduct,
          namabarangProduct,
          satuanProduct,
          spesifikasiProduct,
          unitProduct,
          priceProduct,
          beratproduct,
          stockProduct,
          namabarangProductInvoice,
          nilaiSatuan,
        }: OrderPraInterfaces.ProductType) => ({
          productId,
          kategoriProduct,
          kodeBarangProduct,
          namabarangProduct,
          satuanProduct,
          spesifikasiProduct,
          unitProduct,
          priceProduct,
          beratproduct,
          stockProduct,
          quantity: Number(String(quantity).replace(',', '.')),
          unitPrice: 0,
          namabarangProductInvoice,
          nilaiSatuan,
        })
      );

      try {
        if (decodeToken()?.id) {
          const formData = new FormData();
          const originalFile = values.file.originFileObj;

          // Ganti nama file
          const renamedFile = new File([originalFile], `${Date.now()}-${originalFile.name}`, {
            type: originalFile.type,
          });
          values = {
            ...values,
            description: values.description,
            customerId: values.customerId,
            customerName: values.customerName,
            typePo: 'RA',
            subtotalAmount: globalHelpers.hitungTotalHarga(dataSourceItems),
            items: picked,
            file: renamedFile.name as any,
            taxes: dataSourcePajak.map((item) => ({
              taxId: item.taxId,
              taxType: item.taxType,
              taxValue: Number(item.taxValue),
              taxAmount: Number(item.taxAmount),
            })),
          };

          formData.append('file', renamedFile);

          await OrderPraAxios.uploadFileOrderPra(formData);
        } else {
          throw new Error('Silahkan Login Kembali');
        }
      } catch (e) {
        throw new Error('Failed to upload file');
      }

      await OrderPraAxios.posOrderPra(values);

      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');

      setTimeout(() => {
        navigate('/po-order-pra');
      }, 2000);

      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);

      const message = handleMessageError(e);

      showNotification('error', 'Gagal', message);
    }
  };

  globalHooks.useFetchOptionsSearch(customer, setCustomer, OrderPraAxios.fetchDataCustomer, []);

  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);

    const data = await OrderPraAxios.fetchGenCodePo();

    form.setFieldsValue({
      orderNumber: data.code,
    });

    setLoading(false);
  };

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
      render: (taxValue: number) => {
        return <p>{taxValue}</p>;
      },
    },
    {
      title: 'Jumlah Pajak',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'center',
      render: (taxAmount: number) => {
        return <p>Rp{globalHelpers.currencyFormatter(taxAmount || 0)}</p>;
      },
    },
  ];

  /*
   * ============================================================
   * COLUMN TABLE ITEM
   * ============================================================
   */
  const columns: TableColumnsType<OrderPraInterfaces.ProductType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarangProduct',
      key: 'kodeBarangProduct',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namabarangProductInvoice',
      key: 'namabarangProductInvoice',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'priceProduct',
      key: 'priceProduct',
      align: 'center',
      render: (priceProduct: number) => {
        return <span>Rp{globalHelpers.currencyFormatter(priceProduct || 0)}</span>;
      },
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
      render: (stockProduct: number) => {
        return <span>{globalHelpers.currencyFormatter(stockProduct || 0)}</span>;
      },
    },
    {
      title: 'Unit',
      dataIndex: 'unitProduct',
      key: 'unitProduct',
      align: 'center',
    },
    {
      title: 'Berat Barang',
      dataIndex: 'beratproduct',
      key: 'beratproduct',
      align: 'center',
      render: (beratproduct: number) => {
        return <span>{globalHelpers.currencyFormatter(beratproduct)}</span>;
      },
    },
    {
      title: 'Satuan',
      dataIndex: 'satuanProduct',
      key: 'satuanProduct',
      align: 'center',
    },
    {
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity: number) => {
        return <span>{globalHelpers.currencyFormatter(quantity)}</span>;
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: string, record: OrderPraInterfaces.ProductType) => (
        <Space>
          <ButtonEditGroup onClick={() => handleEdit(record.productId)} />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.productId)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    const filterData = dataSourceItems.filter((item) => item.productId != id);

    setDataSourceItems(filterData);
  };

  const handleEdit = (id: string) => {
    const findOne = dataSourceItems.find((items) => items.productId === id);

    formItems.setFieldsValue({
      productId: findOne?.productId,
      kodeBarangProduct: findOne?.kodeBarangProduct,
      namabarangProduct: findOne?.namabarangProduct,
      spesifikasiProduct: findOne?.spesifikasiProduct,
      stockProduct: findOne?.stockProduct,
      kategoriProduct: findOne?.kategoriProduct,
      satuanProduct: findOne?.satuanProduct,
      unitProduct: findOne?.unitProduct,
      nilaiSatuan: findOne?.nilaiSatuan,
      namabarangProductInvoice: findOne?.namabarangProductInvoice,
      quantity: findOne?.quantity,
      priceProduct: findOne?.priceProduct,
    });

    seOpenDrawer(true);
  };

  const handleRowDoubleClick = (record: globalInterfaces.DataTypeCustomer) => {
    form.setFieldsValue({
      customerId: record.id || null,
      customerName: record.name,
    });

    setOpen(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Pesanan (PRA)" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ModalCustomer open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />

      <DrawerOrderPra
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />
      <DrawerPajakOrderPra
        openDrawer={openDrawerPajak}
        seOpenDrawer={setOpenDrawerPajak}
        setDataSourcePajak={setDataSourcePajak}
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
              rules={[
                {
                  required: true,
                  message: 'Masukan nilai nomor pesanan!',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nilai nomor pesanan"
              />
            </Form.Item>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Form.Item
                label="customerId"
                name="customerId"
                style={{
                  width: '100%',
                  display: 'none',
                }}
                rules={[
                  {
                    required: true,
                    message: 'Masukan customerName Id!',
                  },
                ]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="customerId" />
              </Form.Item>

              <Form.Item
                label="Pelanggan"
                name="customerName"
                style={{ width: '100%' }}
                rules={[
                  {
                    required: true,
                    message: 'Masukan Nama Pelanggan!',
                  },
                ]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nama Pelanggan" />
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
              label="Kebun"
              name="kebun"
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: 'Masukan Nama Kebun!',
                },
              ]}
            >
              <Input prefix={<SisternodeOutlined size={16} />} placeholder="Nama Kebun" />
            </Form.Item>

            <Form.Item
              label="Tanggal Pesanan"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Masukan Tanggal Order!',
                },
              ]}
              getValueFromEvent={(date) => {
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => {
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

            <Form.Item
              label="Upload File Pesanan"
              name="file"
              valuePropName="file"
              extra={
                <span
                  style={{
                    color: 'green',
                  }}
                >
                  File harus berupa PDF
                </span>
              }
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;

                return e?.fileList?.[0];
              }}
              rules={[
                {
                  required: true,
                  message: 'Masukan file!',
                },
              ]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Pilih File</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Keterangan"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Masuka Keterangan!',
                },
              ]}
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
              rules={[
                {
                  required: true,
                  message: 'Masuka Franco!',
                },
              ]}
            >
              <Input style={{ width: '100%' }} prefix={<Truck size={16} />} placeholder="Franco" />
            </Form.Item>

            <Form.Item
              label="Harga Dasar (tidak termasuk pajak)"
              name="subtotalAmount"
              rules={[
                {
                  required: true,
                  message: 'Harga total!',
                },
              ]}
              extra={<TextTerbilang properti="subtotalAmount" form={form} />}
            >
              <InputNumber
                prefix={<span>Rp</span>}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                disabled
                controls={false}
                style={{ width: '100%' }}
                placeholder={'Harga total'}
              />
            </Form.Item>

            <Form.Item
              label="Harga Total (termasuk pajak)"
              name="totalAmount"
              rules={[
                {
                  required: true,
                  message: 'Harga total!',
                },
              ]}
              extra={<TextTerbilang properti="totalAmount" form={form} />}
            >
              <InputNumber
                prefix={<span>Rp</span>}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                disabled
                controls={false}
                style={{ width: '100%' }}
                placeholder="Harga total"
                value={totalSetelahPajak}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title="Item Pesanan" />}
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
              onClick={() => {
                seOpenDrawer(true);
                formItems.resetFields();
              }}
              style={{ width: 150 }}
            >
              Tambah Items
            </Button>
          </div>

          <Table<OrderPraInterfaces.ProductType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Card
          title={<TitleCardItemsList title="Daftar Pajak" />}
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
              onClick={() =>
                setOpenDrawerPajak((prev) => ({
                  ...prev,
                  open: true,

                  // DIUBAH: kirim subtotal ke DrawerPajakOrderPra
                  subtotalAmount: form.getFieldValue('subtotalAmount'),

                  totalAmount: form.getFieldValue('subtotalAmount'),
                }))
              }
              style={{ width: 150 }}
            >
              Tambah Pajak
            </Button>
          </div>

          <Table<DataType>
            columns={columnsPajak}
            dataSource={dataSourcePajakDisplay}
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
