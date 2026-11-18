import { useState, useMemo } from 'react';
import {
  Table,
  Select,
  Input,
  InputNumber,
  Button,
  Form,
  DatePicker,
  Space,
  Row,
  Col,
  Card,
  Flex,
  Tooltip,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import { useNavigate } from 'react-router';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';
import * as OpeningBalanceAxios from '@pages/akuntansi/opening-balance/service/OpeningBalanceAxios';
import { showNotification } from '@/contexts/services/notificationService';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import { TagChevron } from '@phosphor-icons/react';
import { findDuplicateObjects, handleDate } from '@/utils/func/func';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type JournalEntry = {
  key: string;
  accountCode: string | null;
  description: string;
  debit: number;
  credit: number;
  code?: string;
  accountName: string;
};

const OpeningBalanceAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<OpeningBalanceInterfaces.OpeningBalanceType>();
  const [entries, setEntries] = useState<JournalEntry[]>([
    { key: '1', accountCode: null, description: '', debit: 0, credit: 0, accountName: '' },
  ]);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );
  const [selectedRecord, setSelectedRecord] = useState<JournalEntry | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const addRow = () => {
    setEntries([
      ...entries,
      {
        key: Date.now().toString(),
        accountCode: null,
        description: '',
        debit: 0,
        credit: 0,
        accountName: '',
      },
    ]);
  };

  const removeRow = (key: string) => {
    setEntries(entries.filter((entry) => entry.key !== key));
  };

  const handleChange = (key: string, field: keyof JournalEntry, value: any) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.key === key ? { ...entry, [field]: value } : entry))
    );
  };

  const handleSubmit = async (values: OpeningBalanceInterfaces.OpeningBalanceType) => {
    try {
      if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
        return showNotification('warning', 'Peringatan', 'Debit dan Credit tidak balance');
      }

      const hasEmptyCOA = entries.some((entry) => !entry.accountCode);
      if (hasEmptyCOA) {
        return showNotification('warning', 'Peringatan', 'Semua entri harus memiliki akun COA.');
      }

      const duplocateDate = findDuplicateObjects(entries);
      let text = '';
      duplocateDate.map((item: any, i: number) => {
        text += `(${i + 1}). ${item.accountCode}-${item.accountName},`;
      });

      if (duplocateDate.length > 0) {
        return showNotification('warning', 'Duplikat Data', text);
      }
      // setLoading(true);
      const payload = {
        ...values,
        totalBalance: totalDebit,
        fiscalYear: dayjs(values.date).format('YYYY'),
        date: handleDate(values.date as any),
        details: entries.map((items) => {
          const { key, accountName, description, ...newItems } = items; //hapus objek
          return {
            ...newItems,
            unitId: values.unitId,
            fiscalYear: dayjs(values.date).format('YYYY'),
          };
        }),
      };
      await OpeningBalanceAxios.posOpeningBalance(payload as any);
      navigate('/opening-balance');

      setLoading(false);
      showNotification('success', 'Berhasil', 'Data Berhasil di Tambahkan');
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Data Gagal di Tambahkan');
    }
  };

  const columns = [
    {
      title: 'Akun (COA)',
      dataIndex: 'coa',
      render: (_: any, record: JournalEntry) => (
        <div
          style={{
            display: 'flex',
            gap: 5,
            width: 'auto',
            minWidth: 300,
          }}
        >
          <Input
            value={`${entries.find((i) => i.key === record.key)?.accountCode || ''} - ${entries.find((i) => i.key === record.key)?.accountName}`}
            disabled
            prefix={<TagChevron size={16} />}
            placeholder="Nama Akun"
          />

          <Tooltip title="Search akun">
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          min={0}
          style={{ width: 200 }}
          value={record.debit}
          formatter={helperGlobal.formatNumber2Digits}
          parser={helperGlobal.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.key, 'debit', val || 0);
            if (val) handleChange(record.key, 'credit', 0); // only one side filled
          }}
        />
      ),
    },
    {
      title: 'Kredit',
      dataIndex: 'credit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          style={{ width: 200 }}
          min={0}
          value={record.credit}
          formatter={helperGlobal.formatNumber2Digits}
          parser={helperGlobal.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.key, 'credit', val || 0);
            if (val) handleChange(record.key, 'debit', 0); // only one side filled
          }}
        />
      ),
    },
    {
      title: '',
      render: (_: any, record: JournalEntry) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} />
      ),
    },
  ];

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const handleRowDoubleClick = (recordRow: any, record: JournalEntry) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.key === record.key
          ? { ...entry, ['accountCode']: recordRow.code, ['accountName']: recordRow.name }
          : entry
      )
    );
    setOpen(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Buat Opening Balance" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalAccount
        record={selectedRecord}
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item<OpeningBalanceInterfaces.OpeningBalanceType>
                style={{ width: '100%' }}
                label="Tanggal"
                name="date"
                initialValue={dayjs()}
                getValueFromEvent={(date) => {
                  // pastikan disimpan dalam format YYYY-MM-DD (string)
                  return date ? date.format('YYYY-MM-DD') : null;
                }}
                getValueProps={(value) => {
                  // saat form memuat ulang data, ubah string ke dayjs
                  return {
                    value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
                  };
                }}
              >
                <DatePicker
                  // disabledDate={helperGlobal.disabledDate}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item<OpeningBalanceInterfaces.OpeningBalanceType>
                style={{ width: '100%' }}
                label="Keterangan"
                name="notes"
              >
                <Input placeholder="Deskripsi umum jurnal" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item<OpeningBalanceInterfaces.OpeningBalanceType>
                style={{ width: '100%' }}
                label="Unit"
                name={'unitId'}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Pilih Unit"
                  onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                  onSearch={onSearchUnit}
                  options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={entries}
            pagination={false}
            rowKey="key"
            footer={() => (
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addRow}>
                  Tambah Baris
                </Button>
                <div>
                  <strong>Total Debit:</strong> Rp {totalDebit.toLocaleString('id-ID')} &nbsp;&nbsp;
                  <strong>Total Kredit:</strong> Rp {totalCredit.toLocaleString('id-ID')}
                </div>
              </Space>
            )}
          />

          <Space style={{ marginTop: 24 }}>
            <Flex gap={'small'}>
              <Buttonback />
              <ButtonAdd loading={loading} />
            </Flex>
          </Space>
        </Space>
      </Form>
    </Card>
  );
};

export default OpeningBalanceAdd;
