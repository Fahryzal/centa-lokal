import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Pagination, type TableColumnsType } from 'antd';
import { useRef } from 'react';
import { Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as globalHelpers from '@/utils/helper';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import RenderInput from './structure/Components/RenderInput';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
import * as SalePlanInterfaces from '@pages/marketing/sales-plan/interface/SalePlanInterfaces';
import { useDeleSlePlan, useSalesPlan } from './hooks/useSalesPlan';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { useState } from '@/hooks/React/useState';
import { Button, Card } from '@/components/ui';
import { useAccess } from '@/contexts/AccessContext';
type DataIndex = keyof SalePlanInterfaces.Datum;
export default function SalesPlanPage() {
  const navigate = useAppNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    value_rkap: null,
    periode_month: null,
    status: null,
    unit: null,
    typeSalesPlan: 'RA',
  });
  const { data, error, isLoading } = useSalesPlan(params);
  const del = useDeleSlePlan();
  const { access } = useAccess();

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
  ): TableColumnType<SalePlanInterfaces.Datum> => ({
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
    navigate(`/sales-plan/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await del.mutateAsync(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<SalePlanInterfaces.Datum> => [
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
    //   render: (date: Dayjs) => <span>{dayjs(date).format('DD-MMM-YYYY')}</span>,
    // },

    {
      title: 'Nilai RKAP',
      dataIndex: 'value_rkap',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('value_rkap'),
      render: (value_rkap: number) => {
        return <span>Rp. {globalHelpers.currencyFormatter(Number(value_rkap) || 0)}</span>;
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
      render: (_: string, record: SalePlanInterfaces.Datum) => (
        <Space>
          <ButtonEditGroup
            disabled={!globalHelpers.hasAccessButton(acc, '/sales-plan', 'edit')}
            onClick={() => handleEdit(record.id)}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              loading={del.isPending}
              disabled={!globalHelpers.hasAccessButton(acc, '/sales-plan', 'delete')}
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

  if (error) {
    return <AlertCustome />;
  }

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={
          globalHelpers.hasAccessButton(access, '/sales-plan', 'add') ? '/sales-plan/add' : ''
        }
        titleCard="Data Sales Plan"
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
          key={data?.total}
          defaultCurrent={params.page}
          total={data?.total}
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
