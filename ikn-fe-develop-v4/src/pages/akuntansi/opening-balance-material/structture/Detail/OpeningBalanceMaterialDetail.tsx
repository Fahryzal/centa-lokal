import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Select,
  InputNumber,
  Button,
  Form,
  Space,
  Card,
  Flex,
  Descriptions,
  Popconfirm,
  Tag,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import * as helperGlobal from '@/utils/helper';
import * as AccountAxios from '@pages/master/account-index/account/service/AccountAxios';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import { useNavigate, useParams } from 'react-router';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';
import * as OpeningBalanceAxios from '@pages/akuntansi/opening-balance/service/OpeningBalanceAxios';
import { showNotification } from '@/contexts/services/notificationService';
import type { TableColumnsType } from 'antd';
import * as BarangMentahInterfaces from '@/pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { Plus } from '@phosphor-icons/react';

type JournalEntry = {
  key: string;
  accountCode: string | null;
  description: string;
  debit: number;
  credit: number;
  deletedAt?: Dayjs;
  headerId?: string;
  staffId?: string;
};

const OpeningBalanceMaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<OpeningBalanceInterfaces.OpeningBalanceType>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [dataAccount, setDataAccount] = useState<AccountInterfaces.AccountType[]>([]);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSourceItems, setDataSourceItems] = useState<BarangMentahInterfaces.ItemsType[]>([]);

  const addRow = () => {
    setEntries([
      ...entries,
      {
        key: Date.now().toString(),
        accountCode: null,
        description: '',
        debit: 0,
        credit: 0,
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

  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = async () => {
    if (id) {
      const data = await OpeningBalanceAxios.fetchOpeningBalanaceDetail(id);
      form.setFieldsValue({
        date: helperGlobal.dateFormat(data.date),
        notes: data?.notes,
        unitId: data?.unitId,
        unit: data?.unit?.nama,
        staff: data?.staff?.name,
        status: data?.status,
      });
      const dataOpening = data?.details.map((items: any) => ({
        id: items.id,
        accountCode: items.accountCode,
        accountName: items.account.name,
        description: items.description,
        debit: items.debit,
        credit: items.credit,
        isNew: false,
      }));
      setDataSourceItems(data.openingMaterialItems || []);

      setEntries(dataOpening || []);
    }
  };

  const columns = [
    {
      title: 'Akun (COA)',
      dataIndex: 'coa',
      render: (_: any, record: JournalEntry) => (
        <Select
          disabled
          showSearch
          allowClear
          style={{ width: 300 }}
          placeholder="Pilih akun"
          options={helperGlobal.toAntdOptionsV2(dataAccount, 'code', 'code', 'name')}
          value={record.accountCode}
          onChange={(val) => handleChange(record.key, 'accountCode', val)}
        />
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (_: any, record: JournalEntry) => (
        <InputNumber
          min={0}
          style={{ width: 200 }}
          disabled
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
          disabled
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
        <Button disabled danger icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} />
      ),
    },
  ];

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const data = await AccountAxios.fetchDataAccount({ page: 1, limit: 100, accountTypeName: '' });
    setDataAccount(data?.data?.data?.data || []);
  };

  const handlePost = async () => {
    try {
      if (id) {
        setLoading(true);
        await OpeningBalanceAxios.posPostingOpeningBalance(id);
        showNotification('success', 'Berhasil', 'Data Berhasil ditambahkan');
        setTimeout(() => {
          navigate('/opening-balance-material');
        }, 1000);
      } else {
        showNotification('warning', 'Peringatan', 'ID jurnal kosong');
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const columnsBarangMentah: TableColumnsType<BarangMentahInterfaces.ItemsType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
    },
    {
      title: 'Jumlah Diterima',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => {
        return <span>{helperGlobal.currencyFormatter(quantity)}</span>;
      },
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      key: 'satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record: any) => {
        return <span>Rp{helperGlobal.currencyFormatter(record.Total / quantity)}</span>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      align: 'center',
      render: (Total) => {
        return <span>Rp{helperGlobal.currencyFormatter(Number(Total) || 0)}</span>;
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, _record: BarangMentahInterfaces.ItemsType) => {
        return (
          <Space>
            <ButtonEditGroup onClick={() => console.log('')} disabled />
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
            >
              <Button disabled type="primary" danger icon={<DeleteOutlined />}>
                Hapus
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title={<TitleCardAdd title="Buat Opening Balance" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Tanggal">
          {dayjs(form.getFieldValue('date')).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Unit">{form.getFieldValue('unit')}</Descriptions.Item>
        <Descriptions.Item label="Dibuat oleh">{form.getFieldValue('staff')}</Descriptions.Item>
        <Descriptions.Item label="Deskripsi" span={2}>
          {form.getFieldValue('notes')}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={2}>
          <Tag
            style={{
              color: form.getFieldValue('status') === 'confirmed' ? 'green' : 'red',
            }}
          >
            {form.getFieldValue('status')}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
      <Form form={form} layout="vertical">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Table
            columns={columns}
            scroll={{ x: 'max-content' }}
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

          <Card
            title={<TitleCardItems title="Item Barang" />}
            style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}
            >
              <Button
                type="primary"
                htmlType="button"
                icon={<Plus />}
                disabled
                style={{ width: 230 }}
              >
                Tambah Penerimaan Barang
              </Button>
            </div>
            <Table<BarangMentahInterfaces.ItemsType>
              columns={columnsBarangMentah}
              dataSource={dataSourceItems as any}
              scroll={{ x: 'max-content' }}
            />{' '}
          </Card>

          <Space style={{ marginTop: 24 }}>
            <Flex gap={'small'}>
              <Buttonback />
              <Button
                disabled={form.getFieldValue('status') === 'confirmed'}
                loading={loading}
                icon={<SaveOutlined />}
                type="primary"
                onClick={handlePost}
              >
                Posting
              </Button>
            </Flex>
          </Space>
        </Space>
      </Form>
    </Card>
  );
};

export default OpeningBalanceMaterialDetail;
