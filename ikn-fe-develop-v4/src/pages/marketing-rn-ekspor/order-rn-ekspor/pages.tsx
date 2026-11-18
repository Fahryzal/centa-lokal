import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { Card, Pagination, type TableColumnsType, InputRef, TableColumnType, Upload } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import * as OrderEksporRNAxios from '@pages/marketing-rn-ekspor/order-rn-ekspor/service/OrderEksporRNAxios';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router';
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
import { useAccess } from '@/contexts/AccessContext';
dayjs.extend(utc);
dayjs.extend(timezone);

type DataIndex = keyof OrderPraInterfaces.PurchaseOrderData;

export default function OrderEksporRNPage() {
  const navigate = useNavigate();
  const { access } = useAccess();
  const [searchText, setSearchText] = useState('');
  const [idDelete, setIdDelete] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    orderNumber: null,
    customerName: null,
    franco: null,
    description: null,
    subtotalAmount: null,
    typePo: 'RN_EKSPOR',
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  useEffect(() => {
    fetch();
  }, [
    dataTable.page,
    dataTable.date,
    dataTable.status,
    dataTable.orderNumber,
    dataTable.customerName,
    dataTable.franco,
    dataTable.description,
    dataTable.subtotalAmount,
  ]);

  const fetch = async () => {
    const res = await OrderPraAxios.fetchDataOrderPra(dataTable);
    setTable((prev) => ({
      ...prev,
      data: res?.data.data.data,
      loading: false,
      total: res?.data.data.totalData,
    }));
  };

  const dataSource: OrderPraInterfaces.PurchaseOrderItemType[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  globalHooks.useFetchOptions(unit, setUnit, OrderPraAxios.fetchDataUnit, [unit.nama]);

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
    navigate(`/po-order-prn-ekspor/edit/${id}`);
  };

  const handleDetail = (id: string) => {
    navigate(`/po-order-prn-ekspor/detail/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await OrderPraAxios.delOrderPra(id);
      setIdDelete(id);
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Hapus Data');
    }
  };

  const baseColumns = (
    loadingCol: boolean,
    acc: any
  ): TableColumnsType<OrderPraInterfaces.PurchaseOrderData> => [
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
      render: (subtotalAmount: number) => {
        return <p>${currencyFormatter(subtotalAmount)}</p>;
      },
    },
    {
      title: 'Telah dibayarkan',
      dataIndex: 'downPayment',
      width: 200,
      align: 'center',
      render: (downPayment: number) => {
        return <p>${currencyFormatter(Number(downPayment || 0))}</p>;
      },
    },
    {
      title: 'File BL',
      dataIndex: 'fileUrlBl',
      width: 200,
      align: 'center',
      render: (fileUrlBl: string, record: any) => {
        return (
          <Upload
            onChange={(e) => uploadFileBL(record.id, e)}
            beforeUpload={() => false}
            maxCount={1}
            key={Math.random()}
          >
            <Button
              key={Math.random()}
              disabled={loadingCol}
              loading={loadingCol}
              style={{
                background: fileUrlBl ? '#799EFF' : undefined,
                color: fileUrlBl ? 'white' : undefined,
              }}
              icon={<UploadOutlined />}
            >
              {fileUrlBl && !loading ? 'Edit File' : 'Pilih File'}
            </Button>
          </Upload>
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
            disabled={!hasAccessButton(acc, '/po-order-prn-ekspor', 'view')}
            onClick={() => handleDetail(record.id)}
          />
          <ButtonEditGroup
            disabled={!hasAccessButton(acc, '/po-order-prn-ekspor', 'edit')}
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
                !hasAccessButton(acc, '/po-order-prn-ekspor', 'delete')
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

  const uploadFileBL = async (id: string, values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const originalFile = values?.file;
      const renamedFile = new File(
        [originalFile],
        `${Date.now()}-${originalFile.name}-BL`, // nama file baru
        { type: originalFile.type }
      );

      try {
        if (values?.file) {
          formData.append('file', renamedFile);
          await OrderEksporRNAxios.uploadFileOrderPra(formData);
        }
      } catch (e) {
        setLoading(false);
        showNotification('warning', 'Gagal', 'Gagal Upload File');
      }

      await OrderEksporRNAxios.updateFileBL(id, {
        fileUrlBl: renamedFile.name,
      });
      fetch();
      showNotification('success', 'Berhasil', 'Berhasil Upload File');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      showNotification('warning', 'Gagal', 'Gagal Upload File');
    }
  };

  return (
    <>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        linkAdd={
          hasAccessButton(access, '/po-order-prn-ekspor', 'add') ? '/po-order-prn-ekspor/add' : ''
        }
        titleCard="Data Pesanan (RN Ekspor)"
        loading={dataTable.loading}
        baseColumns={baseColumns(loading, access)}
        key={access as any}
        dataSource={dataSource}
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
