import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Card,
  DatePicker,
  InputNumber,
  Pagination,
  Select,
  type TableColumnsType,
  type InputRef,
  type TableColumnType,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as BarangMentahIssueAxios from '@pages/gudang/barang-mentah-issue/service/BarangMentahIssueAxios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/id';
import 'photoviewer/dist/photoviewer.css';

import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

interface DataType {
  id: string;
  date: string;
  documentCode: string;
  documentNo?: string;
  documentNumber?: string;
  supplier?: string;
  quantity?: number;
  status?: string;
  journalEntry?:
    | {
        id?: string;
        numberJurnal?: string;
        isPosted?: boolean;
        status?: string;
        isRevert?: string;
      }
    | {
        id?: string;
        numberJurnal?: string;
        isPosted?: boolean;
        status?: string;
        isRevert?: string;
      }[];
}

type DataIndex = keyof DataType;

const renderInput = (
  dataIndex: string,
  setSelectedKeys: (keys: React.Key[]) => void,
  selectedKeys: React.Key[],
  searchInput: React.RefObject<InputRef | null>
) => {
  const commonStyle = {
    marginBottom: 8,
    display: 'block',
    width: '100%',
  };

  if (dataIndex.includes('periode_month')) {
    return (
      <DatePicker
        format="MM/YYYY"
        picker="month"
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0]), 'MM/YYYY') : undefined}
        onChange={(value) => setSelectedKeys(value ? [value.format('MM/YYYY')] : [])}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('date')) {
    return (
      <DatePicker
        format="DD/MM/YYYY"
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : undefined}
        onChange={(value) => setSelectedKeys(value ? [value.format('YYYY-MM-DD')] : [])}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('value_rkap')) {
    return (
      <InputNumber
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] !== undefined ? Number(selectedKeys[0]) : undefined}
        onChange={(value) => setSelectedKeys(value !== null && value !== undefined ? [value] : [])}
        controls={false}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('status')) {
    return (
      <Select
        showSearch
        allowClear
        placeholder="Pilih status"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'DRAFT', label: 'DRAFT' },
          { value: 'CONFIRMED', label: 'CONFIRMED' },
          { value: 'CANCELLED', label: 'CANCELLED' },
        ]}
        style={commonStyle}
      />
    );
  }

  return (
    <Input
      ref={searchInput}
      placeholder={`Search ${dataIndex}`}
      value={selectedKeys[0] as string | undefined}
      onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
      style={commonStyle}
    />
  );
};

export default function PenegeluaranBarang() {
  const navigate = useNavigate();
  const { access } = useAccess();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const searchInput = useRef<InputRef>(null);

  const [dataTable, setTable] = useState({
    data: [] as DataType[],
    page: 1,
    limit: 5,
    loading: false,
    date: null as string | null,
    total: 0,
    status: null as string | null,
    unit: null as string | null,
    documentCode: null as string | null,
    documentNumber: null as string | null,
  });

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setTable((prev) => ({ ...prev, loading: true }));

      try {
        const params = {
          page: dataTable.page,
          limit: dataTable.limit,
          date: dataTable.date,
          status: dataTable.status,
          unit: dataTable.unit,
          documentCode: dataTable.documentCode,
          documentNumber: dataTable.documentNumber,
        };

        const res = await BarangMentahIssueAxios.fetchDataBarangMentahIssue(params as any);

        if (!isActive) return;

        const result = res?.data?.data;

        setTable((prev) => ({
          ...prev,
          data: Array.isArray(result?.data) ? result.data : [],
          total: Number(result?.totalData ?? 0),
          loading: false,
        }));
      } catch (error) {
        if (!isActive) return;

        setTable((prev) => ({
          ...prev,
          data: [],
          total: 0,
          loading: false,
        }));

        message.error('Gagal mengambil data pengeluaran barang mentah.');
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [
    dataTable.page,
    dataTable.limit,
    dataTable.date,
    dataTable.status,
    dataTable.unit,
    dataTable.documentCode,
    dataTable.documentNumber,
    refreshKey,
  ]);

  const dataSource = useMemo(() => dataTable.data, [dataTable.data]);

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();

    setTable((prev) => ({
      ...prev,
      page: 1,
      [dataIndex]: selectedKeys[0] !== undefined ? String(selectedKeys[0]) : null,
    }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    clearFilters();
    confirm();
    setSearchText('');
    setSearchedColumn('');

    setTable((prev) => ({
      ...prev,
      page: 1,
      [dataIndex]: null,
    }));
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
        onKeyDown={(event) => event.stopPropagation()}
      >
        {renderInput(String(dataIndex), setSelectedKeys, selectedKeys, searchInput)}

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<MagnifyingGlass />}
            size="small"
          >
            Search
          </Button>

          <Button
            onClick={() =>
              clearFilters
                ? handleReset(clearFilters, confirm, dataIndex)
                : handleSearch([], confirm, dataIndex)
            }
            size="small"
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(String(selectedKeys[0] ?? ''));
              setSearchedColumn(String(dataIndex));
            }}
          >
            Filter
          </Button>

          <Button type="link" size="small" onClick={() => close()}>
            Tutup
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

    render: (value) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value == null ? '' : String(value)}
        />
      ) : (
        value
      ),
  });

  const handleDetail = (id: string) => {
    navigate(`/raw-material-issue/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/raw-material-issue/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await BarangMentahIssueAxios.delBarangMentahIssue(id);

      message.success('Berhasil menghapus data pengeluaran barang mentah.');

      setTable((prev) => ({
        ...prev,
        page: prev.page > 1 && prev.data.length === 1 ? prev.page - 1 : prev.page,
      }));

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      message.error('Gagal menghapus data. Pastikan transaksi sudah di-Revert.');
    }
  };

  const handlePost = async (id: string) => {
    try {
      await BarangMentahIssueAxios.postBarangMentahIssue(id);

      message.success('Pengeluaran bahan mentah berhasil diposting.');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      message.error('Gagal melakukan Posting. Periksa stok dan periode akuntansi.');
    }
  };

  const handleRevert = async (id: string) => {
    try {
      await BarangMentahIssueAxios.revertBarangMentahIssue(id);

      message.success('Transaksi berhasil di-Revert.');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      message.error('Gagal melakukan Revert. Periksa status transaksi dan periode akuntansi.');
    }
  };

  const baseColumns = (acc: any): TableColumnsType<DataType> => [
    {
      title: 'Kode Dokumen',
      dataIndex: 'documentCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('documentCode'),
    },
    {
      title: 'No. Dokumen',
      dataIndex: 'documentNo',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('documentNumber'),
      render: (_: unknown, record: DataType) => record.documentNo ?? record.documentNumber ?? '-',
    },
    {
      title: 'Tanggal Keluar',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (_: unknown, record: DataType) =>
        record.date && dayjs(record.date).isValid()
          ? dayjs(record.date).format('DD MMM YYYY')
          : '-',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 360,
      fixed: 'right',
      align: 'center',

      render: (_: unknown, record: DataType) => {
        const journal = Array.isArray(record.journalEntry)
          ? record.journalEntry[0]
          : record.journalEntry;

        const isPosted = journal?.isPosted === true;
        const isReverted = journal?.isRevert === 'Y' && journal?.status === 'CANCELLED';

        const isDraft =
          journal?.isPosted === false && journal?.isRevert === 'N' && journal?.status === 'DRAFT';

        // Hak akses
        const canView = hasAccessButton(acc, '/raw-material-issue', 'view');
        const canEdit = hasAccessButton(acc, '/raw-material-issue', 'edit');

        // Kondisi tombol berdasarkan status transaksi.
        const canAdjust = (isDraft || isReverted) && !isPosted;
        const canRemove = (isDraft || isReverted) && !isPosted;
        const canPost = (isDraft || isReverted) && !isPosted;
        const canRevert = isPosted && journal?.isRevert === 'N';

        return (
          <Space wrap>
            <ButtonDetailGroup disabled={!canView} onClick={() => handleDetail(record.id)} />

            <Button
              type="primary"
              style={{ backgroundColor: '#07bb31', borderColor: '#07bb31' }}
              onClick={() => handleEdit(record.id)}
              disabled={!canAdjust}
            >
              Penyesuaian
            </Button>

            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
              disabled={!canRemove}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} disabled={!canRemove}>
                Hapus
              </Button>
            </Popconfirm>

            <Popconfirm
              title={
                isReverted
                  ? 'Apakah Anda yakin ingin melakukan Posting ulang?'
                  : 'Apakah Anda yakin ingin melakukan Posting?'
              }
              description="Stok dan saldo buku besar akan diperbarui."
              okText={isReverted ? 'Ya, Posting Ulang' : 'Ya, Posting'}
              cancelText="Batal"
              disabled={!canPost || !canEdit}
              onConfirm={() => handlePost(record.id)}
            >
              <Button type="primary" disabled={!canPost || !canEdit}>
                {isReverted ? 'Posting' : 'Posting'}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Apakah Anda yakin ingin melakukan Revert?"
              description="Stok bahan mentah akan dikembalikan dan dampak jurnal pada General Ledger akan dibalik."
              okText="Ya, Revert"
              cancelText="Batal"
              disabled={!canRevert || !canEdit}
              onConfirm={() => handleRevert(record.id)}
            >
              <Button
                type="primary"
                danger
                style={{ background: 'orange' }}
                icon={<ArrowLeft />}
                disabled={!canRevert || !canEdit}
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
          hasAccessButton(access, '/raw-material-issue', 'add') ? '/raw-material-issue/add' : ''
        }
        titleCard="Data Barang Mentah Keluar"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataSource}
        key={String(access)}
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
            setTable((prev) => ({ ...prev, page }));
          }}
        />
      </Card>
    </>
  );
}
