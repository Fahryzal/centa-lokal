import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  type TableColumnsType,
  type InputRef,
  type TableColumnType,
  Card,
  Pagination,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

import * as BarangJadiIssueAxios from '@pages/gudang/barang-jadi-issue/service/BarangJadiIssueAxios';

interface DataType {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  stok?: number;
  nilaiSatuan?: number;
}

type DataIndex = keyof DataType;

interface ModalProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  handleRowDoubleClick: (record: DataType) => void;
}

export default function ModalBarangJadiIssue({ setOpen, open, handleRowDoubleClick }: ModalProps) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [dataTable, setTable] = useState({
    data: [] as DataType[],
    page: 1,
    limit: 5,
    loading: false,
    kodeBarang: '',
    namaBarang: '',
    kategori: '',
    sortBy: '',
    sortOrder: '',
    total: 0,
  });

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setTable((prev) => ({ ...prev, loading: true }));

        const res = await BarangJadiIssueAxios.fetchBarangJadiForIssue({
          page: dataTable.page,
          limit: dataTable.limit,
          kodeBarang: dataTable.kodeBarang || undefined,
          namaBarang: dataTable.namaBarang || undefined,
          kategori: dataTable.kategori || undefined,
          sortBy: dataTable.sortBy || undefined,
          sortOrder: dataTable.sortOrder || undefined,
        });

        // Menyesuaikan dengan response endpoint master barang jadi.
        const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

        const mappedRows: DataType[] = rows.map((item: any) => ({
          ...item,
          satuan: item.satuan ?? item.Satuan ?? '',
          stok: item.stok ?? item.stock ?? 0,
        }));

        console.log('DATA BARANG JADI DARI API:', res);
        console.log('DATA ROW BARANG JADI:', mappedRows);

        const total = res?.totalData ?? res?.total ?? mappedRows.length;

        setTable((prev) => ({
          ...prev,
          data: mappedRows,
          total,
          loading: false,
        }));
      } catch (error) {
        setTable((prev) => ({
          ...prev,
          data: [],
          total: 0,
          loading: false,
        }));
      }
    };

    fetchData();
  }, [
    open,
    dataTable.page,
    dataTable.limit,
    dataTable.kodeBarang,
    dataTable.namaBarang,
    dataTable.kategori,
    dataTable.sortBy,
    dataTable.sortOrder,
  ]);

  const dataSource: DataType[] = useMemo(() => dataTable.data, [dataTable.data]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();

    setTable((prev) => ({
      ...prev,
      page: 1,
      [dataIndex]: selectedKeys[0] || '',
    }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    clearFilters();
    setSearchText('');
    confirm();

    setTable((prev) => ({
      ...prev,
      page: 1,
      [dataIndex]: '',
    }));
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    sorter: true,
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
        <Input
          ref={searchInput}
          placeholder={`Cari ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<MagnifyingGlass />}
            size="small"
          >
            Cari
          </Button>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
            size="small"
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0] || '');
              setSearchedColumn(dataIndex);
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

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      width: 180,
      align: 'center',
      ...getColumnSearchProps('kodeBarang'),
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('namaBarang'),
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      width: 150,
      align: 'center',
      ...getColumnSearchProps('kategori'),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      width: 120,
      align: 'center',
    },
    {
      title: 'Stok',
      dataIndex: 'stok',
      width: 120,
      align: 'center',
      render: (value) => value ?? 0,
    },
  ];

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setTable((prev) => ({
      ...prev,
      page: 1,
      sortBy: sorter.field || '',
      sortOrder: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '',
    }));
  };

  return (
    <Modal
      title="Pilih Barang Jadi"
      open={open}
      width={{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Batal
        </Button>,
      ]}
    >
      <Table<DataType>
        rowKey="id"
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        loading={dataTable.loading}
        onChange={handleTableChange}
        pagination={false}
        rowClassName={(_record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        onRow={(record) => ({
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
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
    </Modal>
  );
}
