import { Space, type TableColumnsType, InputRef, TableColumnType, Pagination, Input } from 'antd';
import { useRef } from 'react';

import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { currencyFormatter } from '@/utils/helper';
import { useState } from '@/hooks/React/useState';
import * as OrderPraInterfaces from '@pages/marketing/order-pra/interface/OrderPraInterfaces';
import { Button, Card, Modal, Table } from '@/components/ui';
import dayjs from 'dayjs';
import { useOrderRN } from '@pages/marketing-rn/order-rn/hooks/useOrderRN';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';

type DataIndex = keyof OrderPraInterfaces.PurchaseOrderData;

export default function ModalHistoriOrder({
  setOpen,
  open,
  handleRowDoubleClick,
}: Readonly<{ setOpen: Function; open: boolean; handleRowDoubleClick: Function }>) {
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
  const { data, isLoading, isError } = useOrderRN(params);

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
    sorter: true,
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
  const baseColumns: TableColumnsType<OrderPraInterfaces.PurchaseOrderData> = [
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
      render: (_: any, record: OrderPraInterfaces.PurchaseOrderData) => (
        <span>{dayjs(record.date).format('DD MMM YYYY')}</span>
      ),
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
      render: (_: any, record: OrderPraInterfaces.PurchaseOrderData) => {
        return <p>Rp{currencyFormatter(record.subtotalAmount)}</p>;
      },
    },
  ];

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    const sortField = sorter.field;
    const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    setParams((prev) => ({ ...prev, sortBy: sortField, sortOrder: sortOrder }));
  };

  if (isError) {
    return <AlertCustome />;
  }

  return (
    <Modal
      title={<p>Pilih Pesanan</p>}
      loading={params.loading}
      open={open}
      width={{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
      ]}
    >
      <Table<OrderPraInterfaces.PurchaseOrderData>
        rowKey="key"
        bordered={true}
        scroll={{ x: 'max-content' }} // Hindari overflow
        columns={baseColumns}
        dataSource={data?.data.data as any}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={false}
        rowClassName={(_record: OrderPraInterfaces.PurchaseOrderData, index: number) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
        onRow={(record: OrderPraInterfaces.PurchaseOrderData) => {
          return {
            onDoubleClick: () => handleRowDoubleClick(record),
          };
        }}
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
          key={data?.data.totalData}
          defaultCurrent={params.page}
          total={data?.data.totalData}
          defaultPageSize={data?.data.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setParams((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </Modal>
  );
}
