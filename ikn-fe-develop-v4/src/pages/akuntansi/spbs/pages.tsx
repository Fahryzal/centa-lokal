import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Card,
  Pagination,
  type TableColumnsType,
  InputRef,
  TableColumnType,
  Popconfirm,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Button, Space } from 'antd';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';

import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ButtonDetailGroup, ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import RenderInput from './structure/Components/RenderInput';
import { DeleteOutlined } from '@ant-design/icons';
import { handleMessageError } from '@/utils/func/func';
import { showNotification } from '@/contexts/services/notificationService';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
interface DataType {
  id: string;
  date: string;
  orderNumber: string;
  description: string;
  franco: string;
  customerName: string;
  subtotalAmount: string;
  status: number;
  noSpb: string;
  tanggalPengiriman: Date;
}
type DataIndex = keyof DataType;

export default function SpbsPage() {
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
    total: 0,
    orderNumber: null,
    noSpb: null,
    description: null,
    tanggalPengiriman: null,
    franco: null,
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
      const res = await SpbsAxios.fetchDataSpbs(dataTable as any);
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
    dataTable.noSpb,
    dataTable.description,
    dataTable.tanggalPengiriman,
    dataTable.date,
    dataTable.orderNumber,
    dataTable.franco,
  ]);

  globalHooks.useFetchOptions(unit, setUnit, SpbsAxios.fetchDataUnit, [unit.nama]);

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

  const handleDetail = (id: string) => {
    navigate(`/spbs/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/spbs/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setTable((prev) => ({
        ...prev,
        loading: true,
      }));
      setIdDelete(id);
      await SpbsAxios.delSpbs(id);
      showNotification('success', 'Berhasil', 'Berhasil dihapus');
      setTable((prev) => ({
        ...prev,
        loading: false,
      }));
    } catch (e) {
      setTable((prev) => ({
        ...prev,
        loading: false,
      }));
      const message = handleMessageError(e);
      showNotification('error', 'Terjadi Kesalahan', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<DataType> => [
    {
      title: 'Nomor Pesanan',
      dataIndex: 'orderNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: 'Nomor SPB',
      dataIndex: 'noSpb',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('noSpb'),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Tanggal Pengiriman',
      dataIndex: 'tanggalPengiriman',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('tanggalPengiriman'),
      render: (tanggalPengiriman: Date) => (
        <span>{dayjs(tanggalPengiriman).format('DD MMM YYYY')}</span>
      ),
    },
    {
      title: 'Tanggal Pesanan',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (_: any, record: any) => <span>{dayjs(record.date).format('DD MMM YYYY')}</span>,
    },

    {
      title: 'Franco',
      dataIndex: 'franco',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('franco'),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/spbs', 'view')}
            onClick={() => handleDetail(record.id)}
          />
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/spbs', 'edit')}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            disabled={!hasAccessButton(acc, '/spbs', 'delete')}
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              loading={dataTable.loading}
              disabled={!hasAccessButton(acc, '/spbs', 'delete')}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={hasAccessButton(access, '/spbs', 'add') ? '/spbs/add' : ''}
        titleCard="Data SPBS"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataTable.data}
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
