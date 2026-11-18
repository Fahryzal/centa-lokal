import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Space, Table, Tag, message, Empty } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import dayjs from 'dayjs';

import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';

import type { SpbsType } from '@pages/akuntansi/spbs/interface/SpbsInterfaces';

interface DrawerInvoiceSpbProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  purchaseOrderId: string;
  orderNumber: string;
  selectedSpbs: SpbsType[];
  setSelectedSpbs: React.Dispatch<React.SetStateAction<SpbsType[]>>;
}

export default function DrawerInvoiceSpb({
  open,
  setOpen,
  purchaseOrderId,
  orderNumber,
  selectedSpbs,
  setSelectedSpbs,
}: Readonly<DrawerInvoiceSpbProps>) {
  const [data, setData] = useState<SpbsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoicedSpbIds, setInvoicedSpbIds] = useState<Set<string>>(new Set());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!purchaseOrderId) {
      setData([]);
      setInvoicedSpbIds(new Set());
      setSelectedRowKeys([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [spbResponse, invoiceResponse] = await Promise.all([
          SpbsAxios.fetchDataSpbs({
            page: 1,
            limit: 1000,
            typeSalesSPb: 'RA',
          }),
          InvoiceAxios.fetchDataInvoice({
            page: 1,
            limit: 1000,
            invoiceNumber: null,
            orderNumber: orderNumber || null,
            customerName: null,
            typeInvoice: 'RA',
          }),
        ]);

        const responseData = spbResponse?.data?.data;

        const rows: SpbsType[] = Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData)
            ? responseData
            : [];

        const filteredSpbs = rows.filter((spb: SpbsType) => {
          return (
            spb.purchaseOrderId === purchaseOrderId && spb.typeSalesSPb === 'RA' && !spb.deletedAt
          );
        });

        const invoiceRows = Array.isArray(invoiceResponse?.data) ? invoiceResponse.data : [];

        const alreadyInvoicedIds = new Set<string>();

        invoiceRows.forEach((invoice: any) => {
          if (invoice?.typeInvoice !== 'RA') {
            return;
          }

          if (invoice?.deletedAt) {
            return;
          }

          if (!Array.isArray(invoice?.InvoiceDetail)) {
            return;
          }

          invoice.InvoiceDetail.forEach((detail: any) => {
            if (detail?.spbId) {
              alreadyInvoicedIds.add(String(detail.spbId));
            }
          });
        });

        setData(filteredSpbs);
        setInvoicedSpbIds(alreadyInvoicedIds);

        const existingSelectedIds = selectedSpbs
          .filter(
            (spb) =>
              spb.purchaseOrderId === purchaseOrderId &&
              filteredSpbs.some((item) => item.id === spb.id) &&
              !alreadyInvoicedIds.has(spb.id)
          )
          .map((spb) => spb.id);

        setSelectedRowKeys([...Array.from(alreadyInvoicedIds), ...existingSelectedIds]);
      } catch (error) {
        console.error('Gagal mengambil data SPB Invoice:', error);
        message.error('Gagal mengambil data SPB Invoice');
        setData([]);
        setInvoicedSpbIds(new Set());
        setSelectedRowKeys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, purchaseOrderId, orderNumber]);

  const columns: TableColumnsType<SpbsType> = [
    {
      title: 'Nomor SPB',
      dataIndex: 'noSpb',
      key: 'noSpb',
      width: 160,
      align: 'center',
    },
    {
      title: 'Nomor Pesanan',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 160,
      align: 'center',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
      width: 220,
      render: (value: string | null) => value || '-',
    },
    {
      title: 'Tanggal Pengiriman',
      dataIndex: 'tanggalPengiriman',
      key: 'tanggalPengiriman',
      width: 150,
      align: 'center',
      render: (value: Date | string | null) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Tanggal Pesanan',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      align: 'center',
      render: (value: Date | string | null) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: (value: string | null) => value || '-',
    },
    {
      title: 'Franco',
      dataIndex: 'franco',
      key: 'franco',
      width: 140,
      align: 'center',
      render: (value: string | null) => value || '-',
    },
    {
      title: 'Status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (_value: unknown, record: SpbsType) => {
        if (invoicedSpbIds.has(record.id)) {
          return <Tag color="green">Sudah Invoice</Tag>;
        }

        return <Tag color="blue">{record.status || '-'}</Tag>;
      },
    },
  ];

  const rowSelection: TableProps<SpbsType>['rowSelection'] = {
    selectedRowKeys,

    getCheckboxProps: (record) => ({
      disabled: invoicedSpbIds.has(record.id),
    }),

    onChange: (keys) => {
      const selectedIds = keys.map((key) => String(key));

      const selectedNewSpbIds = data
        .filter((spb) => selectedIds.includes(spb.id) && !invoicedSpbIds.has(spb.id))
        .map((spb) => spb.id);

      setSelectedRowKeys([...Array.from(invoicedSpbIds), ...selectedNewSpbIds]);
    },
  };

  const hasSelectedNewSpb = useMemo(() => {
    return selectedRowKeys.some((key) => !invoicedSpbIds.has(String(key)));
  }, [selectedRowKeys, invoicedSpbIds]);

  const handleOk = async () => {
    const selectedNewSpbs = data.filter(
      (spb) => selectedRowKeys.includes(spb.id) && !invoicedSpbIds.has(spb.id)
    );

    if (!selectedNewSpbs.length) {
      message.warning('Silakan pilih minimal satu SPB baru');
      return;
    }

    const invalidSpb = selectedNewSpbs.some((spb) => spb.purchaseOrderId !== purchaseOrderId);

    if (invalidSpb) {
      message.error('SPB harus berasal dari Nomor Pesanan yang sama');
      return;
    }

    try {
      const selectedSpbIds = selectedNewSpbs.map((spb) => spb.id);

      const spbsWithItems = await InvoiceAxios.fetchInvoiceSpbItems(selectedSpbIds);

      if (!Array.isArray(spbsWithItems) || spbsWithItems.length === 0) {
        message.error('Data SPB beserta barang tidak ditemukan');
        return;
      }

      const invalidReturnedSpb = spbsWithItems.some(
        (spb: SpbsType) => spb.purchaseOrderId !== purchaseOrderId
      );

      if (invalidReturnedSpb) {
        message.error('Data SPB tidak sesuai dengan Nomor Pesanan');
        return;
      }

      setSelectedSpbs(spbsWithItems);

      message.success(`${selectedNewSpbs.length} SPB berhasil dipilih`);

      setOpen(false);
    } catch (error) {
      console.error('Gagal mengambil item SPB untuk Invoice:', error);
      message.error('Gagal mengambil barang dari SPB');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;

    return data.slice(start, end);
  }, [data, pagination]);

  return (
    <Drawer
      title={
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Pilih SPB
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: '#666',
              marginTop: 4,
            }}
          >
            Nomor Pesanan: {orderNumber || '-'}
          </div>
        </div>
      }
      placement="right"
      width={1100}
      open={open}
      onClose={handleClose}
      destroyOnClose={false}
      extra={
        <Space>
          <Button onClick={handleClose}>Cancel</Button>

          <Button type="primary" onClick={handleOk} disabled={!hasSelectedNewSpb}>
            OK
          </Button>
        </Space>
      }
    >
      <Table<SpbsType>
        bordered
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={paginatedData}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{
          x: 'max-content',
        }}
        locale={{
          emptyText: (
            <Empty
              description={
                purchaseOrderId
                  ? 'Belum ada SPB untuk Nomor Pesanan ini'
                  : 'Pilih Nomor Pesanan terlebih dahulu'
              }
            />
          ),
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data.length,
          showSizeChanger: false,
          showQuickJumper: true,
          onChange: (page) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
            }));
          },
        }}
      />
    </Drawer>
  );
}
