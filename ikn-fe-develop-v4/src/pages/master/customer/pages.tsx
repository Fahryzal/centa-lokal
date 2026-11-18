import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as CustomersAxios from '@pages/master/customer/service/CustomersAxios';
import { useNavigate } from 'react-router';
import { showNotification } from '@/contexts/services/notificationService';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';

interface DataType {
  id: string;
  code: string;
  name: string;
  address: string;
  unit: string;
  email: string;
  phone: string;
  country: string;
  continent: string;
  regional_type: string;
}
type DataIndex = keyof DataType;

export default function CustomersPage() {
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
    code: '',
    name: '',
    total: 0,
    phone: '',
    email: '',
    address: '',
    unit: '',
    country: '',
    continent: '',
    regional_type: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await CustomersAxios.fetchDataCustomer(dataTable);
      setTable((prev) => ({
        ...prev,
        data: res?.data.data.data,
        loading: false,
        total: res?.data.data.total,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.name,
    dataTable.code,
    dataTable.phone,
    dataTable.email,
    dataTable.address,
    dataTable.unit,
    dataTable.country,
    dataTable.continent,
    dataTable.regional_type,
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
    navigate(`/customer/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await CustomersAxios.delCustomer(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Hapus Data');
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
      title: 'Kode',
      dataIndex: 'code',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('unit'),
    },
    {
      title: 'No Hp',
      dataIndex: 'phone',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Negara',
      dataIndex: 'country',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('country'),
      render: (_: any, record: any) => <span>{record.country || '-'}</span>,
    },
    {
      title: 'Benua',
      dataIndex: 'continent',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('continent'),
      render: (_: any, record: any) => <span>{record.continent || '-'}</span>,
    },
    {
      title: 'Regional',
      dataIndex: 'regional_type',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('regional_type'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button
            disabled={!hasAccessButton(acc, '/customer', 'edit')}
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
              disabled={!hasAccessButton(acc, '/customer', 'delete')}
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
        scroll={{ x: 2000 }}
        linkAdd={hasAccessButton(access, '/customer', 'add') ? '/customer/add' : ''}
        titleCard="Data Customer"
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
