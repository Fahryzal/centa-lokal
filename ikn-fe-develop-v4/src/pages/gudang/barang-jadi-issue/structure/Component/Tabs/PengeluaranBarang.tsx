import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Card,
  DatePicker,
  Pagination,
  Tag,
  type TableColumnsType,
  InputRef,
  TableColumnType,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space } from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { showNotification } from '@/contexts/services/notificationService';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';

import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
import * as globalHooks from '@/hooks';

import * as BarangJadiIssueAxios from '@pages/gudang/barang-jadi-issue/service/BarangJadiIssueAxios';
import * as FinishedGoodsIssueInterfaces from '@pages/gudang/barang-jadi-issue/interface/BarangJadiIssueInterfaces';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

type DataIndex = 'documentCode' | 'documentNumber' | 'date' | 'unit' | 'status';

const renderInput = (
  dataIndex: string,
  setSelectedKeys: Function,
  selectedKeys: any,
  searchInput: any
) => {
  const commonStyle = {
    marginBottom: 8,
    display: 'block',
    width: '100%',
  };

  if (dataIndex === 'date') {
    return (
      <DatePicker
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : undefined}
        onChange={(value) => setSelectedKeys(value ? [value.format('YYYY-MM-DD')] : [])}
        style={commonStyle}
      />
    );
  }

  return (
    <Input
      ref={searchInput}
      placeholder={`Cari ${dataIndex}`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => {}}
      style={commonStyle}
    />
  );
};

export default function PengeluaranBarangJadi() {
  const navigate = useNavigate();
  const { access } = useAccess();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [postingId, setPostingId] = useState<string | null>(null); // Menyimpan ID dokumen yang sedang diposting
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Memicu pengambilan ulang data tabel setelah posting berhasil

  const [dataTable, setTable] = useState<any>({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    unit: null,
    documentCode: null,
    documentNumber: null,
  });

  const [unit, setUnit] = useState<any>({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  // Ambil daftar pengeluaran barang jadi
  useEffect(() => {
    const fetchData = async () => {
      setTable((prev: any) => ({
        ...prev,
        loading: true,
      }));

      try {
        const params: FinishedGoodsIssueInterfaces.FinishedGoodsIssueParams = {
          page: dataTable.page,
          limit: dataTable.limit,
          date: dataTable.date,
          status: dataTable.status,
          unit: dataTable.unit,
          documentCode: dataTable.documentCode,
          documentNumber: dataTable.documentNumber,
        };

        const res = await BarangJadiIssueAxios.fetchDataFinishedGoodsIssue(params);

        setTable((prev: any) => ({
          ...prev,
          data: res?.data?.data?.data ?? [],
          total: res?.data?.data?.totalData ?? 0,
          loading: false,
        }));
      } catch (error) {
        console.error('Gagal mengambil data pengeluaran barang jadi:', error);

        setTable((prev: any) => ({
          ...prev,
          data: [],
          total: 0,
          loading: false,
        }));
      }
    };

    fetchData();
  }, [
    dataTable.page,
    dataTable.date,
    dataTable.status,
    dataTable.unit,
    dataTable.documentCode,
    dataTable.documentNumber,
    dataTable.limit,
    refreshKey,
  ]);

  // Data untuk tabel
  const dataSource: FinishedGoodsIssueInterfaces.FinishedGoodsIssueData[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  // Ambil pilihan unit
  globalHooks.useFetchOptions(unit, setUnit, BarangJadiIssueAxios.fetchDataUnit, [unit.nama]);

  // Pencarian kolom
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();

    setTable((prev: any) => ({
      ...prev,
      page: 1,
      [dataIndex]: selectedKeys[0] || null,
    }));

    setSearchText(selectedKeys[0] || '');
    setSearchedColumn(dataIndex);
  };

  // Reset pencarian
  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    clearFilters();
    confirm();

    setSearchText('');
    setSearchedColumn('');

    setTable((prev: any) => ({
      ...prev,
      page: 1,
      [dataIndex]: null,
    }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<FinishedGoodsIssueInterfaces.FinishedGoodsIssueData> => ({
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
        {renderInput(dataIndex, setSelectedKeys, selectedKeys, searchInput)}

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<MagnifyingGlass />}
            size="small"
          >
            Search
          </Button>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
            size="small"
          >
            Reset
          </Button>

          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => (
      <MagnifyingGlass
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),

    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },

    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? String(text) : ''}
        />
      ) : (
        text
      ),
  });

  // Navigasi detail
  const handleDetail = (id: string) => {
    navigate(`/finished-goods-issue/detail/${id}`);
  };

  // Navigasi edit
  const handleEdit = (id: string) => {
    navigate(`/finished-goods-issue/edit/${id}`);
  };

  const handlePosting = async (id: string) => {
    if (postingId) return;

    setPostingId(id);

    try {
      await BarangJadiIssueAxios.postFinishedGoodsIssue(id);

      showNotification('success', 'Berhasil', 'Pengeluaran barang jadi berhasil diposting');

      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal posting pengeluaran barang jadi'
      );
    } finally {
      setPostingId(null);
    }
  };

  const handleRevert = async (id: string) => {
    if (revertingId || postingId) return;

    setRevertingId(id);

    try {
      await BarangJadiIssueAxios.revertFinishedGoodsIssue(id);

      showNotification('success', 'Berhasil', 'Pengeluaran barang jadi berhasil direvert');

      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal revert pengeluaran barang jadi'
      );
    } finally {
      setRevertingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId || postingId || revertingId) return;

    setDeletingId(id);

    try {
      await BarangJadiIssueAxios.deleteFinishedGoodsIssue(id);

      showNotification(
        'success',
        'Berhasil',
        'Pengeluaran barang jadi berhasil dihapus secara permanen'
      );

      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal menghapus pengeluaran barang jadi'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Kolom tabel
  const baseColumns: TableColumnsType<FinishedGoodsIssueInterfaces.FinishedGoodsIssueData> = [
    {
      title: 'Kode Dokumen',
      dataIndex: 'documentCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('documentCode'),
    },
    {
      title: 'No. Dokumen',
      dataIndex: 'documentNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('documentNumber'),
    },
    {
      title: 'Tanggal Pengeluaran',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (date: Date) => <span>{dayjs(date).format('DD MMM YYYY')}</span>,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('unit'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      align: 'center',
      ...getColumnSearchProps('status'),
      render: (status: string) => {
        const currentStatus = String(status ?? 'DRAFT').toUpperCase();

        const color =
          currentStatus === 'POSTED'
            ? 'green'
            : currentStatus === 'REVERTED'
              ? 'orange'
              : 'default';

        return <Tag color={color}>{currentStatus}</Tag>;
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 300,
      fixed: 'right',
      align: 'center',
      render: (_: any, record) => {
        const status = String(record.status ?? 'DRAFT').toUpperCase();

        const canView = hasAccessButton(access, '/finished-goods-issue', 'view');

        const canEdit = hasAccessButton(access, '/finished-goods-issue', 'edit');
        const canDelete = hasAccessButton(access, '/finished-goods-issue', 'delete');
        const canUpdate = status === 'DRAFT' || status === 'REVERTED';
        const canRevert = status === 'POSTED';

        return (
          <Space wrap size="small">
            <ButtonDetailGroup disabled={!canView} onClick={() => handleDetail(record.id)} />

            <Button
              size="small"
              icon={<EditOutlined />}
              style={{
                backgroundColor: '#16a34a',
                borderColor: '#16a34a',
                color: '#ffffff',
                borderRadius: 6,
                fontWeight: 500,
              }}
              disabled={!canEdit || !canUpdate}
              onClick={() => handleEdit(record.id)}
            >
              Update
            </Button>

            <Popconfirm
              title="Hapus pengeluaran barang jadi?"
              description="Data akan dihapus secara permanen dan tidak dapat dikembalikan."
              okText="Ya, Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
              disabled={!canDelete || !canUpdate || deletingId !== null}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
                disabled={!canDelete || !canUpdate || deletingId !== null}
                style={{
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                Delete
              </Button>
            </Popconfirm>

            {/* Tombol Posting */}
            <Popconfirm
              title="Posting pengeluaran barang jadi?"
              okText="Ya, Posting"
              cancelText="Batal"
              onConfirm={() => handlePosting(record.id)}
              disabled={!canUpdate || !canEdit || postingId !== null}
            >
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={postingId === record.id}
                style={{
                  backgroundColor: '#1677ff',
                  borderColor: '#1677ff',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
                disabled={!canUpdate || !canEdit || postingId !== null}
              >
                Posting
              </Button>
            </Popconfirm>

            {/* Tombol Revert */}
            <Popconfirm
              title="Revert pengeluaran barang jadi?"
              description="Seluruh stok yang sebelumnya dikeluarkan akan dikembalikan."
              okText="Ya, Revert"
              cancelText="Batal"
              onConfirm={() => handleRevert(record.id)}
              disabled={!canRevert || !canEdit || postingId !== null || revertingId !== null}
            >
              <Button
                size="small"
                icon={<RollbackOutlined />}
                loading={revertingId === record.id}
                style={{
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
                disabled={!canRevert || !canEdit || postingId !== null || revertingId !== null}
              >
                Revert
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }}
        linkAdd={
          hasAccessButton(access, '/finished-goods-issue', 'add') ? '/finished-goods-issue/add' : ''
        }
        titleCard="Data Pengeluaran Barang Jadi"
        loading={dataTable.loading}
        baseColumns={baseColumns}
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
          current={dataTable.page}
          total={dataTable.total}
          pageSize={dataTable.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setTable((prev: any) => ({
              ...prev,
              page,
            }));
          }}
        />
      </Card>
    </>
  );
}
