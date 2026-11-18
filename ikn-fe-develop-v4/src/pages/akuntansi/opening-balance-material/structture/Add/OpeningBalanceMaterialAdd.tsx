import { useMemo, useState } from 'react';
import { Form, Space, Row, Col, Flex, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';
import * as OpeningBalanceAxios from '@pages/akuntansi/opening-balance/service/OpeningBalanceAxios';
import { showNotification } from '@/contexts/services/notificationService';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import { Plus, TagChevron } from '@phosphor-icons/react';
import { findDuplicateObjects, handleDate } from '@/utils/func/func';
import * as BarangMentahInterfaces from '@/pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType } from 'antd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import DrawerBarangMentah from '@pages/akuntansi/opening-balance-material/structture/Components/DrawerBarangMentah/DrawerBarangMentah';
import { JournalEntryOpeningBalance } from '@pages/akuntansi/opening-balance-material/interfaces/OpeningBalanceInterfaces';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { Button, Card, DatePicker, Input, InputNumber, Select, Table } from '@/components/ui';

const OpeningBalanceMaterialAdd = () => {
  const navigate = useAppNavigate();
  const [form] = Form.useForm<OpeningBalanceInterfaces.OpeningBalanceType>();
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [entries, setEntries] = useState<JournalEntryOpeningBalance[]>([
    { key: '1', accountCode: null, description: '', debit: 0, credit: 0, accountName: '' },
  ]);
  const totalDebit = useMemo(() => entries.reduce((sum, e) => sum + (e.debit || 0), 0), [entries]);
  const totalCredit = useMemo(
    () => entries.reduce((sum, e) => sum + (e.credit || 0), 0),
    [entries]
  );
  const [selectedRecord, setSelectedRecord] = useState<JournalEntryOpeningBalance | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
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
        accountName: '',
      },
    ]);
  };

  const removeRow = (key: string) => {
    setEntries(entries.filter((entry) => entry.key !== key));
  };

  const handleChange = (key: string, field: keyof JournalEntryOpeningBalance, value: any) => {
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
        date: handleDate(values.date as Dayjs),
        totalBalance: totalDebit,
        fiscalYear: dayjs(values.date).format('YYYY'),
        rawmItems: dataSourceItems.map((items) => {
          const { ...newItems } = items; //hapus objek
          return newItems;
        }),
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
      navigate('/opening-balance-material');

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
      render: (_: any, record: JournalEntryOpeningBalance) => (
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
      render: (_: any, record: JournalEntryOpeningBalance) => (
        <InputNumber
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
      render: (_: any, record: JournalEntryOpeningBalance) => (
        <InputNumber
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
      render: (_: any, record: JournalEntryOpeningBalance) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} />
      ),
    },
  ];

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

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
        return <span>{globalHelpers.currencyFormatter(quantity)}</span>;
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
        return <span>Rp{globalHelpers.currencyFormatter(record.Total / quantity)}</span>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      align: 'center',
      render: (Total) => {
        return <span>Rp{globalHelpers.currencyFormatter(Total || 0)}</span>;
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: BarangMentahInterfaces.ItemsType) => {
        return (
          <Space>
            <ButtonEditGroup onClick={() => handleEdit(record.id)} />
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
              onConfirm={() => handleDelete(record.id)} // Fungsi delete
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
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
                  options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>
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

export default OpeningBalanceMaterialAdd;
