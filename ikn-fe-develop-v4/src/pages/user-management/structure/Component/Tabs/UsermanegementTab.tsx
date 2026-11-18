import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType, Tag } from 'antd';
import * as UserManagementAxios from '@/pages/user-management/service/UserManagementAxios';
import { useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import { getRandomColor, hasAccessButton } from '@/utils/helper';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { useAccess } from '@/contexts/AccessContext';
import RenderInput from '../RenderInput';
import { showNotification } from '@/contexts/services/notificationService';
import { useUsers } from '@/pages/user-management/hooks/useUsers';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { DatumType } from '@/pages/user-management/interface/UsermanagementInterfaces';
import { handleMessageError } from '@/utils/func/func';

type DataIndex = keyof DatumType;

export default function UserManagemenTab() {
  const navigate = useNavigate();
  const { access, loading } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [idDelete, setIdDelete] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    page: 1,
    limit: 5,
    loading: false,
    name: null,
    email: null,
    jabatan: null,
    nik: null,
    roles: null,
    total: 0,
  });
  const { data, isLoading, isError } = useUsers(dataTable);

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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DatumType> => ({
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
    navigate(`/user-management/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await UserManagementAxios.delUserManagamenent(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<DatumType> => [
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
      title: 'Jabatan',
      dataIndex: 'jabatan',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('jabatan'),
    },
    {
      title: 'Nik',
      dataIndex: 'nik',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('nik'),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('roles'),
      render: (_: any, record: DatumType) => {
        return (
          <span style={{ display: 'flex', gap: 5, flexDirection: 'column' }}>
            {record.roles.map((tag: string) => {
              return (
                <Tag color={getRandomColor()} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: DatumType) => (
        <Space>
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/user-management', 'edit')}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/user-management', 'edit')}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isError) {
    return <AlertCustome />;
  }

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'maxWidth' }}
        linkAdd={hasAccessButton(access, '/user-management', 'add') ? '/user-management/add' : ''}
        titleCard="Data User"
        loading={isLoading || loading}
        baseColumns={baseColumns(access)}
        dataSource={data?.data.filter((item: DatumType) => item.id != idDelete)}
        key={access as any} //ini masalahnya
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
          total={data?.total || 0}
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
