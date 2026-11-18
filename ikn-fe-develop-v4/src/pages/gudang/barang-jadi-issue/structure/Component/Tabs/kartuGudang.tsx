import TableDragDrop from '@/components/atoms/table/TableDragDrop';
import {
  Card,
  DatePicker,
  InputNumber,
  Pagination,
  Select,
  type TableColumnsType,
  InputRef,
  TableColumnType,
  Form,
  Row,
  Col,
  Tooltip,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Space } from 'antd';

import { FilePdf, MagnifyingGlass, Note, TagChevron, Truck } from '@phosphor-icons/react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'photoviewer/dist/photoviewer.css';

import { currencyFormatter } from '@/utils/helper';
import { generateAU54 } from '@/utils/generatePdf/generateForms';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import { SearchOutlined } from '@ant-design/icons';
import ModalBarangJadi from '../ModalBarangJadiIssue/ModalBarangJadiIssue';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';

// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

interface DataType {
  id: string;
  month: string;
  keluar: number;
  masuk: number;
  sisa: number;
}
type DataIndex = keyof DataType;

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

  if (dataIndex.includes('periode_month')) {
    return (
      <DatePicker
        format="MM/YYYY"
        picker="month"
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0]), 'MM/YYYY') : undefined}
        onChange={handleDateChange('MM/YYYY')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('date')) {
    return (
      <DatePicker
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : undefined}
        onChange={handleDateChange('YYYY-MM-DDTHH:mm:ss.SSSZ')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('value_rkap')) {
    return (
      <InputNumber
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
          { value: 'PENDING', label: 'PENDING' },
          { value: 'APPROVED', label: 'APPROVED' },
          { value: 'REJECTED', label: 'REJECTED' },
          { value: 'VERIFED', label: 'VERIFED' },
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

export default function KartuGudang() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataTable, setTable] = useState({
    data: null,
    dataSource: [],
    page: 1,
    limit: 5,
    loading: false,
    date: null,
    total: 0,
    status: null,
    year: dayjs().year(),
  });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
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

  const baseColumns: TableColumnsType<DataType> = [
    {
      title: 'Bulan',
      dataIndex: 'month',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('month'),
    },
    {
      title: 'Nomor Bon',
      dataIndex: 'namaBarang',
      width: 200,
      align: 'center',
      render: (namaBarang) => <span>{namaBarang || '-'}</span>,
    },
    {
      title: 'Masuk ',
      dataIndex: 'masuk',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('masuk'),
    },
    {
      title: 'Keluar',
      dataIndex: 'keluar',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('keluar'),
      render: (keluar) => {
        return <span>{currencyFormatter(keluar || 0)}</span>;
      },
    },
    {
      title: 'Sisa',
      dataIndex: 'sisa',
      width: 200,
      align: 'center',
      ...getColumnSearchProps('sisa'),
      render: (sisa) => {
        return <span>{currencyFormatter(sisa || 0)}</span>;
      },
    },
  ];

  const getDataKartuGudang = async (id: string) => {
    try {
      const data = await BarangJadiAxios.fetchKartuGudang(id, dataTable);
      const dataResponse = data?.data?.result || [];
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const summary: any = {};

      dataResponse.forEach((item: any) => {
        const date = new Date(item.transactionDate);
        const monthKey: any = monthNames[date.getMonth()];

        if (!summary[monthKey]) {
          summary[monthKey] = { IN: 0, OUT: 0 };
        }

        summary[monthKey][item.transactionType] += item.quantity;
      });

      const result: any = Object.entries(summary).map(([month, value]: any) => ({
        month,
        masuk: value.IN,
        keluar: value.OUT,
        sisa: value.IN - value.OUT,
      }));

      const resultWitHeader = {
        ...data?.data,
        result,
      };

      setTable((prev) => ({
        ...prev,
        data: resultWitHeader,
        dataSource: result,
      }));
    } catch (_) {
      showNotification('error', 'Gagal', 'erjadi Kesalahan');
    }
  };

  const handleChangeYear = (value: any) => {
    setTable((prev) => ({
      ...prev,
      year: value.year(),
    }));
  };

  const idBarang = Form.useWatch('id', form);
  const year = Form.useWatch('year', form);

  useEffect(() => {
    if (idBarang) {
      getDataKartuGudang(idBarang);
    }
  }, [idBarang, year]);

  const handleRowDoubleClick = (record: any) => {
    form.setFieldsValue({
      id: record.finishedGoodId,
      namaBarang: record.namaBarang,
      satuan: record.Satuan,
      kodeBarang: record.kodeBarang,
      spesifikasi: record.spesifikasi,
    });
    setOpen(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Kartu Gudang" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={<ButtonFile icon={<FilePdf />} onClick={() => generateAU54(dataTable.data)} />}
    >
      <ModalBarangJadi open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
      <Form
        form={form}
        layout="vertical"
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              <Form.Item
                label="Id Barang"
                style={{ flex: 1, width: '100%', display: 'none' }}
                name="id"
                rules={[{ required: true, message: 'Masukan id barang!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nilai id barang"
                />
              </Form.Item>
              <Form.Item
                label="Nama Barang"
                style={{ flex: 1, width: '100%' }}
                name="namaBarang"
                rules={[{ required: true, message: 'Masukan nama barang!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nilai nama barang"
                />
              </Form.Item>
              <Tooltip title="search">
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>

            <Form.Item
              label="No. Kode"
              name="kodeBarang"
              rules={[{ required: true, message: 'Masukan kode!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<Note size={16} />}
                disabled
                placeholder="Kode Barangs"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Tahun"
              name="year"
              rules={[{ required: true, message: 'Masuka tahun!' }]}
            >
              <DatePicker
                picker="year"
                style={{
                  width: '100%',
                }}
                onChange={(value) => handleChangeYear(value)}
                defaultValue={dayjs().startOf('year')}
              />
            </Form.Item>
            <Form.Item
              label="Ukuran/Spesifikasi"
              name="spesifikasi"
              rules={[{ required: true, message: 'Masuka Speifikasi!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<Note size={16} />}
                placeholder="Sepesifikasi"
              />
            </Form.Item>

            <Form.Item
              label="Satuan"
              name="satuan"
              rules={[{ required: true, message: 'Masuka Franco!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<Truck size={16} />}
                placeholder="Satuan"
              />
            </Form.Item>
          </Col>
        </Row>

        <TableDragDrop
          scroll={{ x: 'max-content' }}
          titleCard="Kartu Gudang"
          loading={dataTable.loading}
          baseColumns={baseColumns}
          dataSource={dataTable.dataSource}
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
      </Form>
    </Card>
  );
}
