import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Card,
  DatePicker,
  InputNumber,
  Pagination,
  Select,
  type TableColumnsType,
  InputRef,
  TableColumnType,
} from 'antd';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space } from 'antd';

import { FilePdf, MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps, Key } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as SalesAxios from '@pages/marketing/sales-report/service/SalesAxios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter } from '@/utils/helper';
import { generateSalesReport } from '@/utils/generatePdf/generateForms';
import * as SalesReportInterfaces from '@pages/marketing/sales-report/interface/SalesReportInterfaces';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import { FileExcelOutlined } from '@ant-design/icons';
import { generateExcelReportSales_RN } from '@/utils/generateExcel/RN/generateExcelReportSales_RN';
import { showNotification } from '@/contexts/services/notificationService';
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof SalesReportInterfaces.SalesReportInterfaces;

const renderInput = (
  dataIndex: string,
  setSelectedKeys: Function,
  selectedKeys: Key[],
  handleSearch: Function,
  searchInput: RefObject<InputRef | null>
) => {
  const commonStyle = { marginBottom: 8, display: 'block', width: '100%' };
  const handleDateChange = (format: string) => (value: dayjs.Dayjs | null) => {
    setSelectedKeys(value ? [value.format(format)] : []);
  };

  if (dataIndex.includes('periode_month')) {
    return (
      <DatePicker
        format="MM/YYYY"
        picker="month"
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0]), 'MM/YYYY') : undefined}
        onChange={handleDateChange('MM/YYYY')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('date')) {
    return (
      <DatePicker
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : undefined}
        onChange={handleDateChange('YYYY-MM-DDTHH:mm:ss.SSSZ')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('value_rkap')) {
    return (
      <InputNumber
        placeholder={`Search ${dataIndex}`}
        value={Number(selectedKeys[0]) || 0}
        onChange={(value) => setSelectedKeys(value !== undefined && value !== null ? [value] : [])}
        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
        controls={false}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('status')) {
    return (
      <Select
        showSearch
        placeholder="Pilih status"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'PENDING', label: 'PENDING' },
          { value: 'APPROVED', label: 'APPROVED' },
          { value: 'REJECTED', label: 'REJECTED' },
          { value: 'VERIFED', label: 'VERIFED' },
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

export default function SalesReportEksporRNPage() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    typeSalesSPb: 'RN_EKSPOR',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await SalesAxios.fetchDataSalesReport(dataTable);
        setTable((prev) => ({
          ...prev,
          data: res?.data.data.data,
          loading: false,
          total: res?.data.data.totalData,
        }));
      } catch (e: unknown) {
        showNotification('error', 'Gagal', 'Terjadi Kesalahan');
      }
    };
    fetch();
  }, [dataTable.page, dataTable.date, dataTable.status]);

  const dataSource: SalesReportInterfaces.SalesReportInterfaces[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<SalesReportInterfaces.SalesReportInterfaces> => ({
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

  const baseColumns: TableColumnsType<SalesReportInterfaces.SalesReportInterfaces> = [
    {
      title: 'Nomor Pesanan',
      dataIndex: 'orderNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: 'Produk',
      dataIndex: 'namabarangProduct',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('namabarangProduct'),
    },
    {
      title: 'Nama Pemesan',
      dataIndex: 'customerName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
    },
    {
      title: 'Jumlah Produk',
      dataIndex: 'quantity',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('quantity'),
      render: (quantity: number) => <span>{currencyFormatter(quantity || 0)}</span>,
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'priceProduct',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('priceProduct'),
      render: (priceProduct: number) => <span>${currencyFormatter(priceProduct || 0)}</span>,
    },

    {
      title: 'Harga Total',
      dataIndex: 'priceProduct',
      width: 200,
      align: 'center',
      render: (priceProduct: number, record: SalesReportInterfaces.SalesReportInterfaces) => (
        <span>${currencyFormatter(priceProduct * record.quantity)}</span>
      ),
    },

    {
      title: 'Tanggal Pesanan',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (date: Date) => <span>{dayjs(date).format('DD MMM YYYY')}</span>,
    },
  ];
  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        titleCard="Data Laporan Penjualan (RN Ekspor)"
        loading={dataTable.loading}
        baseColumns={baseColumns}
        dataSource={dataSource}
        Other={
          <>
            <ButtonFile
              icon={<FilePdf />}
              color="danger"
              onClick={() => generateSalesReport(dataSource)}
            />
            <ButtonFile
              text="Download Excel"
              icon={<FileExcelOutlined />}
              color="green"
              onClick={() => generateExcelReportSales_RN(dataSource as any[])}
            />
          </>
        }
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
    </>
  );
}
