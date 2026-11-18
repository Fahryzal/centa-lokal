import { Table, Divider, Pagination, InputRef, Space, Button, Typography } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useWareHouse } from '../hooks/useWareHouse';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { Card } from '@/components/ui';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import RenderInput from './Components/RenderInput';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Highlighter from 'react-highlight-words';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import * as WareHouseAxios from '@/modules/dashboard/service/WareHouseAxios';
import * as ParamsInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/ParamsInterfaces';
import { generateExcelMasterBarangMentah } from '@/utils/generateExcel/Gudang/generateExcelMaster_BarangMentah';
import { generateBarangMentahPDF } from '@/utils/generatePdf/generateBarangMentahPDF';

type StockTableProps = {
  unitId: string;
  onExportReady?: (handler: (() => Promise<void>) | null) => void;
  onExportPDFReady?: (handler: (() => Promise<void>) | null) => void;
};

export const StockTable = ({ unitId, onExportReady, onExportPDFReady }: StockTableProps) => {
  const [dataTable, setTable] = useState({
    page: 1,
    limit: 5,
    satuan: null,
    itemName: null,
    itemCode: null,
    accountCode: null,
    unit: null,
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const { data, isLoading, isError } = useWareHouse({
    page: dataTable.page,
    limit: dataTable.limit,
    unitId: unitId,
    satuan: dataTable.satuan,
    itemName: dataTable.itemName,
    itemCode: dataTable.itemCode,
    accountCode: dataTable.accountCode,
    unit: dataTable.unit,
    month: selectedMonth.month() + 1,
    year: selectedMonth.year(),
  });

  const exportExcel = async () => {
    const params = {
      page: 1,
      limit: 100,
      unitId,
      satuan: dataTable.satuan,
      itemName: dataTable.itemName,
      itemCode: dataTable.itemCode,
      accountCode: dataTable.accountCode,
      unit: dataTable.unit,
      month: selectedMonth.month() + 1,
      year: selectedMonth.year(),
    } as ParamsInterfaces.ParamsType;

    const allData = await WareHouseAxios.fetchAllDataRawMaterial(params);

    generateExcelMasterBarangMentah(allData, selectedMonth);
  };

  useEffect(() => {
    onExportReady?.(exportExcel);

    return () => {
      onExportReady?.(null);
    };
  }, [
    unitId,
    dataTable.satuan,
    dataTable.itemName,
    dataTable.itemCode,
    dataTable.accountCode,
    dataTable.unit,
    selectedMonth,
    onExportReady,
  ]);

  const exportPDF = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        unitId,
        satuan: dataTable.satuan,
        itemName: dataTable.itemName,
        itemCode: dataTable.itemCode,
        accountCode: dataTable.accountCode,
        unit: dataTable.unit,
        month: selectedMonth.month() + 1,
        year: selectedMonth.year(),
      } as ParamsInterfaces.ParamsType;

      const allData = await WareHouseAxios.fetchAllDataRawMaterial(params);

      const pdf = generateBarangMentahPDF(allData, selectedMonth);

      const url = URL.createObjectURL(pdf.blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Gagal membuat preview PDF:', error);
    }
  };

  useEffect(() => {
    onExportPDFReady?.(exportPDF);

    return () => {
      onExportPDFReady?.(null);
    };
  }, [
    unitId,
    dataTable.satuan,
    dataTable.itemName,
    dataTable.itemCode,
    dataTable.accountCode,
    dataTable.unit,
    selectedMonth,
    onExportPDFReady,
  ]);

  if (isError) {
    return <AlertCustome />;
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: any
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

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
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
      onOpenChange(open: any) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text: any) =>
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

  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountCode',
      key: 'accountCode',
      ...getColumnSearchProps('accountCode'),
    },
    {
      title: 'Kode',
      dataIndex: 'itemCode',
      key: 'itemCode',
      ...getColumnSearchProps('itemCode'),
    },
    {
      title: 'Nama Barang',
      dataIndex: 'itemName',
      key: 'itemName',
      ...getColumnSearchProps('itemName'),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      key: 'satuan',
      ...getColumnSearchProps('satuan'),
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      key: 'unit',
      align: 'center' as const,
      ...getColumnSearchProps('unit'),
      render: (_: any, record: any) => record?.unit?.nama ?? '-',
    },
    {
      title: 'Stock',
      dataIndex: 'stokterKiniAll',
      key: 'stokterKiniAll',
      align: 'right' as const,
      render: (value: number) => Number(value ?? 0).toLocaleString('id-ID'),
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'averageCost',
      key: 'averageCost',
      align: 'right' as const,
      render: (value: number) => `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`,
    },
    {
      title: 'Saldo Akhir',
      key: 'saldoAkhir',
      align: 'right' as const,
      render: (_: any, record: any) => {
        const stock = Number(record.stokterKiniAll ?? 0);
        const harga = Number(record.averageCost ?? 0);

        return `Rp ${(stock * harga).toLocaleString('id-ID')}`;
      },
    },
  ];

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Typography.Title level={5} style={{ margin: 0 }}>
              Stok Barang: {selectedMonth.format('MMMM YYYY')}
            </Typography.Title>

            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => {
                if (date) {
                  setSelectedMonth(date);
                  setTable((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                }
              }}
              allowClear={false}
              format="MMMM YYYY"
              placeholder="Pilih bulan"
            />
          </div>

          <Divider />

          <Table
            columns={columns}
            dataSource={data?.data as any}
            pagination={false}
            bordered
            size="middle"
          />

          <Card
            style={{
              backgroundColor: 'white',
              padding: '12px 16px',
              marginTop: 10,
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <Space size="small">
                <span>Rows Per Page:</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={dataTable.limit}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === '') return;

                    const limit = Math.max(1, Math.floor(Number(value)));

                    if (!Number.isFinite(limit)) return;

                    setTable((prev) => ({
                      ...prev,
                      page: 1,
                      limit,
                    }));
                  }}
                  style={{
                    width: 85,
                    height: 32,
                    padding: '4px 8px',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    outlineColor: '#1677ff',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    WebkitTextFillColor: '#000000',
                    opacity: 1,
                    colorScheme: 'light',
                  }}
                />
              </Space>

              <Pagination
                showLessItems
                current={data?.page ?? dataTable.page}
                total={data?.totalData ?? 0}
                pageSize={dataTable.limit}
                showSizeChanger={false}
                showQuickJumper
                onChange={(page) => {
                  setTable((prev) => ({
                    ...prev,
                    page,
                  }));
                }}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
