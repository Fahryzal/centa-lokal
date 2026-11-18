import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, Tag, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';

import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter, hasAccessButton, umurPiutang } from '@/utils/helper';
import { ButtonDetailGroup, ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import * as InvoiceEksporRNInterfaces from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/interface/InvoiceEksporRNInterfaces';
import * as InvoiceEksporRNAxios from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/service/InvoiceEksporRNAxios';

import { showNotification } from '@/contexts/services/notificationService';
import RenderInput from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/structure/Components/RenderInput';
import { useAccess } from '@/contexts/AccessContext';
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof InvoiceEksporRNInterfaces.ResponseDataType;
interface InvoicePageProps {
  isFinance?: boolean;
}

export default function InvoicePageEksporRN({ isFinance = false }: InvoicePageProps) {
  const navigate = useNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [idDelete, setIdDelete] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    invoiceNumber: null,
    total: 0,
    status: null,
    purchaseOrder: null,
    customerName: null,
    description: null,
    totalCIF: null,
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await InvoiceEksporRNAxios.fetchDataInvoice(dataTable as any);
      setTable((prev) => ({
        ...prev,
        data: res?.data.data.data,
        loading: false,
        total: res?.data.data.totalData,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.date,
    dataTable.invoiceNumber,
    dataTable.status,
    dataTable.purchaseOrder,
    dataTable.customerName,
    dataTable.description,
    dataTable.totalCIF,
  ]);

  const dataSource: InvoiceEksporRNInterfaces.ResponseDataType[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  globalHooks.useFetchOptions(unit, setUnit, InvoiceEksporRNAxios.fetchDataUnit, [unit.nama]);

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
  ): TableColumnType<InvoiceEksporRNInterfaces.ResponseDataType> => ({
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
    navigate(`/invoice-rn-ekspor/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/invoice-rn-ekspor/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await InvoiceEksporRNAxios.delInvoice(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Ubah Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Hapus Data');
    }
  };
  const baseColumns = (acc: any): TableColumnsType<InvoiceEksporRNInterfaces.ResponseDataType> => [
    {
      title: 'Nomor Invoice ',
      dataIndex: 'invoiceNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('invoiceNumber'),
    },
    {
      title: 'Nomor Pesanan',
      dataIndex: 'purchaseOrder',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('purchaseOrder'),
    },
    {
      title: 'Nama Pemesan',
      dataIndex: ['customer', 'name'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
    },

    {
      title: 'Tanggal Pembuatan Invoice',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (invoiceDate: Date) => <span>{dayjs(invoiceDate).format('DD MMM YYYY')}</span>,
    },
    {
      title: 'Umur Piutang',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      render: (date: Date, record: InvoiceEksporRNInterfaces.ResponseDataType) => (
        <span>{!record.paymentDate ? umurPiutang(date) : '-'}</span>
      ),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Harga',
      dataIndex: 'totalCIF',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('totalCIF'),
      render: (totalCIF: number) => {
        return <span>${currencyFormatter(totalCIF || 0)}</span>;
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
            disabled={!hasAccessButton(acc, '/invoice-rn-ekspor', 'view')}
            onClick={() => handleDetail(id)}
          />
          <ButtonEditGroup
            disabled={isFinance || !hasAccessButton(acc, '/invoice-rn-ekspor', 'edit')}
            onClick={() => handleEdit(id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            disabled={isFinance}
            onConfirm={() => handleDelete(id)} // Fungsi delete
          >
            <Button
              disabled={isFinance || !hasAccessButton(acc, '/invoice-rn-ekspor', 'delete')}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }}
        titleCard="Data Invoice (RN Ekspor)"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataSource}
        linkAdd={
          isFinance || !hasAccessButton(access, '/invoice-rn-ekspor', 'add')
            ? null
            : '/invoice-rn-ekspor/add'
        }
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
