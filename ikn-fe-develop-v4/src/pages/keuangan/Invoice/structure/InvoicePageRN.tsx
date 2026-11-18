import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Pagination, Tag, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useRef } from 'react';
import { Space } from 'antd';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter, hasAccessButton, umurPiutang } from '@/utils/helper';
import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import { useInvoice } from '@/pages/marketing-rn/invoice-rn/hooks/useInvoice';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { Button, Card, Input, Select } from '@/components/ui';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { useState } from '@/hooks/React/useState';
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

const renderInput = (
  dataIndex: string,
  setSelectedKeys: Function,
  selectedKeys: any,
  handleSearch: Function,
  searchInput: any
) => {
  const commonStyle = { marginBottom: 8, display: 'block', width: '100%' };

  if (dataIndex.includes('status')) {
    return (
      <Select
        showSearch
        placeholder="Pilih status"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'LUNAS', label: 'LUNAS' },
          { value: 'HUTANG', label: 'HUTANG' },
        ]}
        style={commonStyle}
      />
    );
  }

  return (
    <Input
      ref={searchInput}
      placeholder={`Search ${dataIndex}`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
      style={commonStyle}
    />
  );
};

// interface InvoicePageRNProps {
//   isFinance?: boolean;
// }

export default function InvoicePageRN() {
  const navigate = useAppNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [params, setParams] = useState({
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
    typeInvoice: 'RN',
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const { data, isLoading, isError } = useInvoice(params as any);

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
        {renderInput(dataIndex, setSelectedKeys, selectedKeys, handleSearch, searchInput)}
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
    navigate(`/invoice-keuangan/detail/rn/${id}`);
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
          onClick={() => navigate(`/spbs/detail/${record.spbId}`)}
        >
          {invoiceNumber}
        </span>
      ),
    },
    {
      title: 'Nomor Pesanan',
      dataIndex: ['spb', 'purchaseOrder', 'orderNumber'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: 'Nama Pemesan',
      dataIndex: ['spb', 'purchaseOrder', 'customerName'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
    },
    {
      title: 'Nomor Telphon/Whatsap',
      dataIndex: ['spb', 'purchaseOrder', 'customer', 'phone'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Tanggal Pesanan',
      dataIndex: ['spb', 'purchaseOrder', 'date'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (date: Date) => <span>{dayjs(date).format('DD MMM YYYY')}</span>,
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
      ...getColumnSearchProps('invoiceDate'),
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
    },

    {
      title: 'Franco',
      dataIndex: ['spb', 'purchaseOrder', 'franco'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('franco'),
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
            disabled={!hasAccessButton(acc, '/invoice-keuangan', 'view')}
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
        scroll={{ x: 'max-content' }} // Hindari overflow
        // linkAdd={"/invoice-rn/add"}
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
