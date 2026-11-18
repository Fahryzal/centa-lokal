import { Card, Form, Flex, Table, Row, Col, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';
import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as SpbsInterfaces from '@pages/akuntansi/spbs/interface/SpbsInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import dayjs from 'dayjs';
import { Button, DatePicker, Input, Select } from '@/components/ui';
import { InputNumber } from 'antd';
import { Note, TagChevron, Truck, User, Calendar } from '@phosphor-icons/react';
import DrawerSpb from './DrawerSpb/DrawerSpb';
import ModalSpbsPo from './ModalSbsPo/ModalSbsPo';
import { SearchOutlined } from '@ant-design/icons';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { handleDate } from '@/utils/func/func';

export default function SpbsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [typeSalesSPb, setTypeSalesSPb] = useState<string>('');
  const [selectionStatus, setSelectionStatus] = useState<string>('');
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

  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({
    open: false,
  });
  const [dataLog, setDataLogs] = useState([]);

  const [dataSourceItems, setDataSourceItems] = useState<SpbsInterfaces.ItemsSPBType[]>([]);
  const [_dataSourceItemsSpb, setDataSourceItemsSpb] = useState<SpbsInterfaces.ItemsSPBType[]>([]);

  const onFinish = async (values: any) => {
    try {
      const valueSend = {
        noSpb: values.noSpb,
        tanggalPengiriman: handleDate(values.tanggalPengiriman),
        namaAtasan: values.namaAtasan,
        jabatanAtasan: values.jabatanAtasan,
        dikirimDengan: values.dikirimDengan,
        ...(typeSalesSPb === 'RA'
          ? {
              items: dataSourceItems.map((item) => ({
                productId: item.productId,
                qtyKirim: Number(String(item.qtyKirim ?? 0).replace(',', '.')),
              })),
            }
          : {}),
      };

      setLoading(true);
      await SpbsAxios.updateSpbs(id as string, valueSend);
      showNotification('success', 'Berhasil', 'Berhasil Ubah Data');
      setTimeout(() => {
        navigate('/spbs');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Ubah Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, SpbsAxios.fetchDataUnit, [unit.nama]);
  globalHooks.useFetchOptions(customer, setCustomer, SpbsAxios.fetchDataCustomer, [customer.name]);
  useEffect(() => {
    getDataCode();
    getDataSalesOrderPradId();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await SpbsAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const getDataSalesOrderPradId = async () => {
    try {
      if (id) {
        setLoading(true);

        const data = await SpbsAxios.fetchDataSpbsById(id);

        setTypeSalesSPb(data?.typeSalesSPb || '');
        setSelectionStatus(data?.selectionStatus || '');
        setDataSourceItems(data?.itemsSPB || []);

        const deliveryOrderId = data?.deliveryOrderId;

        const deliveryOrderData = deliveryOrderId
          ? await DeliveryOrderPraAxios.fetchDataDeliveryOrderPraById(deliveryOrderId)
          : null;

        const au58 = deliveryOrderData?.au58;

        form.setFieldsValue({
          orderNumber: data.orderNumber,
          customerId: data.customerName,
          date: globalHelpers.dateFormat(data.date),
          tanggalPengiriman: globalHelpers.dateFormat(data?.tanggalPengiriman),
          description: data.description,
          franco: data.franco,
          status: data.status,
          noSpb: data.noSpb,
          customerName: data.customerName,

          namaAtasan: data?.itemsSPB?.[0]?.namaAtasan || '',
          jabatanAtasan: data?.itemsSPB?.[0]?.jabatanAtasan || '',
          dikirimDengan: data?.itemsSPB?.[0]?.dikirimDengan || '',

          au58Id: au58?.documentNumber || '-',
          au58Date: au58?.au58Date ? dayjs(au58.au58Date).format('YYYY-MM-DD') : '-',
        });
      }

      setLoading(false);
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan!');
      setLoading(false);
    }
  };
  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  const columns: TableColumnsType<SpbsInterfaces.ItemsSPBType> = [
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
      render: (priceProduct) => {
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
      title: 'Stok',
      dataIndex: 'stockProduct',
      key: 'stockProduct',
      align: 'center',
      render: (stockProduct: number) => {
        return <span>{globalHelpers.currencyFormatter(stockProduct)}</span>;
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
    ...(typeSalesSPb === 'RA'
      ? [
          {
            title: 'Qty Kirim',
            dataIndex: 'qtyKirim',
            key: 'qtyKirim',
            align: 'center' as const,
            render: (_: number, record: SpbsInterfaces.ItemsSPBType) => (
              <InputNumber
                min="0.01"
                controls={false}
                stringMode
                decimalSeparator=","
                formatter={(value) =>
                  value === undefined || value === null ? '' : String(value).replace('.', ',')
                }
                parser={(value) => (value ?? '').replace(',', '.') as any}
                value={String(record.qtyKirim ?? 0)}
                style={{ width: 120 }}
                disabled={typeSalesSPb === 'RA' && selectionStatus === 'SELECTED'}
                onChange={(value) => {
                  const qtyKirim = Number(String(value ?? 0).replace(',', '.'));

                  setDataSourceItems((prev) =>
                    prev.map((item) =>
                      item.productId === record.productId
                        ? {
                            ...item,
                            qtyKirim: Number.isFinite(qtyKirim) ? qtyKirim : 0,
                          }
                        : item
                    )
                  );
                }}
              />
            ),
          },
        ]
      : []),
  ];

  const handleRowDoubleClick = async (record: SpbsInterfaces.DeliverySpbType) => {
    try {
      const data = await SpbsAxios.fetchDataStokLogByOrderNumber(record.purchaseOrder.orderNumber);
      setDataLogs(data);
      form.setFieldsValue({
        orderNumber: record.purchaseOrder.orderNumber,
        customerId: record.purchaseOrder.customerId,
        date: dayjs(record.purchaseOrder.date),
        description: record.purchaseOrder.description,
        franco: record.purchaseOrder.franco,
        status: record.purchaseOrder.status,
        // totalAmount: record.purchaseOrder.subtotalAmount,
        typeSalesSPb: record.typeSalesDelivery,
        purchaseOrderId: record.purchaseOrderId,
        customerName: record.purchaseOrder.customerName,
        deliveryOrderId: record.id,
      });
      setDataSourceItems(record.purchaseOrder.items as any);
      setOpen((open) => !open);
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  return (
    <Card
      title={<TitleCardDetail title="Edit SPBS" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerSpb
        dataSourceItems={dataSourceItems}
        openDrawer={openDrawer}
        seOpenDrawer={setOpenDrawer}
        dataLogs={dataLog}
        setDataSourceItemsSpb={setDataSourceItemsSpb}
      />
      <ModalSpbsPo open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />

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
              label="Nomor SPB"
              style={{ flex: 1, width: '100%' }}
              name="noSpb"
              rules={[{ required: true, message: 'Masukan nilai nomor SPB!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nomor SSPB"
              />
            </Form.Item>
            <Form.Item
              label="Pelanggan"
              name="customerName"
              rules={[{ required: true, message: 'Masukan nama customer!' }]}
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
            {typeSalesSPb === 'RA' && (
              <>
                <Form.Item label="No. AU58" name="au58Id">
                  <Input disabled />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Tanggal Pesanan"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Pesanan!' }]}
              getValueFromEvent={(date) => {
                // pastikan disimpan dalam format YYYY-MM-DD (string)
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => {
                // saat form memuat ulang data, ubah string ke dayjs
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
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Pengiriman"
              name="tanggalPengiriman"
              rules={[{ required: true, message: 'Masukan Tanggal Pengiriman!' }]}
              getValueFromEvent={(date) => {
                // pastikan disimpan dalam format YYYY-MM-DD (string)
                return date ? date.format('YYYY-MM-DD') : null;
              }}
              getValueProps={(value) => {
                // saat form memuat ulang data, ubah string ke dayjs
                return {
                  value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
                };
              }}
            >
              <DatePicker
                prefix={<Calendar />}
                style={{ width: '100%' }}
                placeholder="Tanggal Pengiriman"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item label="Nama Atasan" name="namaAtasan" style={{ width: '100%' }}>
              <Input placeholder="Nama Atasan" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                  placeholder="Nomor Pesanan"
                />
              </Form.Item>
              <Tooltip title="search">
                <Button
                  disabled
                  type="primary"
                  onClick={() => {
                    setOpen(true);
                    setDataSourceItemsSpb([]);
                  }}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>

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

            {typeSalesSPb === 'RA' && (
              <>
                <Form.Item label="Tanggal AU58" name="au58Date">
                  <Input disabled />
                </Form.Item>
              </>
            )}

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

            <Form.Item label="Dikirim Dengan" name="dikirimDengan" style={{ width: '100%' }}>
              <Input placeholder="Dikirim Dengan" />
            </Form.Item>
            <Form.Item label="Jabatan Atasan" name="jabatanAtasan" style={{ width: '100%' }}>
              <Input placeholder="Jabatan Atasan" />
            </Form.Item>
          </Col>
        </Row>
        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<SpbsInterfaces.ItemsSPBType>
            columns={columns}
            dataSource={dataSourceItems}
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
