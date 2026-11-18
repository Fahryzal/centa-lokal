import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, Tag, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useRef, useState } from 'react';
import { Button, Space } from 'antd';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';

import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter, hasAccessButton, umurPiutang } from '@/utils/helper';
import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import RenderInput from '@pages/marketing/invoice/structure/Components/RenderInput';
import { useInvoice } from '@/pages/marketing/invoice/hooks/useInvoice';
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
interface InvoicePageProps {
  isFinance?: boolean;
}

export default function InvoicePageRA({ isFinance = false }: InvoicePageProps) {
  const navigate = useNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [params, setParams] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    invoiceNumber: null,
    total: 0,
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
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const { data, isLoading, isError } = useInvoice(params as any);

  // Mendukung Invoice RA data lama dan data baru
const getInvoiceSpb = (record: InvoiceInterfaces.Datum) => {
  return record.spb ?? (record.InvoiceDetail?.[0] as any)?.SPB ?? null;
};

// Mengambil Purchase Order dari SPB
const getInvoicePurchaseOrder = (record: InvoiceInterfaces.Datum) => {
  return getInvoiceSpb(record)?.purchaseOrder ?? null;
};

  globalHooks.useFetchOptions(unit, setUnit, InvoiceAxios.fetchDataUnit, [unit.nama]);

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
  const handleDetail = (id: string) => {
    navigate(`/invoice-keuangan/detail/ra/${id}`);
  };
  const baseColumns = (acc: any): TableColumnsType<InvoiceInterfaces.Datum> => [
    {
      title: 'Nomor Invoice ',
      dataIndex: 'invoiceNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceNumber'),
      render: (invoiceNumber: string, record: InvoiceInterfaces.Datum) => (
        <span
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            color: 'blue',
          }}
          onClick={() => handleDetail(record.id)}
        >
          {invoiceNumber}
        </span>
      ),
    },
    {
  title: 'Nomor Pesanan',
  dataIndex: 'orderNumber',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('orderNumber'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);
    return po?.orderNumber || '-';
  },
},
   {
  title: 'Nama Pemesan',
  dataIndex: 'customerName',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('customerName'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);
    return po?.customerName || '-';
  },
},
    {
  title: 'Nomor Telphon/Whatsap',
  dataIndex: 'phone',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('phone'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);
    return po?.customer?.phone || '-';
  },
},
   {
  title: 'Tanggal Pesanan',
  dataIndex: 'date',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('date'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);

    return po?.date
      ? dayjs(po.date).format('DD MMM YYYY')
      : '-';
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
  dataIndex: 'description',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('description'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);
    return po?.description || '-';
  },
},

    {
  title: 'Franco',
  dataIndex: 'franco',
  width: 200,
  align: 'center',
  ...getColumnSearchProps('franco'),
  render: (_: unknown, record: InvoiceInterfaces.Datum) => {
    const po = getInvoicePurchaseOrder(record);
    return po?.franco || '-';
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
      dataIndex: 'amountWithTax',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('amountWithTax'),
      render: (amountWithTax: number, record: InvoiceInterfaces.Datum) => {
        return <span>Rp{currencyFormatter(amountWithTax - record.totalAmount || 0)}</span>;
      },
    },
    {
      title: 'Total Harga',
      dataIndex: 'amountWithTax',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('amountWithTax'),
      render: (amountWithTax: number) => {
        return <span>Rp{currencyFormatter(amountWithTax || 0)}</span>;
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
            disabled={isFinance || !hasAccessButton(acc, '/invoice-keuangan', 'view')}
            onClick={() => handleDetail(id)}
          />
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
          defaultCurrent={params.page}
          total={data?.totalData}
          defaultPageSize={data?.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setParams((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </>
  );
}
