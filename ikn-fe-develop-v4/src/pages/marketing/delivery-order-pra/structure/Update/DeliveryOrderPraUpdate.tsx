import {
  CalendarBlank,
  CheckCircle,
  FilePdf,
  Note,
  TagChevron,
  Truck,
  User,
} from '@phosphor-icons/react';

import { Card, Form, Row, Col, Flex, DatePicker, Input, Table, InputNumber, Tooltip } from 'antd';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';
import * as DeliveryOrderPraInterfaces from '@pages/marketing/delivery-order-pra/interface/DeliveryOrderPraInterfaces';

import * as globalHelpers from '@/utils/helper';

import dayjs from 'dayjs';

import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';

import { DollarCircleFilled } from '@ant-design/icons';

import { showNotification } from '@/contexts/services/notificationService';

interface DeliveryItem {
  id?: string;
  purchaseOrderItemId?: string;
  productId?: string;
  kodeBarangProduct?: string;
  kodeBarang?: string;
  namabarangProduct?: string;
  namabarangProductInvoice?: string;
  priceProduct?: number;
  price?: number;
  satuanProduct?: string;
  satuan?: string;
  spesifikasiProduct?: string;
  spesifikasi?: string;
  unitProduct?: string;
  unit?: string;
  quantity?: number | null;
  qtyKirim?: number | null;
  total?: number;
  unitPrice?: number;
  maxQtyKirim?: number;
  qtyKirimDOLain?: number;
  isQtyEditable?: boolean;
  itemsSPB?: any[];
}

export default function DeliveryOrderPraUpdate() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [dataSourceItems, setDataSourceItems] = useState<DeliveryItem[]>([]);

  const [dataDeliveryOrder, setDataDeliveryOrder] = useState<any>(null);

  const [isNewData, setIsNewData] = useState<boolean>(false);

  const [canEditQty, setCanEditQty] = useState<boolean>(false);

  const getDataDeliveryOrderById = async () => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID Pengiriman tidak ditemukan');
      return;
    }

    try {
      setLoading(true);

      const data = await DeliveryOrderPraAxios.fetchDataDeliveryOrderPraById(id);

      setDataDeliveryOrder(data);

      const purchaseOrder = data?.purchaseOrder;

      const deliveryOrderDetails = data?.DeliveryOrderDetail ?? [];

      const history = purchaseOrder?.id
        ? await DeliveryOrderPraAxios.fetchHistoryDeliveryOrderPra(purchaseOrder.id)
        : [];

      const newData = deliveryOrderDetails.length > 0;

      setIsNewData(newData);

      const usedBySpb = deliveryOrderDetails.some(
        (detail: any) => Array.isArray(detail?.itemsSPB) && detail.itemsSPB.length > 0
      );

      setCanEditQty(newData && !usedBySpb);

      const qtyFromOtherDO = new Map<string, number>();

      if (newData) {
        const otherDOs = (history ?? []).filter((order: any) => order.id !== data.id);

        for (const order of otherDOs) {
          const details = order?.DeliveryOrderDetail ?? [];

          for (const detail of details) {
            const purchaseOrderItemId = detail?.purchaseOrderItemId;

            if (!purchaseOrderItemId) {
              continue;
            }

            const current = qtyFromOtherDO.get(purchaseOrderItemId) ?? 0;

            qtyFromOtherDO.set(purchaseOrderItemId, current + Number(detail?.qtyKirim ?? 0));
          }
        }
      }

      if (newData) {
        const dataNew: DeliveryItem[] = deliveryOrderDetails.map((detail: any) => {
          const poItem = detail?.PurchaseOrderItem ?? {};

          const product = poItem?.product ?? detail?.MasterBarangJadi ?? {};

          const qtyKirim = Number(detail?.qtyKirim ?? 0);

          const quantityPO = Number(poItem?.quantity ?? detail?.quantity ?? 0);

          const qtyKirimDOLain = qtyFromOtherDO.get(detail?.purchaseOrderItemId ?? poItem?.id) ?? 0;

          const maxQtyKirim = Math.max(quantityPO - qtyKirimDOLain, 0);

          const priceProduct = Number(
            detail?.priceProduct ?? poItem?.priceProduct ?? product?.nilaiSatuan ?? 0
          );

          return {
            ...detail,

            purchaseOrderItemId: detail?.purchaseOrderItemId ?? poItem?.id,

            productId: detail?.productId ?? poItem?.productId ?? product?.id,

            kodeBarangProduct:
              detail?.kodeBarangProduct ?? poItem?.kodeBarangProduct ?? product?.kodeBarang ?? '-',

            namabarangProduct:
              detail?.namabarangProduct ?? poItem?.namabarangProduct ?? product?.namaBarang ?? '-',

            namabarangProductInvoice:
              detail?.namabarangProductInvoice ?? poItem?.namabarangProductInvoice ?? '-',

            priceProduct,

            price: priceProduct,

            satuanProduct: detail?.satuanProduct ?? poItem?.satuanProduct ?? product?.satuan ?? '-',

            satuan: detail?.satuanProduct ?? poItem?.satuanProduct ?? product?.satuan ?? '-',

            spesifikasiProduct: detail?.spesifikasiProduct ?? poItem?.spesifikasiProduct ?? '-',

            spesifikasi: detail?.spesifikasiProduct ?? poItem?.spesifikasiProduct ?? '-',

            unitProduct: detail?.unitProduct ?? poItem?.unitProduct ?? product?.Unit ?? '-',

            unit: detail?.unitProduct ?? poItem?.unitProduct ?? product?.Unit ?? '-',

            quantity: quantityPO,

            qtyKirim,

            qtyKirimDOLain,

            maxQtyKirim,

            total: qtyKirim * priceProduct,

            itemsSPB: detail?.itemsSPB ?? [],
          };
        });

        setDataSourceItems(dataNew);
      } else {
        const dataOld: DeliveryItem[] = (purchaseOrder?.items ?? []).map((item: any) => {
          const product = item?.product ?? {};

          const quantity = Number(item?.quantity ?? 0);

          const priceProduct = Number(item?.priceProduct ?? product?.nilaiSatuan ?? 0);

          return {
            ...item,

            purchaseOrderItemId: item?.id,

            productId: item?.productId ?? product?.id,

            kodeBarangProduct: item?.kodeBarangProduct ?? product?.kodeBarang ?? '-',

            namabarangProduct: item?.namabarangProduct ?? product?.namaBarang ?? '-',

            namabarangProductInvoice: item?.namabarangProductInvoice ?? '-',

            priceProduct,

            price: priceProduct,

            satuanProduct: item?.satuanProduct ?? product?.satuan ?? '-',

            satuan: item?.satuanProduct ?? product?.satuan ?? '-',

            spesifikasiProduct: item?.spesifikasiProduct ?? '-',

            spesifikasi: item?.spesifikasiProduct ?? '-',

            unitProduct: item?.unitProduct ?? product?.Unit ?? '-',

            unit: item?.unitProduct ?? product?.Unit ?? '-',

            quantity,

            qtyKirim: null,

            total: quantity * priceProduct,

            isQtyEditable: false,
          };
        });

        setDataSourceItems(dataOld);
      }

      form.setFieldsValue({
        orderNumber: purchaseOrder?.orderNumber ?? '-',

        customerName: purchaseOrder?.customer?.name ?? purchaseOrder?.customerName ?? '-',

        date: purchaseOrder?.date ? dayjs(purchaseOrder.date) : null,

        description: purchaseOrder?.description ?? '-',

        franco: purchaseOrder?.franco ?? '-',

        status: data?.status ?? '-',

        totalAmount: newData
          ? Number(data?.totalAmount ?? 0)
          : Number(purchaseOrder?.subtotalAmount ?? 0),

        au58Number: data?.au58?.documentNumber ?? '',

        au58Date: data?.au58?.au58Date ? dayjs(data.au58.au58Date) : null,
      });
    } catch (error) {
      console.error('Gagal mengambil data pengiriman:', error);

      showNotification('error', 'Gagal', 'Gagal mengambil data pengiriman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataDeliveryOrderById();
  }, [id]);

  const totalQtyKirim = useMemo(() => {
    if (!isNewData) {
      return 0;
    }

    return dataSourceItems.reduce((total, item) => total + Number(item.qtyKirim ?? 0), 0);
  }, [dataSourceItems, isNewData]);

  const totalAmount = useMemo(() => {
    if (!isNewData) {
      return Number(dataDeliveryOrder?.purchaseOrder?.subtotalAmount ?? 0);
    }

    return dataSourceItems.reduce((total, item) => {
      const qty = Number(item.qtyKirim ?? 0);

      const price = Number(item.priceProduct ?? item.price ?? 0);

      return total + qty * price;
    }, 0);
  }, [dataSourceItems, isNewData, dataDeliveryOrder]);

  const handleChangeQty = (
    purchaseOrderItemId: string,
    value: number | string | null,
    maxQty: number
  ) => {
    if (!canEditQty) {
      return;
    }

    let newQty = value === null || value === '' ? 0 : Number(String(value).replace(',', '.'));

    if (!Number.isFinite(newQty) || newQty < 0) {
      newQty = 0;
    }

    if (newQty > maxQty) {
      newQty = maxQty;
    }

    setDataSourceItems((prev) =>
      prev.map((item) => {
        if (item.purchaseOrderItemId !== purchaseOrderItemId) {
          return item;
        }

        const price = Number(item.priceProduct ?? item.price ?? 0);

        return {
          ...item,
          qtyKirim: newQty,
          total: newQty * price,
        };
      })
    );
  };

  const onFinish = async (values: any) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID Pengiriman tidak ditemukan');

      return;
    }

    try {
      setLoading(true);

      if (!isNewData) {
        const payload: DeliveryOrderPraInterfaces.UpdateDeliveryOrderPraPayload = {
          au58Number: values.au58Number || null,

          au58Date: values.au58Date ? dayjs(values.au58Date).format('YYYY-MM-DD') : null,
        };

        await DeliveryOrderPraAxios.updateDeliveryOrderPra(id, payload);

        showNotification('success', 'Berhasil', 'Berhasil Mengubah Data AU58');

        setTimeout(() => {
          navigate('/delivery-order-pra');
        }, 1500);

        return;
      }

      let items: DeliveryOrderPraInterfaces.UpdateDeliveryOrderPraItemPayload[] | undefined;

      if (canEditQty) {
        items = dataSourceItems.map((item) => ({
          purchaseOrderItemId: String(item.purchaseOrderItemId),
          qtyKirim: Number(String(item.qtyKirim ?? 0).replace(',', '.')),
        }));

        const invalidItem = items.find((item) => !item.purchaseOrderItemId || item.qtyKirim <= 0);

        if (invalidItem) {
          showNotification('error', 'Gagal', 'Qty Kirim setiap barang harus lebih dari 0');

          return;
        }
      }

      const payload: DeliveryOrderPraInterfaces.UpdateDeliveryOrderPraPayload = {
        au58Number: values.au58Number || null,

        au58Date: values.au58Date ? dayjs(values.au58Date).format('YYYY-MM-DD') : null,

        ...(items ? { items } : {}),
      };

      console.log('PAYLOAD UPDATE DELIVERY ORDER RA:', payload);

      await DeliveryOrderPraAxios.updateDeliveryOrderPra(id, payload);

      showNotification(
        'success',
        'Berhasil',
        canEditQty ? 'Berhasil Mengubah AU58 dan Qty Kirim' : 'Berhasil Mengubah Data AU58'
      );

      setTimeout(() => {
        navigate('/delivery-order-pra');
      }, 1500);
    } catch (error: any) {
      console.error('Gagal mengubah Delivery Order:', error);

      const message = error?.response?.data?.message;

      showNotification(
        'error',
        'Gagal',
        Array.isArray(message) ? message.join(', ') : message || 'Gagal Mengubah Delivery Order'
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: any[] = [
    {
      title: 'Kode Barang',
      key: 'kodeBarangProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) =>
        record.kodeBarangProduct ?? record.kodeBarang ?? '-',
    },

    {
      title: 'Nama Barang',
      key: 'namabarangProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) =>
        record.namabarangProductInvoice ?? record.namabarangProduct ?? '-',
    },

    {
      title: 'Harga',
      key: 'priceProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) => (
        <span>
          Rp
          {globalHelpers.currencyFormatter(Number(record.priceProduct ?? record.price ?? 0))}
        </span>
      ),
    },

    {
      title: 'Satuan',
      key: 'satuanProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) => record.satuanProduct ?? record.satuan ?? '-',
    },

    {
      title: 'Spesifikasi',
      key: 'spesifikasiProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) =>
        record.spesifikasiProduct ?? record.spesifikasi ?? '-',
    },

    {
      title: 'Unit',
      key: 'unitProduct',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) => record.unitProduct ?? record.unit ?? '-',
    },

    {
      title: 'Qty PO',
      key: 'quantity',
      align: 'center' as const,
      render: (_: any, record: DeliveryItem) => (
        <span>{globalHelpers.currencyFormatter(Number(record.quantity ?? 0))}</span>
      ),
    },

    ...(isNewData
      ? [
          {
            title: 'Qty Kirim',
            key: 'qtyKirim',
            align: 'center' as const,
            width: 180,
            render: (_: any, record: DeliveryItem) => {
              const maxQty = Number(record.maxQtyKirim ?? 0);

              const currentQty = Number(record.qtyKirim ?? 0);

              if (!canEditQty) {
                return <span>{globalHelpers.currencyFormatter(currentQty)}</span>;
              }

              return (
                <Tooltip title={`Maksimal ${maxQty}`}>
                  <InputNumber
                    min="0.01"
                    max={String(maxQty)}
                    controls={false}
                    stringMode
                    decimalSeparator=","
                    formatter={(value) =>
                      value === undefined || value === null ? '' : String(value).replace('.', ',')
                    }
                    parser={(value) => (value ?? '').replace(',', '.') as any}
                    value={String(record.qtyKirim ?? 0)}
                    disabled={maxQty <= 0}
                    style={{ width: 130 }}
                    onChange={(value) =>
                      handleChangeQty(String(record.purchaseOrderItemId), value, maxQty)
                    }
                  />
                </Tooltip>
              );
            },
          },

          {
            title: 'Total',
            key: 'total',
            align: 'center' as const,
            render: (_: any, record: DeliveryItem) => (
              <span>
                Rp
                {globalHelpers.currencyFormatter(Number(record.total ?? 0))}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card
      title={<TitleCardEdit title="Edit Pengiriman Pesanan (PRA)" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="edit-delivery-order-pra"
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
            <Form.Item label="Nomor Pesanan" name="orderNumber">
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<TagChevron size={16} />}
                placeholder="Nomor Pesanan"
              />
            </Form.Item>

            <Form.Item label="Pelanggan" name="customerName">
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<User size={16} />}
                placeholder="Pelanggan"
              />
            </Form.Item>

            <Form.Item label="Tanggal Order" name="date">
              <DatePicker
                disabled
                prefix={<CalendarBlank />}
                style={{
                  width: '100%',
                }}
                placeholder="Tanggal Order"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label="Harga Total"
              name="totalAmount"
              extra={<TextTerbilang properti="totalAmount" form={form} />}
            >
              <InputNumber
                disabled
                prefix={<DollarCircleFilled />}
                controls={false}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{
                  width: '100%',
                }}
                placeholder="Total Amount"
                value={totalAmount}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Keterangan" name="description">
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<Note size={16} />}
                placeholder="Keterangan"
              />
            </Form.Item>

            <Form.Item label="Franco" name="franco">
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<Truck size={16} />}
                placeholder="Franco"
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Input
                disabled
                style={{
                  width: '100%',
                }}
                prefix={<CheckCircle size={16} />}
                placeholder="Status"
              />
            </Form.Item>

            <Form.Item label="No. AU58" name="au58Number">
              <Input
                style={{
                  width: '100%',
                }}
                prefix={<FilePdf size={16} />}
                placeholder="No. AU58"
              />
            </Form.Item>

            <Form.Item label="Tanggal AU58" name="au58Date">
              <DatePicker
                style={{
                  width: '100%',
                }}
                format="YYYY-MM-DD"
                placeholder="Tanggal AU58"
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title={isNewData ? 'Detail Pengiriman' : 'Pesanan Item'} />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table<DeliveryItem>
            rowKey={(record) => String(record.purchaseOrderItemId ?? record.id ?? record.productId)}
            columns={columns}
            dataSource={dataSourceItems}
            loading={loading}
            pagination={false}
            scroll={{
              x: 'max-content',
            }}
          />
        </Card>

        {isNewData && (
          <Card
            size="small"
            style={{
              background: '#fafafa',
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <strong>Total Qty Kirim</strong>

                <div
                  style={{
                    fontSize: 18,
                    marginTop: 5,
                  }}
                >
                  {globalHelpers.currencyFormatter(totalQtyKirim)}
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <strong>Total Nilai Pengiriman</strong>

                <div
                  style={{
                    fontSize: 18,
                    marginTop: 5,
                  }}
                >
                  Rp
                  {globalHelpers.currencyFormatter(totalAmount)}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Flex gap="small">
          <Buttonback loading={loading} />

          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
