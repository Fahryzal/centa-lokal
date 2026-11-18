import { Calendar, FilePdf, Plus, TagChevron, User } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Flex,
  Select,
  DatePicker,
  Input,
  Table,
  Space,
  Popconfirm,
  Spin,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import DrawerBarangJadi from './DrawerBarangJadi/DrawerBarangJadi';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';

dayjs.locale('id');

type BarangJadiItem = BarangJadiInterfaces.BarangJadiType;

type UpdateFormValues = {
  documentCode: string;
  documentNumber: string;
  unitId: string;
  date: string | null;
};

type ReceiptResponse = BarangJadiInterfaces.DataType & {
  status?: 'DRAFT' | 'POSTED' | 'POSTING' | null;
};

export default function BarangJadiUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm<UpdateFormValues>();
  const [formItems] = Form.useForm();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<BarangJadiItem[]>([]);
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, BarangJadiAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const isDraft = !receipt?.status || receipt.status === 'DRAFT';

  const loadData = useCallback(async () => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID barang jadi tidak ditemukan.');
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    try {
      // Samakan endpoint dengan halaman BarangJadiDetail.
      const data: BarangJadiInterfaces.DataType = await BarangJadiAxios.fetchDataBarangById(id);

      if (!data) {
        throw new Error('Data barang jadi tidak ditemukan.');
      }

      setReceipt(data as ReceiptResponse);

      form.setFieldsValue({
        documentCode: data.documentCode ?? '',
        documentNumber: data.documentNumber ?? '',
        unitId: data.unit?.id ?? '',
        date: data.date ? dayjs(data.date).format('YYYY-MM-DD') : null,
      });

      // ItemsType menyimpan detail barang di item.finishedGood.
      // item.unit adalah string, bukan objek unit.
      const items: BarangJadiItem[] = (data.items ?? []).map((item, index) => {
        const finishedGood = item.finishedGood;

        const finishedGoodId = item.finishedGoodId || finishedGood?.finishedGoodId || '';

        const unitValue =
          typeof item.unit === 'string' && item.unit.includes('$')
            ? item.unit
            : `${data.unit?.id ?? ''}$${data.unit?.nama ?? ''}`;

        return {
          ...finishedGood,
          finishedGoodId,
          kodeBarang: finishedGood?.kodeBarang ?? '',
          namaBarang: finishedGood?.namaBarang ?? '',
          kategori: finishedGood?.kategori ?? '',
          satuan: item.Satuan || finishedGood?.satuan || '',
          quantity: Number(item.quantity ?? 0),
          nilaiSatuan: Number(finishedGood?.nilaiSatuan ?? 0),
          spesifikasi: finishedGood?.spesifikasi ?? '',
          unit: unitValue,
          unitId: unitValue.split('$')[0] || data.unit?.id || '',
          key: String(item.id || finishedGoodId || index),
        };
      });

      setDataSourceItems(items);
    } catch (error: any) {
      console.error('Gagal mengambil data barang jadi:', error);

      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message ?? error?.message ?? 'Gagal mendapatkan data barang jadi.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [id, form]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleDrawerItems = (updater: any) => {
    setDataSourceItems((previous) => {
      const updated = typeof updater === 'function' ? updater(previous) : updater;

      return (updated ?? []).map((item: any, index: number) => ({
        ...item,
        key: String(item.key ?? item.id ?? item.finishedGoodId ?? index),
      }));
    });
  };

  const handleDelete = (finishedGoodId: string) => {
    setDataSourceItems((previous) =>
      previous.filter((item) => item.finishedGoodId !== finishedGoodId)
    );
  };

  const handleEdit = (finishedGoodId: string) => {
    const selected = dataSourceItems.find((item) => item.finishedGoodId === finishedGoodId);

    if (!selected) return;

    formItems.setFieldsValue({
      finishedGoodId: selected.finishedGoodId,
      kodeBarang: selected.kodeBarang,
      namaBarang: selected.namaBarang,
      kategori: selected.kategori,
      satuan: selected.satuan,
      nilaiSatuan: selected.nilaiSatuan,
      quantity: selected.quantity,
      spesifikasi: selected.spesifikasi,
      unit: selected.unit,
    });

    setOpenDrawer(true);
  };

  const onFinish = async (values: UpdateFormValues) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID barang jadi tidak ditemukan.');
      return;
    }

    if (!isDraft) {
      showNotification(
        'error',
        'Tidak dapat mengedit',
        'Dokumen hanya dapat diedit ketika statusnya DRAFT.'
      );
      return;
    }

    if (dataSourceItems.length === 0) {
      showNotification('error', 'Validasi', 'Minimal harus ada satu item barang jadi.');
      return;
    }

    const items: BarangJadiInterfaces.ItemType[] = dataSourceItems.map((item) => {
      const itemUnitId = item.unit?.split('$')[0] || item.unitId || values.unitId;

      return {
        finishedGoodId: item.finishedGoodId,
        quantity: Number(item.quantity),
        satuan: item.satuan ?? '',
        nilaiSatuan: Number(item.nilaiSatuan ?? 0),
        spesifikasi: item.spesifikasi ?? '',
        namaBarang: item.namaBarang ?? '',
        kodeBarang: item.kodeBarang ?? '',
        kategori: item.kategori ?? '',
        unitId: itemUnitId,
      };
    });

    const invalidItem = items.some(
      (item) =>
        !item.finishedGoodId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.nilaiSatuan) ||
        item.nilaiSatuan < 0 ||
        !item.unitId
    );

    if (invalidItem) {
      showNotification(
        'error',
        'Validasi',
        'Periksa kembali barang, jumlah, nilai satuan, dan unit setiap item.'
      );
      return;
    }

    try {
      setLoading(true);

      const payload: BarangJadiInterfaces.PayloadBarangJadiType = {
        documentCode: values.documentCode,
        documentNumber: values.documentNumber,
        unitId: values.unitId,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : '',
        items,
      };

      // Gunakan service yang sama dengan endpoint halaman Detail.
      await BarangJadiAxios.updateDataBarangJadi(id, payload);

      showNotification('success', 'Berhasil', 'Data barang jadi berhasil diperbarui.');

      navigate('/finished-goods');
    } catch (error: any) {
      console.error('Gagal memperbarui barang jadi:', error);

      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message ?? error?.message ?? 'Gagal memperbarui data barang jadi.'
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumnsType<BarangJadiItem> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      key: 'kodeBarang',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      key: 'namaBarang',
      align: 'center',
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
      align: 'center',
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      key: 'satuan',
      align: 'center',
    },
    {
      title: 'Jumlah Diterima',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => <span>{globalHelpers.currencyFormatter(quantity)}</span>,
    },
    {
      title: 'Nilai Satuan',
      dataIndex: 'nilaiSatuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (value) => <span>{globalHelpers.currencyFormatter(value)}</span>,
    },
    {
      title: 'Jumlah Total',
      key: 'total',
      align: 'center',
      render: (_, record) => (
        <span>
          {globalHelpers.currencyFormatter(
            Number(record.nilaiSatuan ?? 0) * Number(record.quantity ?? 0)
          )}
        </span>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (value: string | undefined) => value?.split('$')[1] || '-',
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <ButtonEditGroup
            onClick={() => handleEdit(record.finishedGoodId)}
            disabled={!isDraft || loading}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus item ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.finishedGoodId)}
            disabled={!isDraft || loading}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} disabled={!isDraft || loading}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loadingData}>
      <Card
        title={<TitleCardAdd title="Update Barang Jadi" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        extra={
          receipt?.status ? (
            <span>
              Status: <strong>{receipt.status}</strong>
            </span>
          ) : null
        }
      >
        <DrawerBarangJadi
          formItems={formItems}
          openDrawer={openDrawer}
          seOpenDrawer={setOpenDrawer}
          setDataSourceItems={handleDrawerItems}
        />

        {!isDraft && (
          <div style={{ marginBottom: 16 }}>
            Dokumen berstatus {receipt?.status} dan tidak dapat diedit.
          </div>
        )}

        <Form<UpdateFormValues>
          layout="vertical"
          form={form}
          name="updateBarangJadi"
          onFinish={onFinish}
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
                label="Kode Dokumen"
                name="documentCode"
                rules={[{ required: true, message: 'Masukkan kode dokumen!' }]}
              >
                <Input
                  prefix={<TagChevron size={16} />}
                  placeholder="Kode Dokumen"
                  disabled={!isDraft || loading}
                />
              </Form.Item>

              <Form.Item
                label="No. Dokumen"
                name="documentNumber"
                rules={[{ required: true, message: 'Masukkan nomor dokumen!' }]}
              >
                <Input
                  prefix={<FilePdf size={16} />}
                  placeholder="Nomor Dokumen"
                  disabled={!isDraft || loading}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Unit"
                name="unitId"
                rules={[{ required: true, message: 'Pilih unit!' }]}
              >
                <Select
                  prefix={<User />}
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih unit"
                  optionFilterProp="label"
                  disabled={!isDraft || loading}
                  onChange={() => setUnit((previous) => ({ ...previous, nama: '' }))}
                  options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>

              <Form.Item
                label="Tanggal Penerimaan"
                name="date"
                rules={[{ required: true, message: 'Pilih tanggal penerimaan!' }]}
                getValueFromEvent={(date: Dayjs | null) =>
                  date ? date.format('YYYY-MM-DD') : null
                }
                getValueProps={(value: string | null | undefined) => ({
                  value: value ? dayjs(value, 'YYYY-MM-DD') : null,
                })}
              >
                <DatePicker
                  prefix={<Calendar />}
                  style={{ width: '100%' }}
                  placeholder="Tanggal Penerimaan"
                  format="YYYY-MM-DD"
                  disabled={!isDraft || loading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Card
            title={<TitleCardItems title="Item Penerimaan Barang" />}
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
                disabled={!isDraft || loading}
                onClick={() => {
                  formItems.resetFields();
                  setOpenDrawer(true);
                }}
                style={{ width: 230 }}
              >
                Tambah Penerimaan Barang
              </Button>
            </div>

            <Table<BarangJadiItem>
              rowKey={(record) => record.finishedGoodId}
              columns={columns}
              dataSource={dataSourceItems}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Card>

          <Flex gap="small">
            <Buttonback loading={loading} />
            <ButtonAdd loading={loading} />
          </Flex>
        </Form>
      </Card>
    </Spin>
  );
}
