import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as SalesPlanAxios from '@pages/marketing/sales-plan/service/SalesPlanAxios';

import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { showNotification } from '@/contexts/services/notificationService';
import RenderInput from './structure/Components/RenderInput';
import { useAccess } from '@/contexts/AccessContext';
dayjs.extend(utc);
dayjs.extend(timezone);
interface DataType {
  id: string;
  date: string;
  description: string;
  value_rkap: string;
  unit: string;
  periode_month: string;
  status: string;
}
type DataIndex = keyof DataType;

export default function SalesPlanEksporRNPage() {
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
    value_rkap: null,
    total: 0,
    periode_month: null,
    status: null,
    unit: null,
    typeSalesPlan: 'RN_EKSPOR',
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
      const res = await SalesPlanAxios.fetchDataSalesPlan(dataTable);
      setTable((prev: any) => ({
        ...prev,
        data: res?.data,
        loading: false,
        total: res?.total,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.date,
    dataTable.value_rkap,
    dataTable.periode_month,
    dataTable.status,
    dataTable.unit,
  ]);

  const dataSource: DataType[] = useMemo(() => dataTable.data, [dataTable.data]);

  globalHooks.useFetchOptions(unit, setUnit, SalesPlanAxios.fetchDataUnit, [unit.nama]);
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

  const handleEdit = (id: string) => {
    navigate(`/sales-plan-rn-ekspor/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await SalesPlanAxios.delSalesPlan(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      showNotification('warning', 'Peringatan', 'Gagal Hapus Data');
    }
  };

  const baseColumns = (acc: any): TableColumnsType<DataType> => [
    {
      title: 'Periode Bulan',
      dataIndex: 'periode_month',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('periode_month'),
    },
    // {
    //   title: 'Tanggal Pembuatan',
    //   dataIndex: 'date',
    //   width: 200,
    //   align: 'center',
    //   ...getColumnSearchProps('date'),
    //   render: (_: any, record: any) => <span>{dayjs(record.date).format('DD-MMM-YYYY')}</span>,
    // },

    {
      title: 'Nilai RKAP',
      dataIndex: 'value_rkap',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('value_rkap'),
      render: (value_rkap: number) => {
        return <span>{globalHelpers.currencyFormatter(Number(value_rkap))}KG</span>;
      },
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('unit'),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <ButtonEditGroup
            disabled={!globalHelpers.hasAccessButton(acc, '/sales-plan-rn-ekspor', 'edit')}
            onClick={() => handleEdit(record.id)}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!globalHelpers.hasAccessButton(acc, '/sales-plan-rn-ekspor', 'delete')}
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
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={
          globalHelpers.hasAccessButton(access, '/sales-plan-rn-ekspor', 'add')
            ? '/sales-plan-rn-ekspor/add'
            : ''
        }
        titleCard="Data Sales Plan (RN Ekspor)"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataSource}
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
