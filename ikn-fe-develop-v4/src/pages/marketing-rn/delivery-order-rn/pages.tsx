import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';
import * as DeliveryOrderPraInterfaces from '@pages/marketing/delivery-order-pra/interface/DeliveryOrderPraInterfaces';
import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ButtonDetailGroup } from '@/components/atoms/button/buttonTableGroups';
import RenderInput from './structure/Components/RenderInput';
import { showNotification } from '@/contexts/services/notificationService';
import { useAccess } from '@/contexts/AccessContext';
import { hasAccessButton } from '@/utils/helper';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof DeliveryOrderPraInterfaces.PurchaseOrderType;

export default function DeliveryOrderRNPage() {
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
    date: null,
    total: 0,
    status: null,
    franco: null,
    description: null,
    address: null,
    customerName: null,
    orderNumber: null,
    typeSalesDelivery: 'RN',
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await DeliveryOrderPraAxios.fetchDataDeliveryOrderPra(dataTable);
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
    dataTable.franco,
    dataTable.description,
    dataTable.address,
    dataTable.customerName,
    dataTable.orderNumber,
  ]);

  const dataSource: DeliveryOrderPraInterfaces.ItemType[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  globalHooks.useFetchOptions(unit, setUnit, DeliveryOrderPraAxios.fetchDataUnit, [unit.nama]);

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
  ): TableColumnType<DeliveryOrderPraInterfaces.ItemType> => ({
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
    navigate(`/delivery-order-prn/detail/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await DeliveryOrderPraAxios.delDeliveryOrderPra(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Delete Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Delete Data');
    }
  };

  const baseColumns = (acc: any): TableColumnsType<any> => [
    {
      title: 'Nomor Pesanan',
      dataIndex: ['purchaseOrder', 'orderNumber'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: 'Nama Customer',
      dataIndex: ['purchaseOrder', 'customerName'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
    },
    {
      title: 'Alamat Customer',
      dataIndex: ['purchaseOrder', 'customer', 'address'],
      width: 400,
      align: 'center',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Deskrpsi',
      dataIndex: ['purchaseOrder', 'description'],
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },

    {
      title: 'Franco',
      dataIndex: ['purchaseOrder', 'franco'],
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
      render: (_: string, record: DeliveryOrderPraInterfaces.DatumType) => (
        <Space>
          <ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/delivery-order-prn', 'view')}
            onClick={() => handleDetail(record.id)}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={!hasAccessButton(acc, '/delivery-order-prn', 'delete')}
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
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={
          hasAccessButton(access, '/delivery-order-prn', 'add') ? '/delivery-order-prn/add' : ''
        }
        titleCard="Data Pengiriman Pesanan (PRN)"
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
