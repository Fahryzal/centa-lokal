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
  Tag,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';

import * as BarangJadiIssueAxios from '@pages/gudang/barang-jadi-issue/service/BarangJadiIssueAxios';
import * as FinishedGoodsIssueInterfaces from '@/pages/gudang/barang-jadi-issue/interface/BarangJadiIssueInterfaces';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';

import DrawerBarangJadiIssue from './DrawerBarangJadiIssue/DrawerBarangJadiIssue';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { handleDate } from '@/utils/func/func';
import type { TableColumnsType } from 'antd';

interface IssueFormItem {
  finishedGoodId: string;
  kodeBarang: string;
  namaBarang: string;
  kategori?: string;
  quantity: number;
  Satuan: string;
}

interface UpdateFormValues {
  documentCode: string;
  documentNumber: string;
  unitId: string;
  date: string | null;
  diPergunakan?: string;
  keterangan?: string;
}

type IssueStatus = 'DRAFT' | 'REVERTED' | 'POSTED';

export default function BarangJadiIssueUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm<UpdateFormValues>();
  const [formItems] = Form.useForm();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [status, setStatus] = useState<IssueStatus | null>(null);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<IssueFormItem[]>([]);
  const [editingFinishedGoodId, setEditingFinishedGoodId] = useState<string | null>(null);

  // Mengambil daftar unit.
  globalHooks.useFetchOptions(unit, setUnit, BarangJadiIssueAxios.fetchDataUnit, [unit.nama]);

  // Dokumen DRAFT dan REVERTED boleh diedit.
  const canEdit = status === 'DRAFT' || status === 'REVERTED';

  // =====================================================
  // GET DETAIL DOKUMEN
  // =====================================================

  const loadData = useCallback(async () => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID pengeluaran barang jadi tidak ditemukan.');
      setLoadingData(false);
      return;
    }

    try {
      setLoadingData(true);

      const data = await BarangJadiIssueAxios.fetchDataFinishedGoodsIssueById(id);

      console.log('DATA DETAIL PENGELUARAN:', data);

      if (!data) {
        throw new Error('Data pengeluaran barang jadi tidak ditemukan.');
      }

      const documentStatus = String(data.status ?? 'DRAFT').toUpperCase() as IssueStatus;

      setStatus(documentStatus);

      // Mengisi header dokumen.
      form.setFieldsValue({
        documentCode: data.documentCode ?? '',
        documentNumber: data.documentNumber ?? '',
        unitId: data.unitId ?? data.unit?.id ?? '',
        date: data.date ? dayjs(data.date).format('YYYY-MM-DD') : null,
        diPergunakan: data.diPergunakan ?? '',
        keterangan: data.keterangan ?? '',
      });

      // Mengambil detail barang.
      // ID detail tidak diperlukan karena backend akan membuat ulang seluruh detail saat UPDATE.
      const detailItems = data.ProductionIssueItem ?? data.items ?? [];

      console.log('DATA ITEM PENGELUARAN:', detailItems);

      const mappedItems: IssueFormItem[] = detailItems.map((item: any) => {
        const finishedGood = item.finishedGood ?? {};

        return {
          finishedGoodId: item.finishedGoodId ?? finishedGood.id ?? '',
          kodeBarang: finishedGood.kodeBarang ?? '',
          namaBarang: finishedGood.namaBarang ?? '',
          kategori: finishedGood.kategori ?? '',
          quantity: Number(item.quantity ?? 0),
          Satuan: item.Satuan ?? finishedGood.satuan ?? finishedGood.Satuan ?? '',
        };
      });

      console.log('HASIL MAPPING ITEM:', mappedItems);

      setDataSourceItems(mappedItems);
    } catch (error: any) {
      console.error('Gagal mengambil detail pengeluaran barang jadi:', error);

      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message ??
          error?.message ??
          'Gagal mengambil data pengeluaran barang jadi.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [id, form]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // =====================================================
  // DRAWER ITEM
  // =====================================================

  const handleDrawerItems = (updater: any) => {
    setDataSourceItems((previous) =>
      typeof updater === 'function' ? updater(previous) : (updater ?? [])
    );
  };

  const handleDelete = (finishedGoodId: string) => {
    setDataSourceItems((previous) =>
      previous.filter((item) => item.finishedGoodId !== finishedGoodId)
    );
  };

  const handleEdit = (finishedGoodId: string) => {
    const selectedItem = dataSourceItems.find((item) => item.finishedGoodId === finishedGoodId);

    if (!selectedItem) return;

    setEditingFinishedGoodId(finishedGoodId);

    // ID detail ikut dimasukkan ke form Drawer.
    formItems.setFieldsValue({
      ...selectedItem,
    });

    setOpenDrawer(true);
  };

  // =====================================================
  // UPDATE DOKUMEN
  // =====================================================

  const onFinish = async (values: UpdateFormValues) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID pengeluaran barang jadi tidak ditemukan.');
      return;
    }

    if (!canEdit) {
      showNotification(
        'error',
        'Tidak dapat mengedit',
        'Dokumen berstatus POSTED. Silakan revert terlebih dahulu.'
      );
      return;
    }

    if (dataSourceItems.length === 0) {
      showNotification('error', 'Validasi', 'Tambahkan minimal satu barang yang akan dikeluarkan.');
      return;
    }

    const invalidItem = dataSourceItems.some(
      (item) =>
        !item.finishedGoodId ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !item.Satuan?.trim()
    );

    if (invalidItem) {
      showNotification(
        'error',
        'Validasi',
        'Periksa kembali barang, jumlah, dan satuan setiap item.'
      );
      return;
    }

    try {
      setLoading(true);

      // Gunakan tipe payload UPDATE, bukan payload CREATE.
      const payload: FinishedGoodsIssueInterfaces.UpdateFinishedGoodsIssuePayload = {
        documentCode: values.documentCode,
        documentNumber: values.documentNumber,
        unitId: values.unitId,
        date: values.date ? handleDate(dayjs(values.date)) : '',
        diPergunakan: values.diPergunakan || '',
        keterangan: values.keterangan || '',

        items: dataSourceItems.map((item) => ({
          finishedGoodId: item.finishedGoodId,
          quantity: Number(item.quantity),
          Satuan: item.Satuan,
        })),
      };

      console.log('PAYLOAD UPDATE PENGELUARAN:', payload);

      await BarangJadiIssueAxios.updateFinishedGoodsIssue(id, payload);

      showNotification('success', 'Berhasil', 'Pengeluaran barang jadi berhasil diperbarui.');

      setTimeout(() => {
        navigate('/finished-goods-issue');
      }, 1000);
    } catch (error: any) {
      console.error('Gagal memperbarui pengeluaran barang jadi:', error);

      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message ?? 'Gagal memperbarui pengeluaran barang jadi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns: TableColumnsType<IssueFormItem> = [
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
      title: 'Jumlah Dikeluarkan',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity: number) => <span>{globalHelpers.currencyFormatter(quantity)}</span>,
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      key: 'Satuan',
      align: 'center',
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IssueFormItem) => (
        <Space>
          <ButtonEditGroup
            onClick={() => handleEdit(record.finishedGoodId)}
            disabled={!canEdit || loading}
          />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus barang ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.finishedGoodId)}
            disabled={!canEdit || loading}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} disabled={!canEdit || loading}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Spin spinning={loadingData}>
      <Card
        title={<TitleCardAdd title="Update Pengeluaran Barang Jadi" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        extra={
          status ? (
            <Tag color={status === 'POSTED' ? 'green' : status === 'REVERTED' ? 'orange' : 'blue'}>
              {status}
            </Tag>
          ) : null
        }
      >
        <DrawerBarangJadiIssue
          formItems={formItems}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          setDataSourceItems={handleDrawerItems}
          editingFinishedGoodId={editingFinishedGoodId}
          setEditingFinishedGoodId={setEditingFinishedGoodId}
        />

        {!canEdit && status === 'POSTED' && (
          <div style={{ marginBottom: 16 }}>
            Dokumen berstatus POSTED dan tidak dapat diedit. Silakan lakukan Revert terlebih dahulu.
          </div>
        )}

        <Form<UpdateFormValues>
          layout="vertical"
          form={form}
          name="updateFinishedGoodsIssue"
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
                  disabled={!canEdit || loading}
                />
              </Form.Item>

              <Form.Item
                label="Nomor Dokumen"
                name="documentNumber"
                rules={[{ required: true, message: 'Masukkan nomor dokumen!' }]}
              >
                <Input
                  prefix={<FilePdf size={16} />}
                  placeholder="Nomor Dokumen"
                  disabled={!canEdit || loading}
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
                  disabled={!canEdit || loading}
                  onChange={() =>
                    setUnit((previous) => ({
                      ...previous,
                      nama: '',
                    }))
                  }
                  options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
                />
              </Form.Item>

              <Form.Item
                label="Tanggal Pengeluaran"
                name="date"
                rules={[{ required: true, message: 'Pilih tanggal pengeluaran!' }]}
                getValueFromEvent={(date) => (date ? date.format('YYYY-MM-DD') : null)}
                getValueProps={(value) => ({
                  value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
                })}
              >
                <DatePicker
                  prefix={<Calendar />}
                  style={{ width: '100%' }}
                  placeholder="Tanggal Pengeluaran"
                  format="YYYY-MM-DD"
                  disabled={!canEdit || loading}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Dipergunakan Untuk" name="diPergunakan">
                <Input placeholder="Tujuan penggunaan barang" disabled={!canEdit || loading} />
              </Form.Item>

              <Form.Item label="Keterangan" name="keterangan">
                <Input.TextArea
                  rows={3}
                  placeholder="Masukkan keterangan"
                  disabled={!canEdit || loading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <TitleCardItems title="Item Pengeluaran Barang" />

                <Button
                  type="primary"
                  htmlType="button"
                  icon={<Plus />}
                  disabled={!canEdit || loading}
                  onClick={() => {
                    setEditingFinishedGoodId(null);
                    formItems.resetFields();
                    setOpenDrawer(true);
                  }}
                  style={{ width: 250 }}
                >
                  Tambah Barang
                </Button>
              </div>
            }
            style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
          >
            <Table<IssueFormItem>
              rowKey="finishedGoodId"
              columns={columns}
              dataSource={dataSourceItems}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </Card>

          <Flex gap="small">
            <Buttonback loading={loading} />

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!canEdit || loading}
            >
              Update
            </Button>
          </Flex>
        </Form>
      </Card>
    </Spin>
  );
}
