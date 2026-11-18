import { Calendar, CreditCard, FileText, Plus, Receipt, TagChevron } from '@phosphor-icons/react';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from 'antd';

import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';

import * as BarangMentahAxios from '@pages/gudang/barang-mentah/service/BarangMentahAxios';
import type {
  ItemsType,
  UpdateBarangMentahPayload,
} from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import type { SupplierType } from '@pages/master/supplier/interface/SupplierInterfaces';

import * as globalHelpers from '@/utils/helper';

import DrawerBarangMentah from './DrawerBarangMentah/DrawerBarangMentah';
import ModalSupplier from './ModalBarangMentah/ModalSupplier';

import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';

import { showNotification } from '@/contexts/services/notificationService';
import { handleDate } from '@/utils/func/func';

type ReceiptItem = ItemsType & {
  id?: string;
  itemCode?: string;
  itemName?: string;
  unit?: string;
  accountName?: string;
  hargaTotal: number;
};

type ReceiptData = {
  id: string;
  status?: string;
  documentCode?: string;
  documentNo?: string;
  date?: string | Date;
  supplier?:
    | string
    | {
        id?: string;
        namaRekanan?: string;
        name?: string;
        account?: {
          id?: string;
          code?: string;
        };
      };
  supplierId?: string;
  idSupplier?: string;
  namaRekanan?: string;
  noRekening?: string;
  accountCode?: string;
  pengadaanBarang?: string;
  faktur?: string;
  simpanKeBarangJadi?: boolean;
  items?: any[];
};

export default function BarangMentahUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [formItems] = Form.useForm();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [modalSupplier, setModalSupplier] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [dataSourceItems, setDataSourceItems] = useState<ReceiptItem[]>([]);
  const [dataReceipt, setDataReceipt] = useState<ReceiptData | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  const totalKeseluruhan = useMemo(
    () => dataSourceItems.reduce((total, item) => total + Number(item.hargaTotal || 0), 0),
    [dataSourceItems]
  );

  useEffect(() => {
    form.setFieldValue('subtotalAmount', totalKeseluruhan);
  }, [totalKeseluruhan, form]);

  const getDataById = useCallback(
    async (receiptId: string) => {
      try {
        setLoadingData(true);

        const data = (await BarangMentahAxios.fetchDataBarangMentahById(
          receiptId
        )) as ReceiptData | null;

        if (!data) {
          throw new Error('Data penerimaan tidak ditemukan');
        }

        setDataReceipt(data);

        const status = String(data.status ?? '').toUpperCase();
        const editable = status === 'DRAFT' || status === 'REVERTED';

        setCanEdit(editable);

        const supplierObject =
          data.supplier && typeof data.supplier === 'object' ? data.supplier : null;

        const supplierId = data.idSupplier ?? data.supplierId ?? supplierObject?.id ?? '';

        const supplierName =
          supplierObject?.namaRekanan ??
          supplierObject?.name ??
          (typeof data.supplier === 'string' ? data.supplier : '') ??
          data.namaRekanan ??
          '';

        form.setFieldsValue({
          documentCode: data.documentCode ?? '',
          documentNo: data.documentNo ?? '',
          idSupplier: supplierId,
          namaRekanan: supplierName,
          noRekening: data.noRekening ?? supplierObject?.account?.code ?? '',
          accountCode: data.accountCode ?? supplierObject?.account?.id ?? '',
          pengadaanBarang: data.pengadaanBarang,
          date: data.date ? dayjs(data.date).format('YYYY-MM-DD') : null,
          faktur: data.faktur ?? '',
          simpanKeBarangJadi: data.simpanKeBarangJadi === true,
        });

        const mappedItems: ReceiptItem[] = (data.items ?? [])
          .filter((item: any) => item.deletedAt == null)
          .map((item: any) => {
            const master = Array.isArray(item.masterRawMaterial)
              ? item.masterRawMaterial[0]
              : item.masterRawMaterial;

            const quantity = Number(item.quantity ?? 0);
            const nilaiSatuan = Number(item.nilaiSatuan ?? 0);

            const hargaTotal =
              item.Total != null
                ? Number(item.Total)
                : item.total != null
                  ? Number(item.total)
                  : quantity * nilaiSatuan;

            return {
              ...master,
              id: item.id,
              masterRawMaterialId: item.masterRawMaterialId,
              itemCode: master?.itemCode ?? master?.kodeBarang ?? item.itemCode ?? '',
              itemName: master?.itemName ?? master?.namaBarang ?? item.itemName ?? '',
              unit:
                master?.unit?.nama ??
                master?.unit?.name ??
                (typeof master?.unit === 'string' ? master.unit : '') ??
                item.unit ??
                '',
              Satuan: item.Satuan ?? item.satuan ?? master?.satuan ?? '',
              quantity,
              nilaiSatuan,
              hargaTotal,
              Total: hargaTotal,
              accountCode: item.accountCode ?? master?.accountCode ?? master?.account?.code ?? '',
              accountName: item.accountName ?? master?.accountName ?? master?.account?.name ?? '',
            } as ReceiptItem;
          });

        setDataSourceItems(mappedItems);
      } catch (error: any) {
        const message = error?.response?.data?.message;

        showNotification(
          'error',
          'Gagal',
          Array.isArray(message)
            ? message.join(', ')
            : message || error?.message || 'Gagal mendapatkan data penerimaan'
        );
      } finally {
        setLoadingData(false);
      }
    },
    [form]
  );

  useEffect(() => {
    if (!id) {
      setLoadingData(false);
      showNotification('error', 'Gagal', 'ID penerimaan tidak ditemukan');
      return;
    }

    void getDataById(id);
  }, [id, getDataById]);

  const handleDelete = (masterRawMaterialId: string) => {
    setDataSourceItems((previous) =>
      previous.filter((item) => item.masterRawMaterialId !== masterRawMaterialId)
    );
  };

  const handleEdit = (masterRawMaterialId: string) => {
    const item = dataSourceItems.find((row) => row.masterRawMaterialId === masterRawMaterialId);

    if (!item) {
      showNotification('error', 'Gagal', 'Item barang tidak ditemukan');
      return;
    }

    formItems.setFieldsValue({
      masterRawMaterialId: item.masterRawMaterialId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      unit: item.unit,
      Satuan: item.Satuan,
      accountCode: item.accountCode,
      accountName: item.accountName,
      quantity: item.quantity,
      hargaTotal: item.hargaTotal,
    });

    setOpenDrawer(true);
  };

  const handleSelectSupplier = (record: SupplierType) => {
    const row = record as any;

    form.setFieldsValue({
      namaRekanan: row.namaRekanan ?? row.name ?? '',
      idSupplier: row.id ?? '',
      noRekening: row.account?.code ?? '',
      accountCode: row.account?.id ?? '',
    });

    setModalSupplier(false);
  };

  const onFinish = async (values: any) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID penerimaan tidak ditemukan');
      return;
    }

    if (!canEdit) {
      showNotification(
        'error',
        'Tidak dapat diedit',
        'Penerimaan hanya dapat diedit ketika berstatus DRAFT atau REVERTED'
      );
      return;
    }

    if (dataSourceItems.length === 0) {
      showNotification('error', 'Validasi', 'Item penerimaan wajib diisi');
      return;
    }

    if (!values.idSupplier) {
      showNotification('error', 'Validasi', 'Supplier wajib dipilih');
      return;
    }

    try {
      setLoading(true);

      const picked = dataSourceItems.map((item) => {
        const quantity = Number(item.quantity);
        const hargaTotal = Number(item.hargaTotal);
        const nilaiSatuan = quantity > 0 ? hargaTotal / quantity : 0;

        if (
          !item.masterRawMaterialId ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(hargaTotal) ||
          hargaTotal < 0 ||
          !item.Satuan?.trim()
        ) {
          throw new Error(`Data barang ${item.itemName ?? ''} tidak valid`);
        }

        if (!item.accountCode?.trim() || !item.accountName?.trim()) {
          throw new Error(
            `Account Code dan Account Name barang ${item.itemName ?? ''} wajib tersedia`
          );
        }

        return {
          masterRawMaterialId: item.masterRawMaterialId,
          quantity,
          Satuan: item.Satuan,
          nilaiSatuan,
          accountCode: item.accountCode,
          accountName: item.accountName,
        };
      });

      const payload: UpdateBarangMentahPayload = {
        documentCode: values.documentCode,
        documentNo: values.documentNo,
        idSupplier: values.idSupplier,
        date: handleDate(values.date),
        faktur: values.faktur,
        noRekening: values.noRekening,
        pengadaanBarang: values.pengadaanBarang,
        simpanKeBarangJadi: values.simpanKeBarangJadi === true,
        items: picked,
      };

      await BarangMentahAxios.updateBarangMentah(id, payload);

      showNotification('success', 'Berhasil', 'Berhasil mengubah penerimaan barang mentah');

      setTimeout(() => {
        navigate('/raw-material-receipt');
      }, 1200);
    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;

      showNotification(
        'error',
        'Gagal',
        Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : responseMessage || error?.message || 'Gagal mengubah penerimaan barang mentah'
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: any[] = [
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
      render: (quantity: number) => globalHelpers.currencyFormatter(quantity),
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      key: 'Satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (_: any, record: ReceiptItem) => {
        const quantity = Number(record.quantity || 0);
        const hargaTotal = Number(record.hargaTotal || 0);
        const nilaiSatuan = quantity > 0 ? hargaTotal / quantity : 0;

        return `Rp${globalHelpers.currencyFormatter(nilaiSatuan)}`;
      },
    },
    {
      title: 'Total',
      dataIndex: 'hargaTotal',
      key: 'hargaTotal',
      align: 'center',
      render: (value: number) => `Rp${globalHelpers.currencyFormatter(value || 0)}`,
    },
    {
      title: 'Aksi',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 180,
      render: (_: any, record: ReceiptItem) => (
        <Space>
          <ButtonEditGroup onClick={() => handleEdit(record.masterRawMaterialId)} />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus item ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.masterRawMaterialId)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loadingData) {
    return (
      <Card>
        <Flex justify="center" align="center" style={{ minHeight: 300 }}>
          <Spin size="large" tip="Memuat data penerimaan..." />
        </Flex>
      </Card>
    );
  }

  return (
    <Card
      title={<TitleCardEdit title="Edit Penerimaan Barang Mentah" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      {!canEdit && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={`Dokumen berstatus ${dataReceipt?.status ?? 'tidak diketahui'} dan tidak dapat diedit.`}
          description="Dokumen harus berstatus DRAFT atau REVERTED untuk dapat diedit. Jika masih POSTED, lakukan revert terlebih dahulu."
        />
      )}

      <DrawerBarangMentah
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={setOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <ModalSupplier
        handleRowDoubleClick={handleSelectSupplier}
        open={modalSupplier}
        setOpen={setModalSupplier}
      />

      <Form
        layout="vertical"
        form={form}
        name="updateRawMaterialReceipt"
        initialValues={{ simpanKeBarangJadi: false }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Kode Dokumen"
              name="documentCode"
              rules={[
                {
                  required: true,
                  message: 'Masukkan kode dokumen',
                },
              ]}
            >
              <Input
                prefix={<TagChevron size={16} />}
                placeholder="Kode dokumen"
                disabled={!canEdit}
              />
            </Form.Item>

            <Form.Item label="Account Code" name="accountCode" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="No. Rekening"
              name="noRekening"
              rules={[
                {
                  required: true,
                  message: 'Masukkan nomor rekening',
                },
              ]}
            >
              <Input prefix={<CreditCard size={16} />} disabled={!canEdit} />
            </Form.Item>

            <Form.Item
              label="No. Bukti Penerimaan"
              name="documentNo"
              rules={[
                {
                  required: true,
                  message: 'Masukkan nomor bukti penerimaan',
                },
              ]}
            >
              <Input prefix={<FileText size={16} />} disabled={!canEdit} />
            </Form.Item>

            <Form.Item
              label="Pengadaan Barang"
              name="pengadaanBarang"
              rules={[
                {
                  required: true,
                  message: 'Pilih pengadaan barang',
                },
              ]}
            >
              <Select
                disabled={!canEdit}
                placeholder="Pilih Pengadaan Barang"
                options={[
                  { label: 'LOKAL', value: 'LOKAL' },
                  { label: 'DISTRIK', value: 'DISTRIK' },
                  { label: 'KANDIR', value: 'KANDIR' },
                  { label: 'SEINDUK', value: 'SEINDUK' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="ID Supplier"
              name="idSupplier"
              hidden
              rules={[
                {
                  required: true,
                  message: 'Pilih supplier',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Supplier"
              name="namaRekanan"
              rules={[
                {
                  required: true,
                  message: 'Pilih supplier',
                },
              ]}
            >
              <Input
                disabled
                suffix={
                  canEdit ? (
                    <Tooltip title="Pilih supplier">
                      <Button
                        type="text"
                        icon={<SearchOutlined />}
                        onClick={() => setModalSupplier(true)}
                      />
                    </Tooltip>
                  ) : null
                }
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Penerimaan"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Pilih tanggal penerimaan',
                },
              ]}
              getValueFromEvent={(date) => (date ? date.format('YYYY-MM-DD') : null)}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : undefined,
              })}
            >
              <DatePicker
                prefix={<Calendar />}
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                disabled={!canEdit}
              />
            </Form.Item>

            <Form.Item
              label="Faktur"
              name="faktur"
              rules={[
                {
                  required: true,
                  message: 'Masukkan faktur',
                },
              ]}
            >
              <Input prefix={<Receipt size={16} />} disabled={!canEdit} />
            </Form.Item>

            <Form.Item
              name="simpanKeBarangJadi"
              valuePropName="checked"
              style={{ marginBottom: 16 }}
            >
              <Checkbox disabled={!canEdit}>Simpan ke Barang Jadi</Checkbox>
            </Form.Item>

            <Form.Item label="Total Harga" name="subtotalAmount">
              <InputNumber
                disabled
                controls={false}
                style={{ width: '100%' }}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                value={totalKeseluruhan}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title="Item Penerimaan Barang" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {canEdit && (
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
                style={{ width: 230 }}
                onClick={() => {
                  formItems.resetFields();
                  setOpenDrawer(true);
                }}
              >
                Tambah Penerimaan Barang
              </Button>
            </div>
          )}

          <Table
            rowKey={(record: ReceiptItem) => record.id ?? record.masterRawMaterialId}
            columns={canEdit ? columns : columns.filter((column) => column.key !== 'action')}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
            bordered
            pagination={false}
            footer={() => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                }}
              >
                <span>Total Keseluruhan</span>
                <span>
                  Rp
                  {globalHelpers.currencyFormatter(totalKeseluruhan)}
                </span>
              </div>
            )}
          />
        </Card>

        <Flex gap="small" style={{ marginTop: 16 }}>
          <Buttonback loading={loading} />
          {canEdit && <ButtonEdit loading={loading} />}
        </Flex>
      </Form>
    </Card>
  );
}
