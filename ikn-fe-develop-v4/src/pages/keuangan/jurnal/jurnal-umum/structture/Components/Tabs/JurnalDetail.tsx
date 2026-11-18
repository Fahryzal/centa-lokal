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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space } from 'antd';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as JurnalKhususAxios from '@/pages/keuangan/jurnal/jurnal-khusus/service/JurnalKhususAxios';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter } from '@/utils/helper';
import { generateJournalPDF } from '@/utils/generatePdf/generateJournalPDF';
import * as JurnalUmumInterfaces from '@pages/keuangan/jurnal/jurnal-umum/interfaces/JurnalUmumInterfaces';
import { handleExportJurnalUmumDetail } from '@/utils/generateExcel/JurnalUmumDetail/generateExcel';
import { showNotification } from '@/contexts/services/notificationService';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof JurnalUmumInterfaces.JurnalUmumDetailInterface;

const renderInput = (
  dataIndex: string,
  setSelectedKeys: Function,
  selectedKeys: any,
  handleSearch: Function,
  searchInput: any
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

export default function JurnalDetail() {
  const [searchText, setSearchText] = useState('');
  const [idDelete, _setIdDelete] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    jenisJurnal: 'All',
    startDate: null,
    endDate: null,
    total: 0,
    periode_month: null,
    status: null,
    unit: null,
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await JurnalKhususAxios.fetchJurnalKhusus(dataTable);
      setTable((prev) => ({
        ...prev,
        data: res.data,
        loading: false,
        total: res.totalData,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.endDate,
    dataTable.startDate,
    dataTable.jenisJurnal,

    dataTable.periode_month,
    dataTable.status,
    dataTable.unit,
  ]);

  const dataSource: JurnalUmumInterfaces.JurnalUmumDetailInterface[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  useEffect(() => {
    const newDdata = dataTable.data.filter((item: any) => item.id != idDelete);
    setTable((prev) => ({
      ...prev,
      page: 1,
      data: newDdata,
      total: prev.total - 1,
    }));
  }, [idDelete]);

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
  ): TableColumnType<JurnalUmumInterfaces.JurnalUmumDetailInterface> => ({
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

  const baseColumns: TableColumnsType<JurnalUmumInterfaces.JurnalUmumDetailInterface> = [
    {
      title: 'Nomor Refrensi',
      dataIndex: 'referenceNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('referenceNumber'),
    },
    {
      title: 'Nomor Jurnal',
      dataIndex: 'numberJurnal',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('numberJurnal'),
    },
    {
      title: 'Kode Akun',
      dataIndex: 'kodeAccount',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('kodeAccount'),
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (_: any, record: any) => <span>{dayjs(record.date).format('DD MMM YYYY')}</span>,
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Nama Akun',
      dataIndex: 'accountName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('accountName'),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('debit'),
      render: (debit: number) => {
        return <span>Rp{currencyFormatter(Number(debit))}</span>;
      },
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('credit'),
      render: (credit: number) => {
        return <span>Rp{currencyFormatter(Number(credit))}</span>;
      },
    },
  ];

  const handleChangeJurnal = (value: string) => {
    setTable((prev) => ({ ...prev, jenisJurnal: value }));
  };

  const handleChangeRangeDate = (value: any) => {
    console.log(value[0]);
    setTable((prev) => ({
      ...prev,
      startDate: value[0].format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      endDate: value[1].format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }));
  };

  const handleDownloadPDF = () => {
    try {
      const fetch = async () => {
        const dataTableNew = { ...dataTable, isDownload: true };
        const res = await JurnalKhususAxios.fetchJurnalKhusus(dataTableNew);
        generateJournalPDF(res.data, dataTable.jenisJurnal);
      };
      fetch();
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const handleDownloadExcel = () => {
    try {
      const fetch = async () => {
        const dataTableNew = { ...dataTable, isDownload: true };
        const res = await JurnalKhususAxios.fetchJurnalKhusus(dataTableNew);
        handleExportJurnalUmumDetail(res.data);
      };
      fetch();
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  return (
    <>
      <TableDragDrop
        handleChangeJurnal={handleChangeJurnal}
        handleChangeRangeDate={handleChangeRangeDate}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadExcel={handleDownloadExcel}
        scroll={{ x: 'max-content' }} // Hindari overflow
        titleCard="Data Jurnal Umum"
        loading={dataTable.loading}
        baseColumns={baseColumns}
        dataSource={dataSource}
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
