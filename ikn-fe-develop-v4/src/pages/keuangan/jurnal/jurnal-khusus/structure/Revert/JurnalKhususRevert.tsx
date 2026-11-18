import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  InputNumber,
  Form,
  Space,
  Select,
  Row,
  Col,
  DatePicker,
  Flex,
  Button,
} from 'antd';
import { useNavigate, useParams } from 'react-router';
import * as JurnalKhususAxios from '@pages/keuangan/jurnal/jurnal-khusus/service/JurnalKhususAxios';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as globalHelpers from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import dayjs, { Dayjs } from 'dayjs';
import * as JurnalHeaderInterfaces from '@pages/keuangan/jurnal/jurnal-khusus/interface/JurnalHeaderInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { TagChevron } from '@phosphor-icons/react';
import { handleDate, handleMessageError } from '@/utils/func/func';
import * as JurnalUmumAxios from '@pages/keuangan/jurnal/jurnal-umum/service/JurnalUmumAxios';
import { PlusOutlined } from '@ant-design/icons';
import ButtonAdd from '@/components/atoms/button/buttonAdd';

const JurnalKhususRevert: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<JurnalHeaderInterfaces.JournalDetailType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<JurnalHeaderInterfaces.PayloadUpdateType>();

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    isAll: 'Y',
  });

  const totalDebit = details.reduce((sum, d) => sum + Number(d.debit), 0);
  const totalCredit = details.reduce((sum, d) => sum + Number(d.credit), 0);

  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountCode',
      render: (_value: any, record: any) => (
        <Input
          value={`${record.accountCode || ''} - ${record.accountName || ''}`}
          disabled
          prefix={<TagChevron size={16} />}
        />
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      render: (_: any, record: any) => (
        <Select
          disabled
          showSearch
          allowClear
          style={{ width: 200 }}
          placeholder="Pilih Unit"
          onChange={(val) => handleChange(record.key, record.id, 'unitId', val)}
          onSearch={onSearchUnit}
          value={record.unitId}
          options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
        />
      ),
    },

    {
      title: 'Keterangan',
      dataIndex: 'description',
      render: (value: string) => <Input style={{ width: 200 }} value={value} disabled />,
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (value: any, record: any) => (
        <InputNumber
          disabled
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          controls={false}
          value={value}
          style={{ width: 200 }}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'debit', val || 0)}
        />
      ),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      render: (value: any, record: any) => (
        <InputNumber
          disabled
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          controls={false}
          value={value}
          style={{ width: 200 }}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'credit', val || 0)}
        />
      ),
    },
  ];

  const handleChange = (
    key: string,
    id: string,
    field: keyof JurnalHeaderInterfaces.JournalDetailType,
    value: string | number
  ) => {
    setDetails((prev) =>
      prev.map((entry) =>
        (entry.isNew ? entry.key === key : entry.id === id) ? { ...entry, [field]: value } : entry
      )
    );
  };

  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = async () => {
    try {
      if (id) {
        const data = await JurnalKhususAxios.fetchJurnalKhususDetail(id);

        // buat jurnal pembalik
        const reversedDetails = data?.details.map((item: any) => ({
          id: null,
          key: Date.now().toString() + Math.random(),
          accountCode: item.accountCode,
          accountName: item.account.name,
          unitId: item.unitId,
          debit: item.credit, // dibalik
          credit: item.debit, // dibalik
          debitDollar: item.creditDollar,
          creditDollar: item.debitDollar,
          description: item.description,
          isNew: true,
        }));

        setDetails((reversedDetails as any) || []);
        form.setFieldsValue({
          date: dayjs(data?.date) as any,
          description: `Reversal dari jurnal ${data?.numberJurnal}`,
          unitId: data?.unit.id,
          referenceNumber: data?.referenceNumber,
          purposeTransaction: data?.purposeTransaction,
          createdBy: data?.createdBy,
        });
      }
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const handleSubmit = async (values: JurnalHeaderInterfaces.PayloadUpdateType) => {
    try {
      if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
        return showNotification('warning', 'Peringatan', 'Total Debit dan Kredit harus balance');
      }
      setLoading(true);
      const payload = {
        ...values,
        currencyValue: 0,
        typeJournalEntry: 'null',
        totalBalance: totalDebit,
        date: handleDate(values.date as Dayjs),
        details: details.map((item) => ({
          accountCode: item.accountCode,
          unitId: item.unitId,
          debit: Number(item.debit),
          description: item.description,
          credit: Number(item.credit),
          debitDollar: Number(item.debitDollar),
          creditDollar: Number(item.creditDollar),
          currencyValue: 0,
        })),
      };
      await JurnalUmumAxios.posRevertJurnal(id || '', payload);
      setLoading(false);
      showNotification('success', 'Berhasil', 'Jurnal pembalik berhasil dibuat');
      navigate('/jurnal-khusus');
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Terjadi kesalahan saat revert jurnal');
    }
  };

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  useEffect(() => {
    fetchJurnalCode();
  }, []);

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

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

  return (
    <Card title="Revert Jurnal">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
              style={{ width: '100%' }}
              label="Nomor Jurnal"
              name="numberJurnal"
            >
              <Input disabled placeholder="Number Jurnal umum " style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
              style={{ width: '100%' }}
              label="Referensi"
              name="referenceNumber"
            >
              <Input disabled placeholder="Number Jurnal umum jurnal" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Unit" name="unitId">
              <Select
                showSearch
                disabled
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
              label="Tanggal Reversal"
              name="date"
              initialValue={dayjs()}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item label="Keterangan" name="description">
              <Input disabled placeholder="Keterangan reversal" />
            </Form.Item>

            <Form.Item label="Tujuan Transaksi" name="purposeTransaction">
              <Input disabled placeholder="Tujuan Transaksi" />
            </Form.Item>
          </Col>
        </Row>

        <Table
          dataSource={details}
          columns={columns as any}
          rowKey="key"
          pagination={false}
          style={{ marginTop: 24 }}
          footer={() => (
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Button type="dashed" icon={<PlusOutlined />} disabled>
                Tambah Baris
              </Button>
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
};

export default JurnalKhususRevert;
