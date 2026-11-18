import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import * as AccountAxios from '@pages/master/account-index/account/service/AccountAxios';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import Badges from '@/components/atoms/Badges/Badges';

type DataIndex = keyof AccountInterfaces.AccountParentType;

import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import { exportAccountToExcel } from '@/utils/generateExcel/Account/accountToexcel';
dayjs.extend(utc);
dayjs.extend(timezone);

const RenderInput = (
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

  if (dataIndex.includes('isLocked')) {
    return (
      <Select
        showSearch
        placeholder="Pilih"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'N', label: 'NO' },
          { value: 'Y', label: 'YES' },
        ]}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('accountType')) {
    return (
      <Select
        showSearch
        placeholder="Pilih"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'ASSET', label: 'ASSET' },
          { value: 'LIABILITY', label: 'LIABILITY' },
          { value: 'EQUITY', label: 'EQUITY' },
          { value: 'REVENUE', label: 'REVENUE' },
          { value: 'EXPENSE', label: 'EXPENSE' },
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

export default function AccountPage() {
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
    code: null,
    name: null,
    accountType: null,
    total: 0,
    typeNeraca: null,
    parentName: null,
    isLocked: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await AccountAxios.fetchDataAccount(dataTable as any);
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
    dataTable.code,
    dataTable.name,
    dataTable.accountType,
    dataTable.typeNeraca,
    dataTable.parentName,
    dataTable.isLocked,
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
  ): TableColumnType<AccountInterfaces.AccountParentType> => ({
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

  const handleEdit = (id: string) => {
    navigate(`/akun/edit/${id}`);
  };
  const handleDelete = async (id: string) => {
    try {
      await AccountAxios.delData(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Hapus Data');
    }
  };

  const baseColumns = (acc: any): TableColumnsType<AccountInterfaces.AccountParentType> => [
    {
      title: 'Kode',
      dataIndex: 'code',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Parent Kode',
      dataIndex: 'parentId',
      width: 200,
      align: 'center',
    },
    {
      title: 'Parent Name',
      dataIndex: 'parentName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('parentName'),
      render: (parentName) => <span>{parentName || '-'}</span>,
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Tipe',
      dataIndex: ['accountType', 'name'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('accountType'),
    },
    {
      title: 'Tipe Neraca',
      dataIndex: 'typeNeraca',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('typeNeraca'),
    },
    {
      title: 'Account Locked',
      dataIndex: 'isLocked',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('isLocked'),
      render: (isLocked) => (
        <span>
          {isLocked === 'Y' ? (
            <Badges color="green" text={'YES'} />
          ) : (
            <Badges color="red" text={'NO'} />
          )}
        </span>
      ),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/akun', 'edit')}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/akun', 'delete')}
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

  const handleExportExcel = async () => {
    setLoading(true);
    const res = await AccountAxios.fetchDataAccount({ page: 1, limit: 2500 });
    exportAccountToExcel(res?.data.data.data || ([] as any));
    setLoading(false);
  };

  return (
    <>
      <TableDragDrop
        linkAdd={hasAccessButton(access, '/akun', 'add') ? '/akun/add' : ''}
        titleCard="Data Akun"
        loading={dataTable.loading}
        baseColumns={baseColumns(access)}
        dataSource={dataTable.data}
        key={access as any}
        Other={
          <ButtonFile loading={loading} text="Donwload excel" onClick={() => handleExportExcel()} />
        }
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
