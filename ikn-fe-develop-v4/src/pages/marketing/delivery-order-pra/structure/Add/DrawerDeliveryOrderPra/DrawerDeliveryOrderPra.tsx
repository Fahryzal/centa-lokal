import { Button, Drawer, InputNumber, Space, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';

export default function DrawerDeliveryOrderPra({
  openDrawer,
  setOpenDrawer,
  dataSourceItems,
  dataSourceItemsSelected,
  setDataSourceItemsSelected,
  purchaseOrderId,
}: Readonly<{
  openDrawer: { open: boolean };
  setOpenDrawer: Function;
  dataSourceItems: any[];
  dataSourceItemsSelected: any[];
  setDataSourceItemsSelected: Function;
  purchaseOrderId: string;
}>) {
  const [selected, setSelected] = useState<any[]>([]);
  const [totalQtyKirim, setTotalQtyKirim] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!openDrawer.open) {
      return;
    }

    setSelected(dataSourceItemsSelected);
  }, [openDrawer.open, dataSourceItemsSelected]);

  useEffect(() => {
    if (!openDrawer.open || !purchaseOrderId) {
      return;
    }

    const getHistory = async () => {
      try {
        const history = await DeliveryOrderPraAxios.fetchHistoryDeliveryOrderPra(purchaseOrderId);

        const totals: Record<string, number> = {};

        (history ?? []).forEach((deliveryOrder: any) => {
          (deliveryOrder?.DeliveryOrderDetail ?? []).forEach((detail: any) => {
            const itemId = detail.purchaseOrderItemId;

            if (!itemId) {
              return;
            }

            totals[itemId] = (totals[itemId] ?? 0) + Number(detail.qtyKirim ?? 0);
          });
        });

        setTotalQtyKirim(totals);
      } catch (error) {
        setTotalQtyKirim({});
      }
    };

    getHistory();
  }, [openDrawer.open, purchaseOrderId]);

  const getTersisa = (record: any) => {
    const quantity = Number(record.quantity ?? 0);
    const sudahDikirim = Number(totalQtyKirim[record.id] ?? 0);

    return Math.max(quantity - sudahDikirim, 0);
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Nama Barang',
      dataIndex: 'namabarangProductInvoice',
      key: 'namabarangProductInvoice',
    },
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarangProduct',
      key: 'kodeBarangProduct',
    },
    {
      title: 'Kategori Brang',
      dataIndex: 'kategoriProduct',
      key: 'kategoriProduct',
    },
    {
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tersisa',
      key: 'tersisa',
      render: (_: any, record: any) => {
        return getTersisa(record);
      },
    },
    {
      title: 'Qty Kirim',
      dataIndex: 'qtyKirim',
      key: 'qtyKirim',
      render: (_: any, record: any) => {
        const selectedItem = selected.find((item) => item.id === record.id);

        if (!selectedItem) {
          return null;
        }

        const tersisa = getTersisa(record);

        return (
          <InputNumber
            min={0.01}
            max={tersisa}
            value={selectedItem.qtyKirim ?? 1}
            controls={false}
            stringMode
            decimalSeparator=","
            formatter={(value) =>
              value === undefined || value === null ? '' : String(value).replace('.', ',')
            }
            parser={(value) => (value ?? '').replace(',', '.') as any}
            style={{ width: 100 }}
            onChange={(value) => {
              const qtyKirim =
                value === null || value === undefined || value === ''
                  ? 0
                  : Number(String(value).replace(',', '.'));

              setSelected((prev) =>
                prev.map((item) =>
                  item.id === record.id
                    ? {
                        ...item,
                        qtyKirim: Math.min(qtyKirim, tersisa),
                      }
                    : item
                )
              );
            }}
          />
        );
      },
    },
    {
      title: 'Satuan',
      dataIndex: 'satuanProduct',
      key: 'satuanProduct',
    },
    {
      title: 'Spesifikasi',
      dataIndex: 'spesifikasiProduct',
      key: 'spesifikasiProduct',
    },
    {
      title: 'Harga',
      dataIndex: 'priceProduct',
      key: 'priceProduct',
      render: (value: number) => Number(value || 0).toLocaleString('id-ID'),
    },
  ];

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys: selected.map((item) => item.id),

    onChange: (_selectedRowKeys, selectedRows) => {
      setSelected(
        selectedRows.map((item: any) => {
          const existing = selected.find((selectedItem) => selectedItem.id === item.id);

          return {
            ...item,
            qtyKirim: existing?.qtyKirim ?? 1,
          };
        })
      );
    },
  };

  const onClose = () => {
    setOpenDrawer({
      open: false,
    });
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      return;
    }

    const invalid = selected.some((item) => {
      const tersisa = getTersisa(item);
      const qtyKirim = Number(String(item.qtyKirim ?? 0).replace(',', '.'));

      return !Number.isFinite(qtyKirim) || qtyKirim <= 0 || qtyKirim > tersisa;
    });

    if (invalid) {
      return;
    }

    setDataSourceItemsSelected(selected);
    onClose();
  };

  return (
    <Drawer
      title="Pilih Barang"
      placement="right"
      width={600}
      open={openDrawer.open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>

          <Button type="primary" onClick={handleSubmit}>
            OK
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSourceItems}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Drawer>
  );
}
