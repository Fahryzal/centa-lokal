import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space } from 'antd';

import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as CrossChekPajakAxios from '@/pages/keuangan/cross-chek-pajak/service/CrossChekPajakAxios';
import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';

import { useNavigate } from 'react-router';

import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import * as CrossChekPajak from '@pages/keuangan/cross-chek-pajak/interface/CrossChekPajak';
import RenderInput from './RenderInput';
import { EditOutlined } from '@ant-design/icons';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof CrossChekPajak.DatumType;

export default function CrossChekPajakRA() {
  const navigate = useNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [idDelete, _setIdDelete] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    isComplete: 'YES',
    typeSalesSPb: 'RA',
    orderNumber: null,
    description: null,
    franco: null,
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 50,
    loading: false,
    nama: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await SpbsAxios.fetchDataSpbs(dataTable);
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
    dataTable.date,
    dataTable.status,
    dataTable.description,
    dataTable.orderNumber,
    dataTable.franco,
  ]);

  const dataSource: CrossChekPajak.DatumType[] = useMemo(() => dataTable.data, [dataTable.data]);

  globalHooks.useFetchOptions(unit, setUnit, CrossChekPajakAxios.fetchDataUnit, [unit.nama]);

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
  ): TableColumnType<CrossChekPajak.DatumType> => ({
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

  const handleDetail = (id: string) => {
    navigate(`/cross-chek-pajak/detail/${id}`);
  };

  const handleAddPajak = (id: string) => {
    navigate(`/cross-chek-pajak/add/${id}`);
  };

  const handleUpdatePajak = (id: string) => {
    navigate(`/cross-chek-pajak/edit/${id}`);
  };
  const baseColumns = (acc: any): TableColumnsType<CrossChekPajak.DatumType> => [
    {
      title: 'Nomor Pesanan',
      dataIndex: 'orderNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Tanggal Pembuatan',
      dataIndex: 'date',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('date'),
      render: (_: any, record: any) => <span>{dayjs(record.date).format('DD MMM YYYY')}</span>,
    },

    {
      title: 'Franco',
      dataIndex: 'franco',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('franco'),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/cross-chek-pajak', 'view')}
            onClick={() => handleDetail(record.id)}
          />
          {!record?.isCekPajak && (
            <Button
              style={{
                backgroundColor: 'green',
                borderColor: 'green',
                color: 'white',
              }}
              disabled={!hasAccessButton(acc, '/cross-chek-pajak', 'add')}
              icon={<Plus />}
              onClick={() => handleAddPajak(record.id)}
            >
              Tambah Pajak
            </Button>
          )}

          {record?.isCekPajak && (
            <Button
              style={{
                backgroundColor: 'green',
                borderColor: 'green',
                color: 'white',
              }}
              disabled={!hasAccessButton(acc, '/cross-chek-pajak', 'edit')}
              icon={<EditOutlined />}
              onClick={() => handleUpdatePajak(record.id)}
            >
              Ubah Pajak
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        titleCard="Data Pajak"
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
