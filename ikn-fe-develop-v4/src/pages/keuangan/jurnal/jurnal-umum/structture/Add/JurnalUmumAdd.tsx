import { useState, useMemo, useEffect } from 'react';
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
import dayjs, { Dayjs } from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import * as JurnalUmumInterfaces from '@pages/keuangan/jurnal/jurnal-umum/interfaces/JurnalUmumInterfaces';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as JurnalUmumAxios from '@pages/keuangan/jurnal/jurnal-umum/service/JurnalUmumAxios';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import { useNavigate } from 'react-router';
import { showNotification } from '@/contexts/services/notificationService';
import { TagChevron } from '@phosphor-icons/react';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import * as globalHelpers from '@/utils/helper';
import { handleDate } from '@/utils/func/func';

type JournalEntry = {
  key: string;
  accountCode: string | null;
  description: string;
  debit: number;
  credit: number;
  unitId: string;
  accountName: string;
};

const JurnalUmumAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<JurnalUmumInterfaces.JurnalUmumInterface>();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      key: '1',
      accountCode: null,
      description: '',
      debit: 0,
      credit: 0,
      unitId: '',
      accountName: '',
    },
  ]);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    isAll: 'Y',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<JournalEntry | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const addRow = () => {
    setEntries([
      ...entries,
      {
        key: Date.now().toString(),
        accountCode: null,
        description: '',
        debit: 0,
        credit: 0,
        unitId: '',
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

  const handleSubmit = async (values: JurnalUmumInterfaces.JurnalUmumInterface) => {
    try {
      if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
        return showNotification('warning', 'Peringatan', 'Debit dan Credit tidak balance');
      }

      const hasEmptyCOA = entries.some((entry) => !entry.accountCode);
      if (hasEmptyCOA) {
        return showNotification('warning', 'Peringatan', 'Semua entri harus memiliki akun COA.');
      }

      setLoading(true);
      const payload = {
        ...values,
        date: handleDate(values.date as Dayjs),
        totalBalance: totalDebit,
        details: entries.map((items) => {
          const { key, accountName, description, ...newItems } = items; //hapus objek
          return { ...newItems };
        }),
      };

      await JurnalUmumAxios.posJurnal(payload as any);

      showNotification('success', 'Berhasil', 'Data Berhasil di Tambahkan');
      navigate('/jurnal-umum');
      setLoading(false);
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
      title: 'Unit',
      dataIndex: 'unit',
      render: (_: any, record: JournalEntry) => (
        <Select
          showSearch
          allowClear
          style={{ width: 200 }}
          placeholder="Pilih Unit"
          onChange={(val) => handleChange(record.key, 'unitId', val)}
          onSearch={onSearchUnit}
          value={record.unitId}
          options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
        />
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          controls={false}
          min={0}
          style={{ width: 200 }}
          value={record.debit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
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
          controls={false}
          style={{ width: 200 }}
          min={0}
          value={record.credit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
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

  useEffect(() => {
    fetchJurnalCode();
  }, []);

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const fetchJurnalCode = async () => {
    try {
      const data = await JurnalUmumAxios.fetchGenCodeJurnal();
      form.setFieldsValue({
        numberJurnal: data.code,
      });
    } catch (e) {
      showNotification('error', 'Gagal', 'Generate Kdoe Jurnal Gagal');
    }
  };

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
      title={<TitleCardAdd title="Buat Jurnal" />}
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
              <Form.Item<JurnalUmumInterfaces.JurnalUmumInterface>
                style={{ width: '100%' }}
                label="Tanggal"
                name="date"
                initialValue={dayjs()}
                getValueFromEvent={(date) => {
                  // simpan ke form dalam format string tanpa timezone
                  return date ? date.format('YYYY-MM-DD') : null;
                }}
                getValueProps={(value) => {
                  // ubah dari string ke dayjs agar tampil di DatePicker
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

              <Form.Item<JurnalUmumInterfaces.JurnalUmumInterface>
                style={{ width: '100%' }}
                label="Keterangan"
                name="description"
              >
                <Input placeholder="Deskripsi umum jurnal" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<JurnalUmumInterfaces.JurnalUmumInterface>
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

            <Col xs={24} sm={12}>
              <Form.Item<JurnalUmumInterfaces.JurnalUmumInterface>
                style={{ width: '100%' }}
                label="Nomor Jurnal"
                name="numberJurnal"
              >
                <Input disabled placeholder="Number Jurnal umum " style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<JurnalUmumInterfaces.JurnalUmumInterface>
                style={{ width: '100%' }}
                label="Referensi"
                name="referenceNumber"
              >
                <Input placeholder="Number Jurnal umum jurnal" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={entries}
            pagination={false}
            scroll={{ x: 'max-content' }}
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

export default JurnalUmumAdd;
