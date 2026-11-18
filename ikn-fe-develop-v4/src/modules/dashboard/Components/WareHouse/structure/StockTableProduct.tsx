import {
  Table,
  Typography,
  DatePicker,
  Divider,
  Pagination,
  TableColumnsType,
  Space,
  Button,
  InputRef,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useProduct } from '../hooks/useWareHouse';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { Card } from '@/components/ui';
import { currencyFormatter } from '@/utils/helper';
import * as DataProductInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/DataProductInterfaces';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import RenderInput from './Components/RenderInput';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Highlighter from 'react-highlight-words';
import { useEffect } from 'react';
import * as WareHouseAxios from '@/modules/dashboard/service/WareHouseAxios';
import * as ParamsInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/ParamsInterfaces';
import { generateExcelMasterBarangJadi } from '@/utils/generateExcel/Gudang/generateExcelMaster_BarangJadi';
import { generateBarangJadiPDF } from '@/utils/generatePdf/generateBarangJadiPDF';

const { Title } = Typography;

type StockProductTableProps = {
  unitId: string;
  onExportReady?: (handler: (() => Promise<void>) | null) => void;
  onExportPDFReady?: (handler: (() => Promise<void>) | null) => void;
};

export const StockStockTableProductTable = ({
  unitId,
  onExportReady,
  onExportPDFReady,
}: StockProductTableProps) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [dataTable, setTable] = useState({
    page: 1,
    limit: 5,
    namaBarang: null,
    kategori: null,
    Satuan: null,
    kodeBarang: null,
  });

  const { data, isLoading, isError } = useProduct({
    page: dataTable.page,
    limit: dataTable.limit,
    date: selectedMonth,
    unit: unitId,
    namaBarang: dataTable.namaBarang,
    kategori: dataTable.kategori,
    Satuan: dataTable.Satuan,
    kodeBarang: dataTable.kodeBarang,
  });

  // Ekspor seluruh data Barang Jadi ke Excel
  const exportExcel = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        date: selectedMonth,
        unit: unitId,
        namaBarang: dataTable.namaBarang,
        kategori: dataTable.kategori,
        Satuan: dataTable.Satuan,
        kodeBarang: dataTable.kodeBarang,
      } as ParamsInterfaces.ParamsProductType;

      const allData = await WareHouseAxios.fetchAllDataProduct(params);

      generateExcelMasterBarangJadi(allData, selectedMonth);
    } catch (error) {
      console.error('Gagal mengekspor Excel Barang Jadi:', error);
    }
  };

  // Daftarkan fungsi Excel ke tombol di WarehouseDashboard
  useEffect(() => {
    onExportReady?.(exportExcel);

    return () => {
      onExportReady?.(null);
    };
  }, [
    unitId,
    selectedMonth,
    dataTable.namaBarang,
    dataTable.kategori,
    dataTable.Satuan,
    dataTable.kodeBarang,
    onExportReady,
  ]);

  // Ekspor PDF dan buka preview terlebih dahulu
  const exportPDF = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        date: selectedMonth,
        unit: unitId,
        namaBarang: dataTable.namaBarang,
        kategori: dataTable.kategori,
        Satuan: dataTable.Satuan,
        kodeBarang: dataTable.kodeBarang,
      } as ParamsInterfaces.ParamsProductType;

      const allData = await WareHouseAxios.fetchAllDataProduct(params);

      const pdf = generateBarangJadiPDF(allData, selectedMonth);
      const pdfUrl = URL.createObjectURL(pdf.blob);

      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Gagal membuat preview PDF Barang Jadi:', error);
    }
  };

  // Daftarkan fungsi PDF ke tombol di WarehouseDashboard
  useEffect(() => {
    onExportPDFReady?.(exportPDF);

    return () => {
      onExportPDFReady?.(null);
    };
  }, [
    unitId,
    selectedMonth,
    dataTable.namaBarang,
    dataTable.kategori,
    dataTable.Satuan,
    dataTable.kodeBarang,
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

  const baseColumns: TableColumnsType<DataProductInterfaces.Datum> = [
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('namaBarang'),
    },
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('kodeBarang'),
    },

    {
      title: 'Stock',
      dataIndex: 'stokTerkini',
      width: 200,
      align: 'center',
      render: (stokTerkini, data) => {
        return <span>{currencyFormatter(stokTerkini || data?.stok || 0)}</span>;
      },
    },

    {
      title: 'Kategori',
      dataIndex: 'kategori',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('kategori'),
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('Satuan'),
    },
    
    {
      title: 'Nilai Satuan',
      dataIndex: 'nilaiSatuan',
      width: 200,
      align: 'center',
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      width: 200,
      align: 'center',
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
            <Title level={5} style={{ margin: 0 }}>
              Stok Barang: {selectedMonth.format('MMMM YYYY')}
            </Title>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              allowClear={false}
            />
          </div>
          <Divider />

          <Table
            columns={baseColumns}
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
                <InputNumber
                  min={1}
                  step={1}
                  precision={0}
                  value={dataTable.limit}
                  onChange={(value) => {
                    if (value === null || value < 1) return;

                    setTable((prev) => ({
                      ...prev,
                      page: 1,
                      limit: value,
                    }));
                  }}
                  style={{ width: 85 }}
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
