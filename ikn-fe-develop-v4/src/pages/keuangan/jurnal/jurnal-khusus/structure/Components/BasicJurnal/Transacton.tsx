import { CalendarMinus, FilePdf, MapPin, TagChevron, Unite } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  DatePicker,
  Input,
  Tooltip,
  InputNumber,
  Select,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';
import * as hooksGlobal from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { showNotification } from '@/contexts/services/notificationService';

const { TextArea } = Input;
type JournalEntry = {
  key: string;
  accountCode: string | null;
  keterangan: string;
  debit: number;
  credit: number;
  accountName: string;
};

export default function Transacton({ dataBasic }: { dataBasic: any }) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    isAll: 'Y',
  });

  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      key: '1',
      accountCode: null,
      keterangan: '',
      debit: 0,
      credit: 0,
      accountName: '',
    },
  ]);

  // unit
  hooksGlobal.useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);
  const onSearchUnit = hooksGlobal.useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);
  useEffect(() => {
    TransactionAxiosUse();
  }, [dataBasic]);

  const TransactionAxiosUse = async () => {
    try {
      if (id) {
        const data = dataBasic?.transaction || {};
        form.setFieldsValue({
          invoiceNumber: data?.invoice?.invoiceNumber,
          inputDate: globalHelpers.dateFormat(data?.date),
          date: globalHelpers.dateFormat(data?.date),
          jumlahBayar: data?.amountInIDR || 0,
          description: data?.description || '-',
          invoiceDate: globalHelpers.dateFormat(data?.invoice?.invoiceDate),
          transactionNumber: data?.transactionNumber || '-',
          nomorAkun: data?.bank_account?.bankAccountNumber || '-',
          unit: data.unitId,
          amount: Number(data?.amountInIDR),
          taxType: data.taxType,
          taxValue: data.taxValue,
          accountCode: data.accountCode,
          namaAkun: data?.bank_account?.bankName,
          bank_account_id: data?.bank_account_id,
          to: data?.to,
          BankaccountCode: data?.bank_account?.accountCode || '-',
          address: data.address,
          type: data?.type || '-',
        });
        const detail = data?.cashBankTransactionDetails
          ?.filter((item: any) => item.accountCode !== data?.bank_account?.accountCode)
          .map((item: any) => ({
            accountCode: item.accountCode,
            keterangan: item.keterangan,
            accountName: item.accountName,
            credit: Number(item.credit) || 0,
            debit: Number(item.debit) || 0,
            key: Date.now().toString() + Math.random().toString(36).substring(2, 7),
          }));
        setEntries(detail || []);
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal get data');
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
            <Button disabled type="primary" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      render: (_: any, record: JournalEntry) => (
        <Input
          value={record.keterangan}
          disabled
          prefix={<BookOutlined size={16} />}
          placeholder="Keterangan"
        />
      ),
    },

    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          controls={false}
          disabled
          min={0}
          style={{ width: 200 }}
          value={record.debit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
        />
      ),
    },
    {
      title: 'Kredit',
      dataIndex: 'credit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          controls={false}
          disabled
          style={{ width: 200 }}
          min={0}
          value={record.credit}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
        />
      ),
    },
  ];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <Card
        title={<TitleCardAdd title="Dasar Jurnal (Transaksi Keluar/Masuk)" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
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
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="accounIdTax"
                style={{ flex: 1, width: '100%', display: 'none' }}
                name="accounIdTax"
                rules={[{ required: false }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Nilai accounIdTax"
                />
              </Form.Item>

              <Form.Item
                label="bankAccountId"
                style={{ flex: 1, width: '100%', display: 'none' }}
                name="bank_account_id"
                rules={[{ required: true, message: 'Masukan nilai bankAccountId!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<FilePdf size={16} />}
                  placeholder="Nilai bankAccountId"
                />
              </Form.Item>

              <Form.Item
                label="Nomor Transaksi"
                style={{ flex: 1, width: '100%' }}
                name="transactionNumber"
                rules={[{ required: true, message: 'Masukan nilai Nomor Transaksi!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nilai Nomor Transaksi"
                />
              </Form.Item>

              <Form.Item
                label="Tanggal Keluar/Masuk"
                name="date"
                rules={[{ required: true, message: 'Masukan Tanggal Keluar/Masuk' }]}
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
                  prefix={<CalendarMinus />}
                  style={{ width: '100%' }}
                  disabled
                  placeholder="Tanggal Keluar"
                  format={'YYYY-MM-DD'}
                />
              </Form.Item>

              <Form.Item
                label="Jumlah Pembayaran"
                name="amount"
                rules={[{ required: true, message: 'Masukan jumlah!' }]}
                extra={<TextTerbilang form={form} properti="amount" />}
              >
                <InputNumber
                  disabled
                  controls={false}
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                  style={{ width: '100%' }}
                  prefix={<span>Rp</span>}
                  placeholder="Jumlah"
                />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: 'Masukan unit' }]}
              >
                <Select
                  disabled
                  prefix={<Unite />}
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih unit"
                  optionFilterProp="label"
                  onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                  onSearch={onSearchUnit}
                  options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <Form.Item
                  label="Nama Akun"
                  style={{ flex: 1, width: '100%' }}
                  name="namaAkun"
                  rules={[{ required: true, message: 'Masukan nilai Nama Akun!' }]}
                >
                  <Input
                    disabled
                    style={{ width: '100%' }}
                    prefix={<TagChevron size={16} />}
                    placeholder="Nilai nama akun"
                  />
                </Form.Item>
                <Tooltip title="search">
                  <Button disabled type="primary" shape="circle" icon={<SearchOutlined />} />
                </Tooltip>

                <Form.Item
                  label="BankaccountCode"
                  style={{ flex: 1, width: '100%', display: 'none' }}
                  name="BankaccountCode"
                  rules={[{ required: false }]}
                >
                  <Input
                    disabled
                    style={{ width: '100%' }}
                    prefix={<FilePdf size={16} />}
                    placeholder="Nilai BankaccountCode"
                  />
                </Form.Item>
              </div>

              <Form.Item label="Catatan" style={{ flex: 1, width: '100%' }} name="description">
                <TextArea rows={2} disabled placeholder="Masukan Catatan" />
              </Form.Item>

              <Form.Item
                label="Tujuan Transaksi"
                style={{ flex: 1, width: '100%' }}
                name="to"
                rules={[{ required: true, message: 'Masukan Tujuan Transaksi!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Tujuan Transaksi"
                />
              </Form.Item>

              <Form.Item
                label="Alamat Penerima"
                style={{ flex: 1, width: '100%' }}
                name="address"
                rules={[{ required: true, message: 'Masukan Alamat Penerima' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<MapPin size={16} />}
                  placeholder="Alamat Penerima"
                />
              </Form.Item>

              <Form.Item
                label="Type Transaksi"
                style={{ flex: 1, width: '100%' }}
                name="type"
                rules={[{ required: true, message: 'Masukan Type Transaksi' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<MapPin size={16} />}
                  placeholder="Type Transaksi"
                />
              </Form.Item>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={entries}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowKey="key"
          />
        </Form>
      </Card>
    </div>
  );
}
