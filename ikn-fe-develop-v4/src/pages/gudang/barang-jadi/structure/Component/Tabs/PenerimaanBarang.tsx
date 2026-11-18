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

import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

import { Popconfirm } from 'antd';
import { showNotification } from '@/contexts/services/notificationService';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';

import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/id'; // Import locale Indonesia
import 'photoviewer/dist/photoviewer.css';
import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';

// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id'); // Set default locale ke bahasa Indonesia
import * as BarangJadiInterfaces from '@pages/gudang/barang-jadi/interface/BarangJadiInterfaces';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
type DataIndex = keyof BarangJadiInterfaces.DataType;

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

export default function PenerimaanBarang() {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = actionButtonStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { access } = useAccess();
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
    total: 0,
    status: null,
    unit: null,
    documentCode: null,
    documentNumber: null,
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshTable, setRefreshTable] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setTable((prev) => ({ ...prev, loading: true }));

      try {
        const res = await BarangJadiAxios.fetchDataBarangJadi(dataTable as any);

        setTable((prev) => ({
          ...prev,
          data: res?.data.data.data ?? [],
          loading: false,
          total: res?.data.data.totalData ?? 0,
        }));
      } catch (error) {
        console.error('Gagal mengambil data barang jadi:', error);

        setTable((prev) => ({
          ...prev,
          data: [],
          total: 0,
          loading: false,
        }));
      }
    };

    fetch();
  }, [
    dataTable.page,
    dataTable.date,
    dataTable.status,
    dataTable.unit,
    dataTable.documentCode,
    dataTable.documentNumber,
    refreshTable,
  ]);

  const dataSource: BarangJadiInterfaces.DataType[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

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
  ): TableColumnType<BarangJadiInterfaces.DataType> => ({
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
    navigate(`/finished-goods/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/finished-goods/edit/${id}`);
  };

  const handlePost = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);

    try {
      await BarangJadiAxios.postPenerimaanBarang(id);
      showNotification('success', 'Berhasil', 'Penerimaan barang jadi berhasil diposting');
      setRefreshTable((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal posting penerimaan barang jadi'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevert = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);

    try {
      await BarangJadiAxios.revertPenerimaanBarang(id);
      showNotification('success', 'Berhasil', 'Posting penerimaan barang jadi berhasil dibatalkan');
      setRefreshTable((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal revert penerimaan barang jadi'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);

    try {
      await BarangJadiAxios.deletePenerimaanBarang(id);
      showNotification('success', 'Berhasil', 'Penerimaan barang jadi berhasil dihapus');
      setRefreshTable((prev) => prev + 1);
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal menghapus penerimaan barang jadi'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<BarangJadiInterfaces.DataType> => [
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
      title: 'Tanggal Penerimaan',
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
      title: 'Aksi',
      dataIndex: 'action',
      width: 440,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        const status = String(record.status ?? 'DRAFT').toUpperCase();
        const isDraft = status === 'DRAFT';
        const isPosted = status === 'POSTED';
        const isProcessing = processingId === record.id;
        const isAnyProcessing = processingId !== null;

        const canView = hasAccessButton(acc, '/finished-goods', 'view');
        const canEdit = hasAccessButton(acc, '/finished-goods', 'edit');
        const canDelete = hasAccessButton(acc, '/finished-goods', 'delete');

        return (
          <Space wrap size="small" className="penerimaan-barang-actions">
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
              disabled={!isDraft || !canEdit || isAnyProcessing}
              onClick={() => handleEdit(record.id)}
            >
              Update
            </Button>

            <Popconfirm
              title="Hapus penerimaan barang jadi?"
              okText="Ya, Hapus"
              cancelText="Batal"
              onConfirm={() => handleDelete(record.id)}
              disabled={!isDraft || !canDelete || isAnyProcessing}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
                disabled={!isDraft || !canDelete || isAnyProcessing}
              >
                Delete
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Posting penerimaan barang jadi?"
              okText="Ya, Posting"
              cancelText="Batal"
              onConfirm={() => handlePost(record.id)}
              disabled={!isDraft || !canEdit || isAnyProcessing}
            >
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={isProcessing}
                style={{
                  backgroundColor: '#1677ff',
                  borderColor: '#1677ff',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
                disabled={!isDraft || !canEdit || isAnyProcessing}
              >
                Posting
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Revert penerimaan barang jadi?"
              okText="Ya, Revert"
              cancelText="Batal"
              onConfirm={() => handleRevert(record.id)}
              disabled={!isPosted || !canEdit || isAnyProcessing}
            >
              <Button
                size="small"
                icon={<RollbackOutlined />}
                loading={isProcessing}
                style={{
                  backgroundColor: '#ea580c',
                  borderColor: '#ea580c',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
                disabled={!isPosted || !canEdit || isAnyProcessing}
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
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={hasAccessButton(access, '/finished-goods', 'add') ? '/finished-goods/add' : ''}
        titleCard="Data Barang Jadi"
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

const actionButtonStyles = `
.penerimaan-barang-actions .ant-btn {
  height: 32px !important;
  min-width: 88px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.penerimaan-barang-actions .ant-btn:disabled,
.penerimaan-barang-actions .ant-btn[disabled] {
  background-color: #e5e7eb !important;
  border-color: #d1d5db !important;
  color: #9ca3af !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  opacity: 1 !important;
}
`;
