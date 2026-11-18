import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Pagination, type TableColumnsType, InputRef, TableColumnType, Tag } from 'antd';
import { useRef } from 'react';
import { Input, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as buttonTableGroups from '@/components/atoms/button/buttonTableGroups';
import * as MasterAkunBankAxios from '@pages/master/master-akun-bank/service/MasterAkunBankAxios';
import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { handleMessageError } from '@/utils/func/func';
import { useEffect } from '@/hooks/React/useEffect';
import { useState } from '@/hooks/React/useState';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';

type DataIndex = keyof MasterAkunBankInterfaces.Datum;

export default function AkunBankPage() {
  const navigate = useAppNavigate();
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
    total: 0,
    branchAddress: null,
    bankName: null,
    bankCode: null,
    accountCode: null,
    bankAccountNumber: null,
  });

  useEffect(() => {
    fetch();
  }, [
    dataTable.page,
    dataTable.branchAddress,
    dataTable.bankName,
    dataTable.bankCode,
    dataTable.accountCode,
    dataTable.bankAccountNumber,
  ]);

  const fetch = async () => {
    const res = await MasterAkunBankAxios.fetchDataAkunBank(dataTable);
    setTable((prev: any) => ({
      ...prev,
      data: res?.data,
      loading: false,
      total: res?.totalData,
    }));
  };

  useEffect(() => {
    const newDdata = dataTable.data.filter((item: any) => item.id != idDelete);
    setTable((prev) => ({ ...prev, page: 1, data: newDdata, total: prev.total - 1 }));
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
  ): TableColumnType<MasterAkunBankInterfaces.Datum> => ({
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

  const handleEdit = (id: string) => {
    navigate(`/akun-bank/edit/${id}`);
  };

  const handleDetail = (id: string) => {
    navigate(`/akun-bank/detail/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await MasterAkunBankAxios.delAkunBank(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('warning', 'Perhatian', message);
    }
  };

  const handleRvert = async (id: string) => {
    try {
      await MasterAkunBankAxios.revertAkunBank(id);
      showNotification('success', 'Berhasil', 'Berhasil revert Data');
      fetch();
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('warning', 'Perhatian', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<MasterAkunBankInterfaces.Datum> => [
    {
      title: 'Akun',
      dataIndex: 'accountCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('accountCode'),
    },
    {
      title: 'Nama Bank',
      dataIndex: 'bankName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('bankName'),
    },
    {
      title: 'Nomor Rekening',
      dataIndex: 'bankAccountNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('bankAccountNumber'),
    },
    {
      title: 'Alamat Bank',
      dataIndex: 'branchAddress',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('branchAddress'),
    },
    {
      title: 'Kode',
      dataIndex: 'bankCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('bankCode'),
    },
    {
      title: 'Status',
      dataIndex: 'isPosted',
      width: 200,
      align: 'center',
      render: (isPosted: string) => {
        return (
          <span>
            {isPosted === 'Y' ? <Tag color="green">Confirmed</Tag> : <Tag color="red">Draft</Tag>}
          </span>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      fixed: 'right',

      render: (_: any, record: MasterAkunBankInterfaces.Datum) => (
        <Space>
          <buttonTableGroups.ButtonEditGroup
            disabled={!hasAccessButton(acc, '/akun-bank', 'edit') || record.isPosted === 'Y'}
            onClick={() => handleEdit(record.id)}
          />

          <buttonTableGroups.ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/akun-bank', 'view')}
            onClick={() => handleDetail(record.id)}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/akun-bank', 'delete') || record.isPosted === 'Y'}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Apakah Anda yakin ingin revert data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleRvert(record.id)} // Fungsi delete
          >
            <Button
              disabled={record.isPosted === 'N'}
              type="primary"
              style={{
                background: 'orange',
              }}
              icon={<ArrowLeft />}
            >
              Revert
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }}
        linkAdd={hasAccessButton(access, '/akun-bank', 'add') ? '/akun-bank/add' : ''}
        titleCard="Data Satuan"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataTable.data}
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
