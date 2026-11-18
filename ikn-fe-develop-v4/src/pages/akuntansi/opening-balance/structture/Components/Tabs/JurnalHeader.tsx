import React, { useEffect, useRef, useState } from 'react';
import {
  Tag,
  Card,
  Pagination,
  Space,
  Select,
  Input,
  DatePicker,
  InputNumber,
  type TableColumnsType,
  InputRef,
  TableColumnType,
  Button,
  Popconfirm,
  Checkbox,
  Tooltip,
} from 'antd';
import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import { ButtonDetailGroup, ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { useNavigate } from 'react-router';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';
import * as OpeningBalanceAxios from '@pages/akuntansi/opening-balance/service/OpeningBalanceAxios';
import dayjs from 'dayjs';
import { currencyFormatter } from '@/utils/helper';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { showNotification } from '@/contexts/services/notificationService';
import * as helperGlobal from '@/utils/helper';
import { DeleteOutlined } from '@ant-design/icons';
import { handleMessageError } from '@/utils/func/func';
import { useAccess } from '@/contexts/AccessContext';

type DataIndex = keyof OpeningBalanceInterfaces.DatumType;

const renderInput = (
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

  if (dataIndex.includes('totalBalance')) {
    return (
      <InputNumber
        formatter={helperGlobal.formatNumber2Digits}
        parser={helperGlobal.parseNumber2Digits}
        placeholder={`Search ${dataIndex}`}
        value={Number(selectedKeys[0]) || 0}
        onChange={(value) => setSelectedKeys(value !== undefined && value !== null ? [value] : [])}
        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
        controls={false}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('status')) {
    return (
      <Select
        showSearch
        placeholder="Pilih status"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'draft', label: 'DRAFT' },
          { value: 'confirm', label: 'CONFIRM' },
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

function JournalTable({
  data,
  page,
  limit,
  total,
  setDataTable,
  dataTable,
  fetchData,
}: {
  data: OpeningBalanceInterfaces.DatumType[];
  page: number;
  limit: number;
  total: number;
  postCount?: number;
  dataTable: any;
  fetchData: Function;
  setDataTable: React.Dispatch<
    React.SetStateAction<Omit<OpeningBalanceInterfaces.GetOpeningBalanceType, 'setDataTable'>>
  >;
}) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const { user, access } = useAccess();

  const handleDetail = (id: string) => {
    navigate(`/opening-balance/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/opening-balance/edit/${id}`);
  };

  const handleRvert = (id: string) => {
    navigate(`/opening-balance/revert/${id}`);
  };

  const handleOpenRevert = async (id: string) => {
    try {
      setDataTable((prev) => ({
        ...prev,
        loading: true,
      }));
      await OpeningBalanceAxios.openRevert(id);
      setDataTable((prev) => ({
        ...prev,
        loading: false,
      }));
      showNotification('success', 'Berhasil', 'Rever Berhasil di Ubah');
      fetchData();
    } catch (e) {
      setDataTable((prev) => ({
        ...prev,
        loading: false,
      }));
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await OpeningBalanceAxios.delOpeningBalance(id as any);
      setDataTable((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item.id != id),
        loading: false,
      }));
      showNotification('success', 'Berhasil', 'Hapus data Berhasil');
    } catch (e) {
      showNotification('error', 'Gagal', 'Hapus Data Gagal');
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setDataTable((prev) => ({ ...prev, page: 1, [dataIndex]: selectedKeys[0] }));
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    clearFilters();
    setSearchText('');
    confirm();
    setDataTable((prev) => ({ ...prev, [dataIndex]: null }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<OpeningBalanceInterfaces.DatumType> => ({
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
        {renderInput(dataIndex, setSelectedKeys, selectedKeys, handleSearch, searchInput)}
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

  const columns = (acc: any): TableColumnsType<OpeningBalanceInterfaces.DatumType> => [
    {
      title: 'Tahun Fiskal',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      key: 'unit',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'notes',
      key: 'notes',
    },

    {
      title: 'Dibuat Oleh',
      dataIndex: ['staff', 'name'],
      key: 'name',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
      render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (status: string) => <Tag color={status === 'draft' ? 'red' : 'green'}>{status}</Tag>,
    },
    {
      title: 'Balance',
      dataIndex: 'totalBalance',
      key: 'status',
      ...getColumnSearchProps('totalBalance'),
      render: (totalBalance: number) => currencyFormatter(Number(totalBalance) || 0),
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      // fixed: 'rigsht',
      align: 'center',
      render: (_: any, record: OpeningBalanceInterfaces.DatumType) => (
        <Space>
          <ButtonDetailGroup
            disabled={!helperGlobal.hasAccessButton(acc, '/opening-balance', 'view')}
            onClick={() => handleDetail(record.id)}
          />
          <ButtonEditGroup
            disabled={
              record.status === 'confirmed' ||
              !helperGlobal.hasAccessButton(acc, '/opening-balance', 'edit')
            }
            text="Penyesuian"
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id)} // Fungsi delete
          >
            <Button
              disabled={
                record.status === 'confirmed' ||
                !helperGlobal.hasAccessButton(acc, '/opening-balance', 'delete')
              }
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Hapus
            </Button>
          </Popconfirm>

          {record.isRevertOpen && (
            <Button
              disabled={record.status !== 'confirmed' || record.isRevert === 'Y'}
              onClick={() => handleRvert(record.id)}
              type="primary"
              danger
              style={{
                background: 'orange',
              }}
              icon={<ArrowLeft />}
            >
              Revert
            </Button>
          )}
        </Space>
      ),
    },
    ...(user?.isRoot === 'Y'
      ? [
          {
            title: 'Open Revert',
            dataIndex: 'revert',
            width: 200,
            fixed: 'right',
            align: 'center',
            render: (_: any, record: OpeningBalanceInterfaces.DatumType) => (
              <Space>
                <Tooltip title="Apakah Anda yakin ingin membuka revert data ini?">
                  <Checkbox
                    defaultChecked={record.isRevertOpen}
                    disabled={dataTable.loading || record.isRevert === 'Y'}
                    onClick={() => handleOpenRevert(record.id)}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]
      : ([] as any)),
  ];

  return (
    <div>
      <TableDragDrop
        scroll={{ x: 'max-content' }} // Hindari overflow
        titleCard="Data Jurnal Detail"
        baseColumns={columns(access)}
        dataSource={data}
        linkAdd={
          helperGlobal.hasAccessButton(access, '/opening-balance', 'add')
            ? '/opening-balance/add'
            : ''
        }
        loading={false}
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
          key={page}
          defaultCurrent={page}
          total={total}
          defaultPageSize={limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setDataTable((prev) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </div>
  );
}

const JurnalHeader = () => {
  const [dataTable, setDataTable] = useState<OpeningBalanceInterfaces.GetOpeningBalanceType>({
    loading: false,
    data: [],
    page: 1,
    isMaterial: 'N',
    limit: 10,
    totalData: 0,
    totalPages: 0,
    totalBalance: null,
    date: null,
    status: null,
  });
  useEffect(() => {
    fetchData();
  }, [dataTable.date, dataTable.totalBalance, dataTable.status, dataTable.page]);

  const fetchData = async () => {
    try {
      setDataTable((prev) => ({ ...prev, loading: true }));
      const data = await OpeningBalanceAxios.fetchDataOpeningBalance(dataTable as any);
      setDataTable((prev) => ({
        ...prev,
        data: data?.data || [],
        loading: false,
        totalData: data?.totalData || 0,
      }));
    } catch (e) {
      showNotification('error', 'Terjadi Kesalahan', 'Terjadi Kesalahan');
    }
  };
  return (
    <JournalTable
      total={dataTable.totalData}
      limit={dataTable.limit}
      page={dataTable.page}
      data={dataTable.data}
      dataTable={dataTable}
      setDataTable={setDataTable}
      fetchData={fetchData}
    />
  );
};

export default JurnalHeader;
