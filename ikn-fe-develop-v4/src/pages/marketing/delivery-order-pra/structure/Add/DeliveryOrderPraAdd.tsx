import {
  CalendarBlank,
  CheckCircle,
  Note,
  Plus,
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

import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';

import { DollarCircleFilled, SearchOutlined } from '@ant-design/icons';

import ModalDeliveryPoPra from './ModalDeliveryOrderPra/ModalDeliveryPoPra';
import DrawerDeliveryOrderPra from './DrawerDeliveryOrderPra/DrawerDeliveryOrderPra';

import dayjs from 'dayjs';

import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardItemsList from '@/components/atoms/Cards/Items/titleCardItemsList';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';

import * as DeliveryOrderPraInterfaces from '@pages/marketing/delivery-order-pra/interface/DeliveryOrderPraInterfaces';
import { showNotification } from '@/contexts/services/notificationService';

export default function DeliveryOrderPraAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 10,
    loading: false,
    nama: '',
  });

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 10,
    loading: false,
    name: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<any[]>([]);
  const [dataSourceItemsSelected, setDataSourceItemsSelected] = useState<any[]>([]);

  const [historyDelivery, setHistoryDelivery] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [purchaseOrderId, setPurchaseOrderId] = useState<string>('');

  const [openDrawer, setOpenDrawer] = useState({
    open: false,
  });

  const onFinish = async (values: DeliveryOrderPraInterfaces.PayloadDORA) => {
    try {
      if (dataSourceItemsSelected.length === 0) {
        showNotification('error', 'Gagal', 'Silakan pilih minimal satu barang untuk dikirim');
        return;
      }

      const items = dataSourceItemsSelected.map((item: any) => ({
        purchaseOrderItemId: item.id,
        qtyKirim: Number(String(item.qtyKirim ?? 0).replace(',', '.')),
      }));

      if (items.some((item) => !item.qtyKirim || item.qtyKirim <= 0)) {
        showNotification('error', 'Gagal', 'Qty Kirim harus lebih dari 0');
        return;
      }

      setLoading(true);

      await DeliveryOrderPraAxios.posDeliveryOrderPra({
        purchaseOrderId: values.purchaseOrderId,
        typeSalesDelivery: 'RA',
        au58Number: values.au58Number || null,
        au58Date: values.au58Date || null,
        items,
      });

      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');

      setTimeout(() => {
        navigate('/delivery-order-pra');
      }, 2000);

      form.resetFields();
      setDataSourceItems([]);
      setDataSourceItemsSelected([]);
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    } finally {
      setLoading(false);
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, DeliveryOrderPraAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, DeliveryOrderPraAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({
      ...prev,
      name: searchText,
    }));
  }, 1000);

  useEffect(() => {
    const totalAmount = dataSourceItemsSelected.reduce((total: number, item: any) => {
      const qtyKirim = Number(item.qtyKirim) || 0;
      const priceProduct = Number(item.priceProduct) || 0;

      return total + qtyKirim * priceProduct;
    }, 0);

    form.setFieldValue('totalAmount', totalAmount);
  }, [dataSourceItemsSelected, form]);

  const columns: TableColumnsType<any> = [
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
        const franco = form.getFieldValue('franco');

        return (
          <span>
            {franco?.toUpperCase() === 'BELAWAN' ? '$' : 'Rp'}
            {globalHelpers.currencyFormatter(priceProduct || 0)}
          </span>
        );
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
    {
      title: 'Qty Kirim',
      dataIndex: 'qtyKirim',
      key: 'qtyKirim',
      align: 'center',
    },
  ];

  const handleRowDoubleClick = async (record: DeliveryOrderPraInterfaces.DatumType) => {
    try {
      form.setFieldsValue({
        orderNumber: record.orderNumber,
        customerId: record.customerId,
        date: dayjs(record.date),
        description: record.description,
        franco: record.franco,
        customerName: record.customerName,
        status: record.status,
        au58Id: record.au58Id,
        totalAmount: record.subtotalAmount,
        purchaseOrderId: record.id,
        au58Date: record.au58Date ? dayjs(record.au58Date) : null,
      });

      setPurchaseOrderId(record.id);
      setDataSourceItems(
        record.items.map((item) => ({
          ...item,
          qtyKirim: 0,
        }))
      );

      const history = await DeliveryOrderPraAxios.fetchHistoryDeliveryOrderPra(record.id);

      const historyRows = (history ?? []).flatMap((delivery: any) =>
        delivery.DeliveryOrderDetail.map((detail: any) => ({
          id: detail.id,
          namabarangProductInvoice: detail.namabarangProductInvoice,
          quantity: detail.quantity,
          qtyKirim: detail.qtyKirim,
          deliveryOrder: {
            id: delivery.id,
            createdAt: delivery.createdAt,
            totalAmount: delivery.DeliveryOrderDetail.reduce(
              (total: number, item: any) => total + Number(item.total || 0),
              0
            ),
            au58: delivery.au58,
          },
        }))
      );

      setHistoryDelivery(historyRows);

      setOpen((open) => !open);
    } catch (error) {
      console.error('Gagal mengambil history pengiriman:', error);
      setHistoryDelivery([]);
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Pengiriman Pesanan (PRA)" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ModalDeliveryPoPra
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />

      <DrawerDeliveryOrderPra
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        dataSourceItems={dataSourceItems}
        dataSourceItemsSelected={dataSourceItemsSelected}
        setDataSourceItemsSelected={setDataSourceItemsSelected}
        purchaseOrderId={purchaseOrderId}
      />

      <Form
        layout="vertical"
        form={form}
        name="delivery-order-pra-add"
        initialValues={{
          remember: true,
        }}
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
              label="purchaseOrderId"
              style={{
                flex: 1,
                width: '100%',
                display: 'none',
              }}
              name="purchaseOrderId"
              rules={[
                {
                  required: true,
                  message: 'Masukan nilai purchaseOrderId!',
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

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
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nomor Pesanan" />
              </Form.Item>

              <Tooltip title="Pilih Pesanan">
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
              rules={[
                {
                  required: true,
                  message: 'Masukan nama customer!',
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
              getValueFromEvent={(date) => {
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => ({
                value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
              })}
            >
              <DatePicker
                prefix={<CalendarBlank />}
                disabled
                style={{ width: '100%' }}
                placeholder="Tanggal Pesanan"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label="Harga"
              name="totalAmount"
              rules={[
                {
                  required: true,
                  message: 'Masukan Total Amount!',
                },
              ]}
              extra={<TextTerbilang properti="totalAmount" form={form} />}
            >
              <InputNumber
                prefix={<DollarCircleFilled />}
                disabled
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{ width: '100%' }}
                placeholder="Total Amount"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
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
              <Input disabled prefix={<Note size={16} />} placeholder="Keterangan" />
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
              <Input disabled prefix={<Truck size={16} />} placeholder="Franco" />
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
              <Input disabled prefix={<CheckCircle size={16} />} placeholder="Status" />
            </Form.Item>

            <Form.Item label="No. AU58" name="au58Number">
              <Input placeholder="No. AU58" />
            </Form.Item>

            <Form.Item
              label="Tanggal AU58"
              name="au58Date"
              getValueFromEvent={(date) => {
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => ({
                value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
              })}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder="Tanggal AU58"
              />
            </Form.Item>
          </Col>
        </Row>

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
              disabled={!dataSourceItems.length}
              onClick={() =>
                setOpenDrawer({
                  open: true,
                })
              }
              style={{
                width: 150,
              }}
            >
              Pilih Barang
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={dataSourceItemsSelected}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>

        <Card
          title={<TitleCardItemsList title="History Pengiriman" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table
            bordered
            columns={[
              {
                title: 'No',
                key: 'no',
                align: 'center',
                render: (_: any, record: any, index: number) => {
                  const deliveryOrderId = record.deliveryOrder?.id ?? record.id;

                  const firstIndex = historyDelivery.findIndex(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  );

                  const totalRows = historyDelivery.filter(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  ).length;

                  if (index !== firstIndex) {
                    return {
                      children: null,
                      props: {
                        rowSpan: 0,
                      },
                    };
                  }

                  const uniqueDeliveryOrderIds = historyDelivery
                    .map((item: any) => item.deliveryOrder?.id ?? item.id)
                    .filter(
                      (id: string, index: number, array: string[]) => array.indexOf(id) === index
                    );

                  const no = uniqueDeliveryOrderIds.indexOf(deliveryOrderId) + 1;

                  return {
                    children: no,
                    props: {
                      rowSpan: totalRows,
                    },
                  };
                },
              },
              {
                title: 'Nama Barang',
                dataIndex: 'namabarangProductInvoice',
                key: 'namabarangProductInvoice',
              },
              {
                title: 'Jumlah Barang',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
              },
              {
                title: 'QTY',
                dataIndex: 'qtyKirim',
                key: 'qtyKirim',
                align: 'center',
              },
              {
                title: 'No AU58',
                key: 'documentNumber',
                align: 'center',
                render: (_: any, record: any, index: number) => {
                  const deliveryOrderId = record.deliveryOrder?.id ?? record.id;

                  const firstIndex = historyDelivery.findIndex(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  );

                  const totalRows = historyDelivery.filter(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  ).length;

                  if (index !== firstIndex) {
                    return {
                      children: null,
                      props: {
                        rowSpan: 0,
                      },
                    };
                  }

                  return {
                    children: record.deliveryOrder?.au58?.documentNumber ?? '-',
                    props: {
                      rowSpan: totalRows,
                    },
                  };
                },
              },
              {
                title: 'Tanggal AU58',
                key: 'au58Date',
                align: 'center',
                render: (_: any, record: any, index: number) => {
                  const deliveryOrderId = record.deliveryOrder?.id ?? record.id;

                  const firstIndex = historyDelivery.findIndex(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  );

                  const totalRows = historyDelivery.filter(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  ).length;

                  if (index !== firstIndex) {
                    return {
                      children: null,
                      props: {
                        rowSpan: 0,
                      },
                    };
                  }

                  const au58Date = record.deliveryOrder?.au58?.au58Date;

                  return {
                    children: au58Date ? dayjs(au58Date).format('DD/MM/YYYY') : '-',
                    props: {
                      rowSpan: totalRows,
                    },
                  };
                },
              },
              {
                title: 'Harga',
                key: 'totalAmount',
                align: 'center',
                render: (_: any, record: any, index: number) => {
                  const deliveryOrderId = record.deliveryOrder?.id ?? record.id;

                  const firstIndex = historyDelivery.findIndex(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  );

                  const totalRows = historyDelivery.filter(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  ).length;

                  if (index !== firstIndex) {
                    return {
                      children: null,
                      props: {
                        rowSpan: 0,
                      },
                    };
                  }

                  const totalAmount = Number(record.deliveryOrder?.totalAmount) || 0;

                  return {
                    children: (
                      <span>
                        Rp
                        {globalHelpers.currencyFormatter(totalAmount)}
                      </span>
                    ),
                    props: {
                      rowSpan: totalRows,
                    },
                  };
                },
              },
              {
                title: 'Created At',
                key: 'createdAt',
                align: 'center',
                render: (_: any, record: any, index: number) => {
                  const deliveryOrderId = record.deliveryOrder?.id ?? record.id;

                  const firstIndex = historyDelivery.findIndex(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  );

                  const totalRows = historyDelivery.filter(
                    (item: any) => (item.deliveryOrder?.id ?? item.id) === deliveryOrderId
                  ).length;

                  if (index !== firstIndex) {
                    return {
                      children: null,
                      props: {
                        rowSpan: 0,
                      },
                    };
                  }

                  return {
                    children: record.deliveryOrder?.createdAt
                      ? dayjs(record.deliveryOrder.createdAt).format('DD/MM/YYYY')
                      : '-',
                    props: {
                      rowSpan: totalRows,
                    },
                  };
                },
              },
            ]}
            dataSource={historyDelivery}
            pagination={false}
            rowKey="id"
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
