import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Pagination, Tag, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useRef } from 'react';
import { Space, Modal } from 'antd';
import { DeleteOutlined, UndoOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter, hasAccessButton, umurPiutang } from '@/utils/helper';
import { ButtonDetailGroup, ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import RenderInput from '@pages/marketing/invoice/structure/Components/RenderInput';
import { showNotification } from '@/contexts/services/notificationService';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { useState } from '@/hooks/React/useState';
import { Button, Card } from '@/components/ui';
import { useDropInvoice, useInvoice } from './hooks/useInvoice';
import { handleMessageError } from '@/utils/func/func';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { useAccess } from '@/contexts/AccessContext';

// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex =
  | keyof InvoiceInterfaces.Datum
  | 'orderNumber'
  | 'customerName'
  | 'phone'
  | 'date'
  | 'description'
  | 'franco';

export default function InvoicePage() {
  const navigate = useAppNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    date: null,
    invoiceNumber: null,
    status: null,
    orderNumber: null,
    customerName: null,
    phone: null,
    description: null,
    franco: null,
    totalAmount: null,
    amountWithTax: null,
    typeInvoice: 'RA',
  });
  const { data, isLoading, isError } = useInvoice(params as any);
  const drop = useDropInvoice();
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [selectedDropId, setSelectedDropId] = useState<string | null>(null);

  const openDropModal = (id: string) => {
    setSelectedDropId(id);
    setDropModalOpen(true);
  };

  const confirmDrop = async () => {
    if (!selectedDropId) return;

    await handleDrop(selectedDropId);

    setDropModalOpen(false);
    setSelectedDropId(null);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setParams((prev) => ({ ...prev, page: 1, [dataIndex]: selectedKeys[0] }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    clearFilters();
    setSearchText('');
    confirm();
    setParams((prev) => ({ ...prev, [dataIndex]: null }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<InvoiceInterfaces.Datum> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
          background: 'white',
          zIndex: 99999,
          position: 'relative',
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {RenderInput(dataIndex, setSelectedKeys, selectedKeys, handleSearch, searchInput)}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<MagnifyingGlass />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <MagnifyingGlass style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const getInvoiceSpb = (record: InvoiceInterfaces.Datum) => {
    return record.spb ?? (record.InvoiceDetail?.[0] as any)?.SPB;
  };

  const handleDetail = (id: string) => {
    navigate(`/invoice/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/invoice/edit/${id}`);
  };

  const handleDrop = async (id: string) => {
    try {
      await drop.mutateAsync(id);
      showNotification('success', 'Berhasil', 'Invoice berhasil dihapus');
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<InvoiceInterfaces.Datum> => [
    {
      title: 'Nomor Invoice ',
      dataIndex: 'invoiceNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceNumber'),
    },
    {
      title: 'Nomor Pesanan',
      dataIndex: ['spb', 'purchaseOrder', 'orderNumber'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.orderNumber || '-';
      },
    },
    {
      title: 'Nama Pemesan',
      dataIndex: ['spb', 'purchaseOrder', 'customerName'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.customerName || '-';
      },
    },
    {
      title: 'Nomor Telphon/Whatsap',
      dataIndex: ['spb', 'purchaseOrder', 'customer', 'phone'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('phone'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.customer?.phone || '-';
      },
    },
    {
      title: 'Tanggal Pesanan',
      dataIndex: ['spb', 'purchaseOrder', 'date'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.date ? dayjs(spb.purchaseOrder.date).format('DD MMM YYYY') : '-';
      },
    },
    {
      title: 'Tanggal Pembuatan Invoice',
      dataIndex: 'invoiceDate',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceDate'),
      render: (invoiceDate: Date) => <span>{dayjs(invoiceDate).format('DD MMM YYYY')}</span>,
    },
    {
      title: 'Umur Piutang',
      dataIndex: 'invoiceDate',
      width: 200,
      align: 'center',
      render: (invoiceDate: Date, record: InvoiceInterfaces.Datum) => (
        <span>{!record.paymentDate ? umurPiutang(invoiceDate) : '-'}</span>
      ),
    },
    {
      title: 'Deskripsi',
      dataIndex: ['spb', 'purchaseOrder', 'description'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.description || '-';
      },
    },
    {
      title: 'Franco',
      dataIndex: ['spb', 'purchaseOrder', 'franco'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('franco'),
      render: (_: unknown, record: InvoiceInterfaces.Datum) => {
        const spb = getInvoiceSpb(record);
        return spb?.purchaseOrder?.franco || '-';
      },
    },
    {
      title: 'Harga',
      dataIndex: 'totalAmount',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('totalAmount'),
      render: (totalAmount: number) => {
        return <span>Rp{currencyFormatter(totalAmount || 0)}</span>;
      },
    },
    {
      title: 'Pajak',
      width: 200,
      align: 'center',
      render: (_: number, record: InvoiceInterfaces.Datum) => {
        const tax =
          record.amountTax !== null && record.amountTax !== undefined
            ? Number(record.amountTax || 0)
            : Number(record.amountWithTax || 0) - Number(record.totalAmount || 0);

        return <span>Rp{currencyFormatter(tax || 0)}</span>;
      },
    },
    {
      title: 'Total Harga',
      width: 200,
      align: 'center',
      render: (_: number, record: InvoiceInterfaces.Datum) => {
        const total =
          record.amountTax !== null && record.amountTax !== undefined
            ? Number(record.amountWithTax || 0)
            : Number(record.amountWithTax || 0);

        return <span>Rp{currencyFormatter(total || 0)}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('status'),
      render: (status: string) => {
        const color: any = {
          PENDING: 'orange',
          LUNAS: 'green',
          HUTANG: 'error',
          VERIFED: 'cyan',
        };
        return <Tag color={color[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (id: string) => (
        <Space>
          <ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/invoice', 'view')}
            onClick={() => handleDetail(id)}
          />

          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/invoice', 'edit')}
            onClick={() => handleEdit(id)}
          />

          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => openDropModal(id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isError) {
    return <AlertCustome />;
  }
  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }}
        linkAdd={hasAccessButton(access, '/invoice', 'add') ? '/invoice/add' : ''}
        titleCard="Data Invoice"
        loading={isLoading}
        baseColumns={baseColumns(access)}
        dataSource={data?.data}
        key={access as any}
      />
      <Card
        style={{
          backgroundColor: 'white',
          padding: 0,
          textAlign: 'center',
          marginTop: 10,
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Pagination
          showLessItems
          key={data?.totalData}
          defaultCurrent={data?.page}
          total={data?.totalData}
          defaultPageSize={data?.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setParams((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
      <Modal
        open={dropModalOpen}
        onCancel={() => {
          setDropModalOpen(false);
          setSelectedDropId(null);
        }}
        centered
        footer={null}
        width={460}
        closable={true}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '16px 10px 8px',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fff7e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ExclamationCircleFilled
              style={{
                fontSize: 32,
                color: '#fa8c16',
              }}
            />
          </div>

          <h2
            style={{
              margin: '0 0 10px',
              fontSize: 22,
              fontWeight: 600,
              color: '#1f1f1f',
            }}
          >
            Drop Invoice?
          </h2>

          <p
            style={{
              margin: '0 auto',
              maxWidth: 380,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#666',
            }}
          >
            Apakah anda yakin untuk menghapus data invoice ini?
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginTop: 28,
            }}
          >
            <Button
              size="large"
              onClick={() => {
                setDropModalOpen(false);
                setSelectedDropId(null);
              }}
              style={{
                minWidth: 110,
                borderRadius: 8,
              }}
            >
              Batal
            </Button>

            <Button
              danger
              type="primary"
              size="large"
              icon={<UndoOutlined />}
              loading={drop.isPending}
              onClick={confirmDrop}
              style={{
                minWidth: 130,
                borderRadius: 8,
              }}
            >
              Ya, Drop
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
