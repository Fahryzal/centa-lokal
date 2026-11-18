import {
  Button,
  Modal,
  Space,
  Table,
  type TableColumnsType,
  InputRef,
  TableColumnType,
  Card,
  Pagination,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter } from '@/utils/helper';
import RenderInput from './RenderInput';
import { showNotification } from '@/contexts/services/notificationService';
dayjs.extend(utc);
dayjs.extend(timezone);

interface DataType {
  id: string;
  invoiceDate: string;
  invoiceNumber: string;
  amount: number;
}
type DataIndex = keyof DataType;

export default function ModalTransaction({
  setOpen,
  open,
  handleRowDoubleClick,
}: Readonly<{
  setOpen: Function;
  open: boolean;
  handleRowDoubleClick: Function;
}>) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    invoiceDate: null,
    amount: null,
    total: 0,
    selectionStatusInvoice: 'NOT_SELECTED',
    IsNonEkspor: true,
    invoiceNumber: null,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await InvoiceAxios.fetchDataInvoice(dataTable as any);
        setTable((prev: any) => ({
          ...prev,
          data: res?.data,
          loading: false,
          total: res?.totalData,
        }));
      } catch (e) {
        showNotification('error', 'Gagal', 'Gagal Filter Data');
      }
    };
    fetch();
  }, [dataTable.page, dataTable.invoiceDate, dataTable.invoiceNumber, dataTable.amount]);

  const dataSource: DataType[] = useMemo(() => dataTable.data, [dataTable.data]);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setTable((prev) => ({ ...prev, page: 1, [dataIndex]: selectedKeys[0] }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    clearFilters();
    setSearchText('');
    confirm();
    setTable((prev) => ({ ...prev, [dataIndex]: null }));
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
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

  const baseColumns: TableColumnsType<DataType> = [
    {
      title: 'Nomor Invoice',
      dataIndex: 'invoiceNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceNumber'),
    },
    {
      title: 'Tanggal Invoice',
      dataIndex: 'invoiceDate',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceDate'),
      render: (_: any, record: any) => {
        return <p>{dayjs(record.invoiceDate).format('DD MMM YYYY')}</p>;
      },
    },
    {
      title: 'Jumlah Yang Harus di Bayar',
      dataIndex: 'amount',
      width: 200,
      align: 'center',
      // ...getColumnSearchProps('amount'),
      render: (_: any, record: any) => {
        return <p>Rp {currencyFormatter(record.amountWithTax)}</p>;
      },
    },
    {
      title: 'Jumlah Telah dibayar',
      dataIndex: 'downPayment',
      width: 200,
      align: 'center',
      render: (downPayment: number) => {
        return <p>Rp {currencyFormatter(Number(downPayment || 0))}</p>;
      },
    },
  ];
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    const sortField = sorter.field;
    const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    setTable((prev) => ({ ...prev, sortBy: sortField, sortOrder: sortOrder }));
  };

  return (
    <Modal
      title={<p>Pilih Invoice</p>}
      loading={dataTable.loading}
      open={open}
      width={{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
      ]}
    >
      <Table<DataType>
        rowKey="key"
        bordered={true}
        scroll={{ x: 'max-content' }} // Hindari overflow
        columns={baseColumns}
        dataSource={dataSource}
        loading={dataTable.loading}
        onChange={handleTableChange}
        pagination={false}
        rowClassName={(_record, index) => {
          return index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => handleRowDoubleClick(record),
          };
        }}
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
          key={dataTable.page}
          defaultCurrent={dataTable.page}
          total={dataTable.total}
          defaultPageSize={dataTable.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setTable((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </Modal>
  );
}
