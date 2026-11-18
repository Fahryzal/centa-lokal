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
  Popconfirm,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import { useNavigate, useParams } from 'react-router';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';
import * as OpeningBalanceAxios from '@pages/akuntansi/opening-balance/service/OpeningBalanceAxios';
import { showNotification } from '@/contexts/services/notificationService';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import { findDuplicateObjects, handleDate, handleMessageError } from '@/utils/func/func';
import type { TableColumnsType } from 'antd';
import * as BarangMentahInterfaces from '@/pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { Plus, TagChevron } from '@phosphor-icons/react';
import { JournalEntryOpeningBalance } from '@pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import DrawerBarangMentah from '@pages/akuntansi/opening-balance-material/structture/Components/DrawerBarangMentah/DrawerBarangMentah';

type JournalEntry = {
  key: string;
  accountCode: string | null;
  description: string;
  debit: number;
  credit: number;
  deletedAt?: Dayjs;
  headerId?: string;
  staffId?: string;
  code?: string;
  accountName: string;
  isNew: boolean;
  id: string;
};

const OpeningBalanceMaterialRevert = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<OpeningBalanceInterfaces.OpeningBalanceType>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
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
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<JournalEntry | null>(null);
  const [dataSourceItems, setDataSourceItems] = useState<BarangMentahInterfaces.ItemsType[]>([]);
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);

  const addRow = () => {
    setEntries([
      ...entries,
      {
        id: '',
        key: Date.now().toString(),
        accountCode: null,
        description: '',
        debit: 0,
        credit: 0,
        accountName: '',
        isNew: true,
      },
    ]);
  };

  const removeRow = (key: string, id: string) => {
    setEntries(entries.filter((entry) => (entry.isNew ? entry.key !== key : entry.id !== id)));
  };

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

  const getDataById = async () => {
    if (id) {
      const data = await OpeningBalanceAxios.fetchOpeningBalanaceDetail(id);
      form.setFieldsValue({
        date: dayjs(data.date),
        notes: `Reversal opening balance untuk tanggal ${data?.date}`,
        unitId: data?.unitId,
      });

      const dataOpening = data?.details.map((items: any) => ({
        id: items.id,
        accountCode: items.accountCode,
        accountName: items.account.name,
        description: `Reversal opening balance untuk tanggal ${data?.date}`,
        debit: items.credit,
        credit: items.debit,
        isNew: false,
      }));
      setDataSourceItems(data.openingMaterialItems || []);
      setEntries(dataOpening || []);
    }
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

      const payload = {
        ...values,
        totalBalance: totalDebit,
        fiscalYear: dayjs(values.date).format('YYYY'),
        date: handleDate(values.date as Dayjs),
        rawmItems: dataSourceItems.map((items) => {
          const { productId, openingId, updatedAt, deletedAt, createdAt, ...newItems } = items; //hapus objek
          return newItems;
        }),
        details: entries.map((items) => {
          const {
            key,
            description,
            accountName,
            deletedAt,
            headerId,
            staffId,
            isNew,
            ...newItems
          } = items; //hapus objek
          return {
            ...newItems,
            unitId: values.unitId,
            fiscalYear: dayjs(values.date).format('YYYY'),
          };
        }),
      };
      if (id) {
        await OpeningBalanceAxios.revertOpeningBalance(id, payload as any);
        navigate('/opening-balance-material');

        setLoading(false);
        showNotification('success', 'Berhasil', 'Data Berhasil di Revert');
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak di temukan');
      }
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
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
            value={`${entries.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountCode || ''} - ${entries.find((i) => (i.isNew ? i.key === record.key : i.id === record.id))?.accountName}`}
            disabled
            prefix={<TagChevron size={16} />}
            placeholder="Nama Akun"
          />

          <Tooltip title="Search akun">
            <Button
              disabled
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
      render: (_: number, record: JournalEntry) => (
        <InputNumber
          disabled
          min={0}
          style={{ width: 200 }}
          value={record.debit}
          formatter={helperGlobal.formatNumber2Digits}
          parser={helperGlobal.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.id || record.key, 'debit', val || 0);
            if (val) handleChange(record.id || record.key, 'credit', 0); // only one side filled
          }}
        />
      ),
    },
    {
      title: 'Kredit',
      dataIndex: 'credit',
      render: (_: number, record: JournalEntry) => (
        <InputNumber
          disabled
          style={{ width: 200 }}
          min={0}
          value={record.credit}
          formatter={helperGlobal.formatNumber2Digits}
          parser={helperGlobal.parseNumber2Digits}
          onChange={(val) => {
            handleChange(record.id || record.key, 'credit', val || 0);
            if (val) handleChange(record.id || record.key, 'debit', 0); // only one side filled
          }}
        />
      ),
    },
    {
      title: '',
      render: (_: string, record: JournalEntry) => (
        <Button
          disabled
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(record.key, record.id)}
        />
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
        (entry.isNew ? entry.key === record.key : entry.id === record.id)
          ? { ...entry, ['accountCode']: recordRow.code, ['accountName']: recordRow.name }
          : entry
      )
    );
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    // 1️⃣ Hapus item yang dipilih
    const filteredData = dataSourceItems.filter((item) => item.id !== id);
    setDataSourceItems(filteredData);

    // 2️⃣ Hitung ulang total per accountCode
    const totalPerAccount = filteredData.reduce(
      (acc, item) => {
        acc[item.accountCode] = (acc[item.accountCode] || 0) + (Number(item.Total) || 0);
        return acc;
      },
      {} as Record<string, number>
    );

    // 3️⃣ Panggil handleChange untuk setiap accountCode
    Object.entries(totalPerAccount).forEach(([accountCode, total]) => {
      const cekAccountOnEntries = entries.find((item) => item.accountCode === accountCode);
      if (cekAccountOnEntries) {
        handleChange(cekAccountOnEntries.id || cekAccountOnEntries.key, 'debit', total || 0);
      }
    });
  };

  const handleEdit = (id: string) => {
    const findOne = dataSourceItems.find((items) => items.id === id) as any;
    formItems.setFieldsValue({
      id: findOne?.id,
      itemCode: findOne?.itemCode,
      itemName: findOne?.itemName,
      unit: findOne?.unit,
      satuan: findOne?.satuan,
      accountCode: findOne?.accountCode,
      quantity: findOne?.quantity,
      Total: findOne?.Total,
    });
    seOpenDrawer(true);
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
      render: (_: string, record: BarangMentahInterfaces.ItemsType) => {
        return (
          <Space>
            <ButtonEditGroup disabled onClick={() => handleEdit(record.id)} />
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
              disabled
              onConfirm={() => handleDelete(record.id)} // Fungsi delete
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
      <DrawerBarangMentah
        handleChange={handleChange}
        entries={entries}
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

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
                  disabled
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
                <Input disabled placeholder="Deskripsi umum jurnal" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item<OpeningBalanceInterfaces.OpeningBalanceType>
                style={{ width: '100%' }}
                label="Unit"
                name={'unitId'}
              >
                <Select
                  disabled
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
                disabled
                icon={<Plus />}
                onClick={() => seOpenDrawer(true)}
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
              <ButtonAdd loading={loading} />
            </Flex>
          </Space>
        </Space>
      </Form>
    </Card>
  );
};

export default OpeningBalanceMaterialRevert;
