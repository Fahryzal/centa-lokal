import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  InputNumber,
  Button,
  Form,
  Popconfirm,
  Space,
  Typography,
  Select,
  Row,
  Col,
  DatePicker,
  Flex,
  Tooltip,
  Collapse,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import * as JurnalKhususAxios from '@pages/keuangan/jurnal/jurnal-khusus/service/JurnalKhususAxios';
import Buttonback from '@/components/atoms/button/buttonBack';
const { Text } = Typography;
import * as globalHelpers from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import dayjs, { Dayjs } from 'dayjs';
import * as JurnalHeaderInterfaces from '@pages/keuangan/jurnal/jurnal-khusus/interface/JurnalHeaderInterfaces';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';

import { TagChevron } from '@phosphor-icons/react';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import { handleDate, handleMessageError } from '@/utils/func/func';
import TransactionDollarDetail from '../Components/Basics/TransactionDollarDetail';
import SpbsDetail from '../Components/Basics/SpbsDetail';

const JurnalKhususDollarEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<JurnalHeaderInterfaces.JournalDetailType[]>([]);
  const [dataBasic, setDataBasic] = useState<any>();
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
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<JurnalHeaderInterfaces.JournalDetailType | null>(null);

  const handleAddRow = () => {
    const newRow: any = {
      id: '',
      key: Date.now().toString(),
      accountCode: '',
      debit: 0,
      credit: 0,
      addRow: true,
      unitId: '',
      accountName: '',
      isNew: true,
      creditDollar: 0,
      debitDollar: 0,
    };
    setDetails([...details, newRow]);
  };

  const handleDelete = (id: string) => {
    setDetails(details.filter((item) => item.id !== id));
  };

  const handleChange = (
    key: string,
    id: string,
    field: keyof JurnalHeaderInterfaces.JournalDetailType,
    value: string | number
  ) => {
    setDetails((prev) =>
      prev.map((entry) => {
        const isCurrent = entry.isNew ? entry.key === key : entry.id === id;

        if (!isCurrent) return entry;

        const updated = {
          ...entry,
          [field]: value,
        };

        if (field === 'debitDollar') {
          updated.debit = Number(value) * Number(currencyValue || 0);
        }

        if (field === 'creditDollar') {
          updated.credit = Number(value) * Number(currencyValue || 0);
        }

        return updated;
      })
    );
  };

  const totalDebit = details.reduce((sum, d) => sum + Number(d.debit), 0);
  const totalCredit = details.reduce((sum, d) => sum + Number(d.credit), 0);

  const columns: ColumnsType<JurnalHeaderInterfaces.JournalDetailType> = [
    {
      title: 'Account',
      dataIndex: 'accountCode',
      render: (_value, record) => (
        <div
          style={{
            display: 'flex',
            gap: 5,
            width: 'auto',
            minWidth: 300,
          }}
        >
          <Input
            value={`${details.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountCode || ''} - ${details.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountName}`}
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
      render: (_: any, record) => {
        return (
          <Select
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Pilih Unit"
            onChange={(val) => handleChange(record.key, record.id, 'unitId', val)}
            onSearch={onSearchUnit}
            value={record.unitId}
            options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
          />
        );
      },
    },

    {
      title: 'Keteran',
      dataIndex: 'description',
      render: (value, record) => (
        <Input
          style={{ width: 200 }}
          value={value}
          min={0}
          onChange={(val) =>
            handleChange(record.key, record.id, 'description', val.target.value || '')
          }
        />
      ),
    },

    {
      title: 'Debit (Rp)',
      dataIndex: 'debit',
      render: (value, record) => (
        <InputNumber
          formatter={globalHelpers.formatter}
          parser={globalHelpers.parser}
          // disabled={!record.addRow}
          disabled
          controls={false}
          value={value}
          style={{ width: 200 }}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'debit', val || 0)}
        />
      ),
    },
    {
      title: 'Credit (Rp)',
      dataIndex: 'credit',
      render: (value, record) => (
        <InputNumber
          style={{ width: 200 }}
          formatter={globalHelpers.formatter}
          parser={globalHelpers.parser}
          controls={false}
          // disabled={!record.addRow}
          disabled
          value={value}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'credit', val || 0)}
        />
      ),
    },
    {
      title: 'Debit (Dollar)',
      dataIndex: 'debitDollar',
      render: (value, record) => (
        <InputNumber
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          controls={false}
          value={value}
          style={{ width: 200 }}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'debitDollar', val || 0)}
        />
      ),
    },
    {
      title: 'Credit (Dollar)',
      dataIndex: 'creditDollar',
      render: (value, record) => (
        <InputNumber
          style={{ width: 200 }}
          formatter={globalHelpers.formatNumber2Digits}
          parser={globalHelpers.parseNumber2Digits}
          controls={false}
          value={value}
          min={0}
          onChange={(val) => handleChange(record.key, record.id, 'creditDollar', val || 0)}
        />
      ),
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      render: (_, record) => (
        <Popconfirm title="Hapus baris ini?" onConfirm={() => handleDelete(record.id)}>
          <Button danger size="small">
            Hapus
          </Button>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = async () => {
    try {
      if (id) {
        const data = await JurnalKhususAxios.fetchJurnalKhususDetail(id);
        setDataBasic(data as any);
        const dataJurnal = data?.details.map((item) => ({
          accountCode: item.accountCode,
          credit: item.credit,
          debit: item.debit,
          id: item.id,
          isTmp: item.isTmp,
          journalEntryId: item.journalEntryId,
          description: item.description,
          unitId: item.unitId,
          accountName: item.account.name,
          creditDollar: item.creditDollar,
          debitDollar: item.debitDollar,
        }));
        setDetails((dataJurnal as any) || []);
        form.setFieldsValue({
          numberJurnal: data?.numberJurnal,
          referenceNumber: data?.referenceNumber,
          unitId: data?.unit.id as any,
          date: dayjs(data?.date) as any,
          purposeTransaction: data?.purposeTransaction,
          createdBy: data?.createdBy,
          currencyValue: data?.currencyValue || 0,
        });
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const handleRowDoubleClick = (
    recordRow: any,
    record: JurnalHeaderInterfaces.JournalDetailType
  ) => {
    setDetails((prev) =>
      prev.map((entry) =>
        (entry.isNew ? entry.key === record.key : entry.id === record.id)
          ? { ...entry, ['accountCode']: recordRow.code, ['accountName']: recordRow.name }
          : entry
      )
    );
    setOpen(false);
  };

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const handleSubmit = async (values: JurnalHeaderInterfaces.PayloadUpdateType) => {
    try {
      if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
        return showNotification('warning', 'Peringatan', 'Total Debit dan Kredit Harus Balanace');
      }
      const hasEmptyCOA = details.some((entry) => !entry.accountCode);
      if (hasEmptyCOA) {
        return showNotification('warning', 'Peringatan', 'Semua entri harus memiliki akun COA');
      }
      setLoading(true);
      const payload = {
        ...values,
        totalBalance: totalDebit,
        totalBalanceUs: Number(details[0]?.debitDollar) || 0,
        date: handleDate(values.date as Dayjs),
        details: details.map((items) => {
          const { key, isTmp, currency, accountName, createdAt, account, ...newItems } = items; //hapus objek
          return {
            ...newItems,
            creditDollar: Number(newItems.creditDollar),
            debitDollar: Number(newItems.debitDollar),
            currencyValue: Number(values.currencyValue),
            debit: Number(newItems.debit),
            credit: Number(newItems.credit),
          };
        }),
      };
      const { currencyValue, ...resPayload } = payload;
      if (id) {
        await JurnalKhususAxios.updateJurnalKhusus(id, resPayload as any);
        navigate('/jurnal-khusus-dollar');

        setLoading(false);
        showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      } else {
        showNotification('warning', 'Peringatan', 'ID jurnal Kosong');
      }
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const currencyValue = Form.useWatch('currencyValue', form);

  useEffect(() => {
    if (!currencyValue) return;
    setDetails((prev) =>
      prev.map((item) => ({
        ...item,
        debit: Number(item.debitDollar) * Number(currencyValue),
        credit: Number(item.creditDollar) * Number(currencyValue),
      }))
    );
  }, [currencyValue, totalCredit, totalDebit]);

  return (
    <>
      {/* uang masuk Dollar */}
      {dataBasic?.transaction && (
        <>
          <Collapse
            defaultActiveKey={[]}
            style={{ marginBottom: 16, width: '100%' }}
            items={[
              {
                key: '1',
                label: 'Detail Transaksi',
                children: <TransactionDollarDetail dataBasic={dataBasic} />,
              },
            ]}
          />
          <hr />
        </>
      )}

      {/* Penjualan */}
      {dataBasic?.spb && (
        <>
          <Collapse
            defaultActiveKey={[]}
            style={{ marginBottom: 16, width: '100%' }}
            items={[
              {
                key: '1',
                label: 'Detail Transaksi',
                children: <SpbsDetail dataBasic={dataBasic} />,
              },
            ]}
          />
          <hr />
        </>
      )}
      <Card title="Edit Jurnal (Draft)">
        <ModalAccount
          record={selectedRecord}
          open={open}
          setOpen={setOpen}
          handleRowDoubleClick={handleRowDoubleClick}
        />
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

              <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
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

              <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
                style={{ width: '100%' }}
                label="Kurs Dollar"
                name="currencyValue"
                extra={<TextTerbilang form={form} properti="currencyValue" />}
              >
                <InputNumber
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                  controls={false}
                  placeholder="Kurs Dollar "
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
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

              <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
                style={{ width: '100%' }}
                label="Dibuat Oleh"
                name="createdBy"
              >
                <Input disabled placeholder="Dibuat Oleh" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<JurnalHeaderInterfaces.PayloadUpdateType>
                style={{ width: '100%' }}
                label="Tujuan Transaksi"
                name="purposeTransaction"
              >
                <Input placeholder="Tujuan Transaksi umum jurnal" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Table
            dataSource={details}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={false}
            style={{ marginTop: 24 }}
            footer={() => (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button icon={<PlusOutlined />} onClick={handleAddRow}>
                  Tambah Baris
                </Button>
                <Space>
                  <Text strong>Total Debit: {totalDebit.toLocaleString()}</Text>
                  <Text strong>Total Credit: {totalCredit.toLocaleString()}</Text>
                </Space>
              </div>
            )}
          />

          <Space style={{ marginTop: 24 }}>
            <Flex gap={'small'}>
              <Buttonback loading={loading} />

              <ButtonAdd loading={loading} />
            </Flex>
          </Space>
        </Form>
      </Card>
    </>
  );
};

export default JurnalKhususDollarEdit;
