import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as SupplierAxios from '@pages/master/supplier/service/SupplierAxios';
import { useNavigate } from 'react-router';
import { showNotification } from '@/contexts/services/notificationService';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';

interface DataType {
  id: string;
  nomorPengenal: string;
  namaRekanan: string;
  alamatRekanan: string;
  accountCode: string;
}

type DataIndex = keyof DataType;

export default function SupplierPage() {
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
    total: 0,
    loading: false,
    nomorPengenal: '',
    namaRekanan: '',
    alamatRekanan: '',
    accountCode: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await SupplierAxios.fetchDataSupplier(dataTable);
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
    dataTable.nomorPengenal,
    dataTable.alamatRekanan,
    dataTable.namaRekanan,
    dataTable.accountCode,
  ]);

  useEffect(() => {
    const newDdata = dataTable.data.filter((item: any) => item.id != idDelete);
    setTable((prev) => ({
      ...prev,
      page: 1,
      data: newDdata,
      total: prev.total - 1,
    }));
  }, [idDelete]);

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

  const handleEdit = (id: string) => {
    navigate(`/supplier/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await SupplierAxios.delSupplier(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Hpaus Data');
    }
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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

  const baseColumns = (acc: any): TableColumnsType<DataType> => [
    {
      title: 'Nomor Pengenal',
      dataIndex: 'nomorPengenal',
      // width: 80,
      align: 'center',
      ...getColumnSearchProps('nomorPengenal'),
    },
    {
      title: 'Nomor Rekening',
      dataIndex: 'accountCode',
      // width: 80,
      align: 'center',
      ...getColumnSearchProps('accountCode'),
    },
    {
      title: 'Nama Supplier',
      dataIndex: 'namaRekanan',
      // width: 80,
      align: 'center',
      ...getColumnSearchProps('namaRekanan'),
    },
    {
      title: 'Alamat Supplier',
      dataIndex: 'alamatRekanan',
      // width: 80,
      align: 'center',
      ...getColumnSearchProps('alamatRekanan'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      // width: 30,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button
            disabled={!hasAccessButton(acc, '/supplier', 'edit')}
            style={{
              backgroundColor: 'green',
              borderColor: 'green',
              color: 'white',
            }}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/supplier', 'delete')}
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
        scroll={{ x: 100 }}
        linkAdd={hasAccessButton(access, '/supplier', 'add') ? '/supplier/add' : ''}
        titleCard="Data Supplier"
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
          showLessItems={true}
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
