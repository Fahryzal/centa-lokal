import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Card,
  Pagination,
  type InputRef,
  type TableColumnsType,
  type TableColumnType,
} from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as BarangJadiAxios from '@pages/master/barang-jadi/service/BarangJadiAxios';

interface DataType {
  id: string;
  kodeBarang: string;
  kodeUnit: string;
  kodeKategori: string;
  kodeSatuan: string;
  namaBarang: string;
  kategori: string;
  Unit: number | string;
  stock: number;
  satuan: string;
  spesifikasi?: string;
  nilaiSatuan?: number;
}

type DataIndex = keyof DataType;

interface ModalBarangJadiProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  handleRowDoubleClick: (record: DataType) => void;
}

interface TableState {
  data: DataType[];
  page: number;
  limit: number;
  loading: boolean;
  kode: string | null;
  keterangan: string | null;
  total: number;
  kodeBarang: string | null;
  kodeKategori: string | null;
  nama: string | null;
  unit: string | null;
  namaBarang: string | null;
  spesifikasi: string | null;
  kodeSatuan: string | null;
  sortBy: string;
  sortOrder: string;
}

export default function ModalBarangJadi({
  setOpen,
  open,
  handleRowDoubleClick,
}: Readonly<ModalBarangJadiProps>) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [dataTable, setTable] = useState<TableState>({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    kode: null,
    keterangan: null,
    total: 0,
    kodeBarang: null,
    kodeKategori: null,
    nama: null,
    unit: null,
    namaBarang: null,
    spesifikasi: null,
    kodeSatuan: null,
    sortBy: '',
    sortOrder: '',
  });

  // Memuat data barang dari API master barang jadi.
  const fetchData = useCallback(async () => {
    setTable((prev) => ({ ...prev, loading: true }));

    try {
      const params = {
        page: dataTable.page,
        limit: dataTable.limit,
        kode: dataTable.kode || undefined,
        keterangan: dataTable.keterangan || undefined,
        kodeBarang: dataTable.kodeBarang || undefined,
        kodeKategori: dataTable.kodeKategori || undefined,
        nama: dataTable.nama || undefined,
        namaBarang: dataTable.namaBarang || undefined,
        unit: dataTable.unit || undefined,
        spesifikasi: dataTable.spesifikasi || undefined,
        kodeSatuan: dataTable.kodeSatuan || undefined,
        sortBy: dataTable.sortBy || undefined,
        sortOrder: dataTable.sortOrder || undefined,
      };

      const res = await BarangJadiAxios.fetchDataBarangjadi(params);

      // Mengikuti struktur respons yang digunakan pada kode awal:
      // res.data.data.data = daftar barang
      // res.data.data.totalData = jumlah seluruh data
      const responseData = res?.data?.data;

      setTable((prev) => ({
        ...prev,
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        total: Number(responseData?.totalData ?? 0),
      }));
    } catch (error) {
      console.error('Gagal mengambil daftar barang jadi:', error);

      setTable((prev) => ({
        ...prev,
        data: [],
        total: 0,
      }));
    } finally {
      setTable((prev) => ({ ...prev, loading: false }));
    }
  }, [
    dataTable.page,
    dataTable.limit,
    dataTable.kode,
    dataTable.keterangan,
    dataTable.kodeBarang,
    dataTable.kodeKategori,
    dataTable.nama,
    dataTable.unit,
    dataTable.namaBarang,
    dataTable.spesifikasi,
    dataTable.kodeSatuan,
    dataTable.sortBy,
    dataTable.sortOrder,
  ]);

  // Fetch saat modal dibuka dan saat parameter pencarian berubah.
  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  // Menghubungkan nama kolom tabel dengan parameter pencarian API.
  const getSearchField = (dataIndex: DataIndex): keyof TableState | null => {
    switch (dataIndex) {
      case 'kodeBarang':
        return 'kodeBarang';
      case 'namaBarang':
        return 'namaBarang';
      case 'kategori':
        return 'kodeKategori';
      case 'satuan':
        return 'kodeSatuan';
      case 'Unit':
        return 'unit';
      case 'spesifikasi':
        return 'spesifikasi';
      default:
        return null;
    }
  };

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();

    const field = getSearchField(dataIndex);

    if (!field) return;

    setTable((prev) => ({
      ...prev,
      page: 1,
      [field]: String(selectedKeys[0] ?? '').trim() || null,
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

    const field = getSearchField(dataIndex);

    if (!field) return;

    setTable((prev) => ({
      ...prev,
      page: 1,
      [field]: null,
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
        <Input
          ref={searchInput}
          placeholder={`Cari ${String(dataIndex)}`}
          value={selectedKeys[0] as string | undefined}
          onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />

        <Space wrap>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<MagnifyingGlass />}
            size="small"
          >
            Cari
          </Button>

          <Button
            onClick={() => {
              if (clearFilters) {
                handleReset(clearFilters, confirm, dataIndex);
              }
            }}
            size="small"
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              setSearchText(String(selectedKeys[0] ?? ''));
              setSearchedColumn(String(dataIndex));
              confirm({ closeDropdown: false });
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
      onOpenChange(visible) {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (value) => {
      const text = String(value ?? '');

      return searchedColumn === String(dataIndex) && searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text}
        />
      ) : (
        text
      );
    },
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      width: 200,
      align: 'center',
      sorter: true,
      ...getColumnSearchProps('kodeBarang'),
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      width: 220,
      align: 'center',
      sorter: true,
      ...getColumnSearchProps('namaBarang'),
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      width: 180,
      align: 'center',
      ...getColumnSearchProps('kategori'),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      width: 140,
      align: 'center',
      ...getColumnSearchProps('satuan'),
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      width: 160,
      align: 'center',
      ...getColumnSearchProps('Unit'),
    },
  ];

  const handleTableChange = (_pagination: unknown, _filters: unknown, sorter: any) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTable((prev) => ({
      ...prev,
      page: 1,
      sortBy: activeSorter?.order ? String(activeSorter.field ?? '') : '',
      sortOrder:
        activeSorter?.order === 'ascend' ? 'asc' : activeSorter?.order === 'descend' ? 'desc' : '',
    }));
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Pilih Produk"
      open={open}
      width={{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      onCancel={closeModal}
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Batal
        </Button>,
      ]}
    >
      <Table<DataType>
        rowKey="id"
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataTable.data}
        loading={dataTable.loading}
        onChange={handleTableChange}
        pagination={false}
        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        onRow={(record) => ({
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
        locale={{
          emptyText: dataTable.loading ? 'Memuat data...' : 'Data barang jadi tidak ditemukan.',
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
          current={dataTable.page}
          pageSize={dataTable.limit}
          total={dataTable.total}
          showLessItems
          showSizeChanger={false}
          showQuickJumper
          disabled={dataTable.loading}
          onChange={(page) => {
            setTable((prev) => ({ ...prev, page }));
          }}
        />
      </Card>

      <div
        style={{
          marginTop: 8,
          color: '#888',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        Klik dua kali pada baris barang untuk memilih produk.
      </div>
    </Modal>
  );
}
