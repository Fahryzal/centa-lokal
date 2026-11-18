import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Pagination, type TableColumnsType, InputRef, TableColumnType } from 'antd';
import { useRef } from 'react';
import { Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { FilePdf, MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { currencyFormatter, hasAccessButton } from '@/utils/helper';
import 'photoviewer/dist/photoviewer.css';
import { ButtonDetailGroup, ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import * as OrderPraInterfaces from '@pages/marketing/order-pra/interface/OrderPraInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import RenderInput from './structure/Components/RenderInput';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { useState } from '@/hooks/React/useState';
import { Button, Card } from '@/components/ui';
import { useDelOrderRN, useOrderRN } from './hooks/useOrderRN';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { handleMessageError } from '@/utils/func/func';
import { useAccess } from '@/contexts/AccessContext';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof OrderPraInterfaces.PurchaseOrderData;

export default function OrderRNPage() {
  const navigate = useAppNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    subtotalAmount: null,
    orderNumber: null,
    customerName: null,
    franco: null,
    description: null,
    typePo: 'RN',
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const { data, isLoading, isError } = useOrderRN(params);
  const del = useDelOrderRN();
  globalHooks.useFetchOptions(unit, setUnit, OrderPraAxios.fetchDataUnit, [unit.nama]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setParams((prev) => ({ ...prev, page: 1, [dataIndex]: selectedKeys[0] }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    clearFilters();
    setSearchText('');
    confirm();
    setParams((prev) => ({ ...prev, [dataIndex]: null }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<OrderPraInterfaces.PurchaseOrderData> => ({
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
    navigate(`/po-order-prn/edit/${id}`);
  };

  const handleDetail = (id: string) => {
    navigate(`/po-order-prn/detail/${id}`);
  };
  const handleOpenFile = async (url: string) => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(url);
      if (data) {
        const link = document.createElement('a');
        link.href = data;
        link.target = '_blank';
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await del.mutateAsync(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const baseColumns = (acc: any): TableColumnsType<OrderPraInterfaces.PurchaseOrderData> => [
    {
      title: 'Nomor Pesanan',
      dataIndex: 'orderNumber',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('orderNumber'),
    },

    {
      title: 'Nama Customer',
      dataIndex: 'customerName',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('customerName'),
    },
    {
      title: 'Tanggal Pesanan',
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
      title: 'Deskripsi',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Harga Total',
      dataIndex: 'subtotalAmount',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('subtotalAmount'),
      render: (_: any, record: any) => {
        return <p>Rp{currencyFormatter(record.subtotalAmount)}</p>;
      },
    },
    {
      title: 'Pesanan',
      dataIndex: 'fileUrl',
      width: 200,
      align: 'center',
      render: (fileUrl: string) => {
        return (
          <Button
            style={{
              backgroundColor: '#309898',
              borderColor: '#309898',
              color: 'white',
            }}
            icon={<FilePdf />}
            onClick={() => handleOpenFile(fileUrl)}
          >
            Pesanan
          </Button>
        );
      },
    },

    {
      title: 'Kontrak',
      dataIndex: 'fileUrlKontrak',
      width: 200,
      align: 'center',
      render: (fileUrlKontrak: string) => {
        return (
          <Button
            style={{
              backgroundColor: '#309898',
              borderColor: '#309898',
              color: 'white',
            }}
            icon={<FilePdf />}
            onClick={() => handleOpenFile(fileUrlKontrak)}
          >
            Kontrak
          </Button>
        );
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <ButtonDetailGroup
            disabled={!hasAccessButton(acc, '/po-order-prn', 'view')}
            onClick={() => handleDetail(record.id)}
          />
          <ButtonEditGroup
            disabled={
              !record?.status?.toLowerCase()?.includes('waiting') ||
              !hasAccessButton(acc, '/po-order-prn', 'edit')
            }
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            disabled={!record?.status?.toLowerCase()?.includes('waiting')}
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={
                !record?.status?.toLowerCase()?.includes('waiting') ||
                !hasAccessButton(acc, '/po-order-prn', 'delete')
              }
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Hapus
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
        scroll={{ x: 'max-content' }}
        linkAdd={hasAccessButton(access, '/po-order-prn', 'add') ? '/po-order-prn/add' : ''}
        titleCard="Data Pesanan (PRN)"
        loading={isLoading}
        baseColumns={baseColumns(access)}
        dataSource={data?.data.data}
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
          key={params.page}
          defaultCurrent={data?.data.totalData}
          total={data?.data.totalData}
          defaultPageSize={params.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setParams((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </>
  );
}
