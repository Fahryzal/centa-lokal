import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Button,
  Card,
  Pagination,
  Popconfirm,
  Space,
  type TableColumnsType,
  InputRef,
  TableColumnType,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import * as MenuAxios from '@pages/user-management/service/MenuAxios';
import * as MenuInterfaces from 'pages/user-management/interface/MenuInterfaces';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { DeleteOutlined } from '@ant-design/icons';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Highlighter from 'react-highlight-words';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
import { useNavigate } from 'react-router';
import RenderInput from '../RenderInput';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';

type DataIndex = keyof MenuInterfaces.DatumType;

export default function MenuTab() {
  const navigate = useNavigate();
  const { access } = useAccess();
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTable, setTable] = useState<{
    data: MenuInterfaces.DatumType[] | undefined;
    page: number;
    limit: number;
    loading: boolean;
    name: string | null;
    path: string | null;
    parentId: number | null;
    total: number | undefined;
  }>({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: null,
    path: null,
    parentId: null,
    total: 0,
  });

  useEffect(() => {
    fetchMenu();
  }, [dataTable.page, dataTable.name, dataTable.path, dataTable.parentId]);

  const fetchMenu = async () => {
    try {
      const data = await MenuAxios.fetchDataMenus(dataTable as any);
      setTable((prev) => ({ ...prev, data: data?.data, total: data?.total }));
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

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
  ): TableColumnType<MenuInterfaces.DatumType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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

  const baseColumns = (acc: any): TableColumnsType<MenuInterfaces.DatumType> => [
    {
      title: 'Nama',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Path',
      dataIndex: 'path',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('path'),
    },
    {
      title: 'Parent',
      dataIndex: 'parentId',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('parentId'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: MenuInterfaces.DatumType) => (
        <Space>
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/user-management', 'edit')}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/user-management', 'edit')}
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
            >
              hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: MenuInterfaces.DatumType) => {
    navigate(`/user-management/menu/edit/${record.id}`);
  };

  const handleDelete = async (record: MenuInterfaces.DatumType) => {
    setLoading(true);
    try {
      await MenuAxios.deleteMenus(record.id);
      fetchMenu();
      setLoading(false);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e, 'Gagal Hapus Data');
      showNotification('error', 'Gagal', message);
    }
  };

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'maxWidth' }}
        linkAdd={
          hasAccessButton(access, '/user-management', 'add') ? '/user-management/menu/add' : ''
        }
        titleCard="Data Menu"
        dataSource={dataTable.data}
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
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
