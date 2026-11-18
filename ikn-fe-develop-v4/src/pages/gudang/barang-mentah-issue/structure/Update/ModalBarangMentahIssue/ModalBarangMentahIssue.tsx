import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  type TableColumnsType,
  InputRef,
  TableColumnType,
  Card,
  Pagination,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
// import * as BarangJadiAxios from "@pages/master/barang-jadi/service/BarangJadiAxios";
import * as RawMaterialAxios from '@pages/master/barang-mentah/service/RawMaterialAxios';

interface DataType {
  id: string;
  kodeBarang: string;
  kodeUnit: string;
  kodeKategori: string;
  kodeSatuan: string;
  namaBarang: string;
  kategori: string;
  unit: string;
  stock: number;
  satuan: string;
  itemCode: string;
}
type DataIndex = keyof DataType;

export default function ModalBarangMentahIssue({
  setOpen,
  open,
  handleRowDoubleClick,
}: Readonly<{ setOpen: Function; open: boolean; handleRowDoubleClick: Function }>) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
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
    satuan: null,
    namaBarang: null,
    spesifikasi: null,
    kodeSatuan: null,
    itemCode: null,
    sortBy: '',
    sortOrder: '',
  });

  useEffect(() => {
    const { namaBarang, ...rest } = dataTable;
    const params = { ...rest, itemName: namaBarang };
    const fetch = async () => {
      const res = await RawMaterialAxios.fetchDataRawMaterial(params);
      setTable((prev) => ({
        ...prev,
        data: res?.data.data,
        loading: false,
        total: res?.data.totalData,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.keterangan,
    dataTable.kode,
    dataTable.kodeBarang,
    dataTable.kodeKategori,
    dataTable.nama,
    dataTable.unit,
    dataTable.namaBarang,
    dataTable.spesifikasi,
    dataTable.kodeSatuan,
    dataTable.sortBy,
    dataTable.sortOrder,
    dataTable.satuan,
    dataTable.itemCode,
  ]);

  const dataSource: DataType[] = useMemo(() => dataTable.data, [dataTable.data]);

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
          placeholder={`Search ${dataIndex}`}
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

  const baseColumns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'itemCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('itemCode'),
    },

    {
      title: 'Nama Barang',
      dataIndex: 'itemName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('namaBarang'),
    },

    {
      title: 'Satuan',
      dataIndex: 'satuan',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('satuan'),
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('unit'),
    },
  ];

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    const sortField = sorter.field;
    const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    setTable((prev) => ({ ...prev, sortBy: sortField, sortOrder: sortOrder }));
  };

  return (
    <Modal
      title={<p>Pilih Produk</p>}
      loading={dataTable.loading}
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
          Cancel
        </Button>,
      ]}
    >
      <Table<DataType>
        rowKey="id"
        bordered={true}
        scroll={{ x: 'max-content' }} // Hindari overflow
        columns={baseColumns}
        dataSource={dataSource}
        loading={dataTable.loading}
        onChange={handleTableChange}
        pagination={false}
        rowClassName={(_record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        onRow={(record) => {
          return {
            onDoubleClick: () => handleRowDoubleClick(record),
          };
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
    </Modal>
  );
}
