import { TagChevron } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Input,
  Tooltip,
  Flex,
  InputNumber,
  Space,
  Descriptions,
  Tag,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TitleCardPublic from '@/components/atoms/Cards/titleCardPublic';
import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as MasterAkunBankAxios from '@pages/master/master-akun-bank/service/MasterAkunBankAxios';
import * as globalHelpers from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';
import dayjs from 'dayjs';
import { useFetchOptions } from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { JournalEntryOpeningBalance } from '@pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import { Table } from '@/components/ui';

export default function AkunBankDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  const [entries, setEntries] = useState<JournalEntryOpeningBalance[]>([]);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );

  const handleChange = (key: string, field: keyof JournalEntryOpeningBalance, value: any) => {
    setEntries((prev) =>
      prev.map((entry) =>
        (entry.isNew ? entry.key : entry.id) === key ? { ...entry, [field]: value } : entry
      )
    );
  };
  useEffect(() => {
    getDataById();
  }, []);

  const handlePost = async () => {
    try {
      if (id) {
        setLoading(true);
        await MasterAkunBankAxios.postingAkunBank(id);
        showNotification('success', 'Berhasil', 'Data Berhasil diposting');
        setTimeout(() => {
          navigate('/akun-bank');
        }, 1000);
      } else {
        showNotification('warning', 'Peringatan', 'ID jurnal kosong');
      }
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e, 'Terjadi Kesalahan');
      showNotification('error', 'Gagal', message);
    }
  };

  const getDataById = async () => {
    try {
      if (id) {
        const data = await MasterAkunBankAxios.fetchDataAkunBankById(id);
        form.setFieldsValue({
          accountCode: data?.accountCode,
          bankName: data?.bankName,
          branchAddress: data?.branchAddress,
          bankAccountNumber: data?.bankAccountNumber,
          bankCode: data?.bankCode,
          initialBalance: data?.initialBalance,
          unitId: data?.unitId,
          date: dayjs(data?.date),
          isPosted: data?.isPosted,
          unit: data?.unit.nama,
        });

        const dataOpening = data?.OpeningBankDetails.map((items) => ({
          id: items.id,
          accountCode: items.accountCode,
          accountName: items.account.name,
          debit: items.debit,
          credit: items.credit,
          isNew: false,
        }));
        setEntries(dataOpening as any);
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak di temukan');
      }
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

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
            value={`${entries.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountCode || ''} - ${entries.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountName}`}
            disabled
            prefix={<TagChevron size={16} />}
            placeholder="Nama Akun"
          />

          <Tooltip title="Search akun">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} disabled />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Debit Saldo Awal',
      dataIndex: 'debit',
      render: (_: string, record: JournalEntryOpeningBalance) => (
        <InputNumber
          disabled
          min={0}
          controls={false}
          style={{ width: 200 }}
          value={record.debit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.id || record.key, 'debit', val || 0);
            if (val) handleChange(record.id || record.key, 'credit', 0); // only one side filled
          }}
        />
      ),
    },
    {
      title: 'Kredit Saldo Awal',
      dataIndex: 'credit',
      render: (_: string, record: JournalEntryOpeningBalance) => (
        <InputNumber
          disabled
          style={{ width: 200 }}
          min={0}
          controls={false}
          value={record.credit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.id || record.key, 'credit', val || 0);
            if (val) handleChange(record.id || record.key, 'debit', 0); // only one side filled
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
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Tanggal">
          {dayjs(form.getFieldValue('date')).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Unit">{form.getFieldValue('unit')}</Descriptions.Item>
        <Descriptions.Item label="Nama Bank">{form.getFieldValue('bankName')}</Descriptions.Item>

        <Descriptions.Item label="Alamat Bank">
          {form.getFieldValue('branchAddress')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            style={{
              color: form.getFieldValue('isPosted') === 'Y' ? 'green' : 'red',
            }}
          >
            {form.getFieldValue('isPosted') === 'Y' ? 'CONFIRMED' : 'DRAFT'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="No. Rekening">
          {form.getFieldValue('bankAccountNumber')}
        </Descriptions.Item>
        <Descriptions.Item label="Kode Bank">{form.getFieldValue('bankCode')}</Descriptions.Item>
      </Descriptions>

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
      >
        <Table
          columns={columns}
          style={{
            marginTop: 10,
          }}
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
          <Button
            disabled={form.getFieldValue('isPosted') === 'Y'}
            loading={loading}
            icon={<SaveOutlined />}
            type="primary"
            onClick={handlePost}
          >
            Posting
          </Button>{' '}
        </Flex>
      </Form>
    </Card>
  );
}
