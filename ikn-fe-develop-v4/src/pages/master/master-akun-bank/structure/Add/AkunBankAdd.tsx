import { MapPin, TagChevron } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Tooltip,
  Flex,
  InputNumber,
  DatePicker,
  Select,
  Space,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import * as SatuanAxios from '@pages/master/satuan/service/SatuanAxios';
import { useNavigate } from 'react-router';
import TitleCardPublic from '@/components/atoms/Cards/titleCardPublic';
import { BankOutlined, SearchOutlined } from '@ant-design/icons';
import ModalBankAccount from './ModalBankAccount/ModalBankAccount';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as MasterAkunBankAxios from '@pages/master/master-akun-bank/service/MasterAkunBankAxios';
import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';
import * as globalHelpers from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import dayjs, { Dayjs } from 'dayjs';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { findDuplicateObjects, handleDate, handleMessageError } from '@/utils/func/func';
import { Table } from '@/components/ui';
import { JournalEntryOpeningBalance } from '@pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';

export default function AkunBankUpdate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const [entries, setEntries] = useState<JournalEntryOpeningBalance[]>([
    { key: '1', accountCode: null, description: '', debit: 0, credit: 0, accountName: '' },
    { key: '2', accountCode: null, description: '', debit: 0, credit: 0, accountName: '' },
  ]);
  const [selectedRecord, setSelectedRecord] = useState<JournalEntryOpeningBalance | null>(null);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );
  const onFinish = async (values: MasterAkunBankInterfaces.PayloadType) => {
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
    const dataDebit = entries.find((items) => items.debit > 0);
    try {
      setLoading(true);
      values = {
        ...values,
        initialBalance: dataDebit?.debit || 0,
        accountCode: dataDebit?.accountCode as string,
        date: handleDate(values.date as Dayjs),
        details: entries.map((items) => {
          const { key, accountName, description, code, id, ...newItems } = items; //hapus objek
          return {
            ...newItems,
            unitId: values.unitId,
            fiscalYear: dayjs(values.date).format('YYYY'),
          };
        }) as any,
      };
      await MasterAkunBankAxios.posAkunBank(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/akun-bank');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await SatuanAxios.fetchGenCodeSatuan();
    form.setFieldsValue({
      kode: data.code,
    });
    setLoading(false);
  };

  const handleRowDoubleClick = (recordRow: any, record: JournalEntryOpeningBalance) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.key === record.key
          ? { ...entry, ['accountCode']: recordRow.code, ['accountName']: recordRow.name }
          : entry
      )
    );
    setOpen(false);
  };

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);
  const handleChange = (key: string, field: keyof JournalEntryOpeningBalance, value: any) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.key === key ? { ...entry, [field]: value } : entry))
    );
  };

  const columns = [
    {
      title: 'Akun (COA)',
      dataIndex: 'coa',
      render: (_: string, record: JournalEntryOpeningBalance) => (
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
      title: 'Debit Saldo Awal',
      dataIndex: 'debit',
      render: (_: string, record: JournalEntryOpeningBalance) => (
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
      title: 'Kredit Saldo Awal',
      dataIndex: 'credit',
      render: (_: string, record: JournalEntryOpeningBalance) => (
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
  ];

  return (
    <Card
      title={<TitleCardPublic title="Bank" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalBankAccount
        record={selectedRecord}
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />
      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
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
              style={{ width: '100%' }}
              label="Tanggal"
              name="date"
              initialValue={dayjs()}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            {/* <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item
                label="No Akun"
                name="accountCode"
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Masukan no akun!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<AccountBookOutlined size={16} />}
                  placeholder="No Akun"
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
            </div> */}

            <Form.Item
              label="Nama Bank"
              name="bankName"
              rules={[{ required: true, message: 'Masukan Nama Bank!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<BankOutlined size={16} />}
                placeholder="Nama Bank"
              />
            </Form.Item>

            <Form.Item
              label="Alamat Bank"
              name="branchAddress"
              rules={[{ required: true, message: 'Masukan alamat bank!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<MapPin size={16} />}
                placeholder="Alamat Bank"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Unit" name={'unitId'}>
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
            <Form.Item
              label="No. Rekening"
              name="bankAccountNumber"
              rules={[{ required: true, message: 'Masukan No. Rekening!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<MapPin size={16} />}
                placeholder="No. Rekening"
              />
            </Form.Item>

            <Form.Item
              label="Kode Bank"
              name="bankCode"
              rules={[{ required: true, message: 'Masukan Kode Bank!' }]}
            >
              <Input
                style={{ width: '100%' }}
                prefix={<MapPin size={16} />}
                placeholder="Kode Bank"
              />
            </Form.Item>

            {/* <Form.Item
              label="Saldo Awal"
              name="initialBalance"
              rules={[{ required: true, message: 'Masukan Saldo Awal!' }]}
              extra={
                <span
                  style={{
                    color: 'green',
                    textTransform: 'uppercase',
                    textDecoration: 'underline',
                  }}
                >
                  {TextTerbilang({ form: form, properti: 'initialBalance' })}
                </span>
              }
            >
              <InputNumber
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{ width: '100%' }}
                prefix={<MapPin size={16} />}
                placeholder="Saldo Awal"
              />
            </Form.Item> */}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={entries}
          pagination={false}
          scroll={{ x: 'auto' }}
          rowKey="key"
          footer={() => (
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <div>
                <strong>Total Debit:</strong> Rp {totalDebit.toLocaleString('id-ID')} &nbsp;&nbsp;
                <strong>Total Kredit:</strong> Rp {totalCredit.toLocaleString('id-ID')}
              </div>
            </Space>
          )}
        />

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
