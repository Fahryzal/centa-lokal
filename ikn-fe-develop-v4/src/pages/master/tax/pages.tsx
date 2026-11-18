import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { showNotification } from '@/contexts/services/notificationService';
import * as TaxAxios from '@pages/master/tax/service/TaxAxios';
import * as TaxInterfaces from '@pages/master/tax/interface/TaxInterfaces';
import RenderInput from './structure/Components/RenderInput';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';

type DataIndex = keyof TaxInterfaces.TaxtType;

export default function TaxPage() {
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
    taxType: null,
    taxValue: 0,
    accountCode: null,
    type: null,
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await TaxAxios.fetchDataPajak(dataTable);
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
    dataTable.total,
    dataTable.taxType,
    dataTable.taxValue,
    dataTable.accountCode,
    dataTable.type,
  ]);
  const dataSource: TaxInterfaces.TaxtType[] = useMemo(() => dataTable.data, [dataTable.data]);

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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<TaxInterfaces.TaxtType> => ({
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
    navigate(`/tax/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await TaxAxios.delTax(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Delete Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Delete Data');
    }
  };

  const baseColumns = (acc: any): TableColumnsType<TaxInterfaces.TaxtType> => [
    {
      title: 'Nama Pajak',
      dataIndex: 'taxType',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('taxType'),
    },
    {
      title: 'Nilai',
      dataIndex: 'taxValue',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('taxValue'),
    },
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('accountCode'),
    },
    {
      title: 'Type Tax',
      dataIndex: 'type',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('type'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: TaxInterfaces.TaxtType) => (
        <Space>
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/tax', 'edit')}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/tax', 'delete')}
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
        linkAdd={hasAccessButton(access, '/tax', 'add') ? '/tax/add' : ''}
        titleCard="Data Unit"
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
