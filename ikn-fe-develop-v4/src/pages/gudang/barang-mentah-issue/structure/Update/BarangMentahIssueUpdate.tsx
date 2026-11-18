import { Calendar, FilePdf, Note, Plus, Receipt, TagChevron } from '@phosphor-icons/react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Flex,
  DatePicker,
  Input,
  Table,
  Select,
  Space,
  Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import * as BarangMentahIssueAxios from '@pages/gudang/barang-mentah-issue/service/BarangMentahIssueAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType } from 'antd';
import DrawerBarangMentahIssue from './DrawerBarangMentahIssue/DrawerBarangMentahIssue';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangMentahInterfaces from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { DeleteOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

export default function BarangMentahIssueUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();
  const [formItems] = Form.useForm();

  const [openDrawer, seOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataSourceItems, setDataSourceItems] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  const getData = async (issueId: string) => {
    try {
      setLoading(true);

      const result = await BarangMentahIssueAxios.fetchDataBarangMentahIssueById(issueId);

      if (!result) {
        showNotification('error', 'Gagal', 'Data pengeluaran barang mentah tidak ditemukan');
        return;
      }

      form.setFieldsValue({
        documentCode: result.documentCode,
        documentNo: result.documentNo,
        keterangan: result.keterangan,
        date: result.date ? dayjs(result.date) : null,
        diPergunakan: result.diPergunakan,
      });

      const items = (result.items ?? []).map((item: any) => {
        const master = item.masterRawMaterial ?? {};

        return {
          ...master,
          ...item,
          id: item.id,
          masterRawMaterialId: item.masterRawMaterialId ?? master.id,
          itemCode: master.itemCode ?? item.itemCode ?? '',
          itemName: master.itemName ?? item.itemName ?? '',
          unit: master.unit?.nama ?? item.unit?.nama ?? item.unit ?? '',
          Satuan: item.Satuan ?? item.satuan ?? master.satuan ?? '',
          quantity: Number(item.quantity ?? 0),
          nilaiSatuan: Number(item.nilaiSatuan ?? 0),
          accountCode: item.accountCode ?? master.accountCode ?? master.account?.code ?? '',
          accountName: item.accountName ?? master.accountName ?? master.account?.name ?? '',
          harga: Number(item.quantity ?? 0) * Number(item.nilaiSatuan ?? 0),
        };
      });

      setDataSourceItems(items);
    } catch {
      showNotification('error', 'Gagal', 'Gagal mengambil data pengeluaran barang mentah');
    } finally {
      setLoading(false);
    }
  };

  const toDecimal = (value: unknown): number => {
    return Number(String(value ?? '').replace(',', '.'));
  };

  const onFinish = async (values: any) => {
    if (!id) {
      showNotification('error', 'Gagal', 'ID pengeluaran barang mentah tidak ditemukan');
      return;
    }

    if (dataSourceItems.length === 0) {
      showNotification('warning', 'Peringatan', 'Item pengeluaran wajib diisi');
      return;
    }

    const invalidItem = dataSourceItems.some((item: any) => {
      const quantity = toDecimal(item.quantity);
      const nilaiSatuan = toDecimal(item.nilaiSatuan);

      return (
        !item.masterRawMaterialId ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(nilaiSatuan) ||
        nilaiSatuan < 0 ||
        !item.accountCode
      );
    });

    if (invalidItem) {
      showNotification(
        'warning',
        'Peringatan',
        'Pastikan setiap item memiliki barang, jumlah, nilai satuan, dan akun yang valid'
      );
      return;
    }

    if (!values.date || !values.date.isValid?.()) {
      showNotification('warning', 'Peringatan', 'Tanggal pengeluaran tidak valid');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        documentCode: values.documentCode,
        documentNo: values.documentNo,
        date: values.date.toDate(),
        keterangan: values.keterangan,
        diPergunakan: values.diPergunakan,
        items: dataSourceItems.map((item: any) => {
          const quantity = toDecimal(item.quantity);
          const nilaiSatuan = toDecimal(item.nilaiSatuan);

          return {
            ...(item.id ? { id: item.id } : {}),
            masterRawMaterialId: item.masterRawMaterialId,
            quantity,
            Satuan: item.Satuan,
            nilaiSatuan,
            accountCode: item.accountCode,
            accountName: item.accountName,
          };
        }),
      };

      // Hanya menyimpan penyesuaian.
      // Jangan panggil Posting dari halaman ini.
      await BarangMentahIssueAxios.updateBarangMentahIssue(id, payload);

      showNotification(
        'success',
        'Berhasil',
        'Penyesuaian pengeluaran berhasil disimpan. Silakan lakukan Posting melalui tombol Posting.'
      );

      navigate('/raw-material-issue');
    } catch (error: any) {
      showNotification(
        'error',
        'Gagal',
        error?.response?.data?.message ?? 'Gagal menyimpan penyesuaian pengeluaran barang mentah'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: any) => {
    setDataSourceItems((previous) =>
      previous.filter((row: any) => {
        if (item.id) {
          return row.id !== item.id;
        }

        return row.masterRawMaterialId !== item.masterRawMaterialId;
      })
    );
  };

  const handleEdit = async (itemId: string) => {
    const item = dataSourceItems.find(
      (row: any) => row.id === itemId || row.masterRawMaterialId === itemId
    );

    if (!item) return;

    try {
      const stockData = await BarangMentahIssueAxios.fetchfindOneStockSummaryById(
        item.masterRawMaterialId
      );

      if (!stockData) {
        showNotification('warning', 'Peringatan', 'Stok barang tidak ditemukan');
        return;
      }

      formItems.setFieldsValue({
        id: item.id,
        masterRawMaterialId: item.masterRawMaterialId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        unit: item.unit,
        Satuan: item.Satuan,
        nilaiSatuan: item.nilaiSatuan,
        accountCode: item.accountCode,
        accountName: item.accountName,
        stok: Number(stockData.stock ?? 0),
        quantity: item.quantity,
        harga: item.harga,
      });

      seOpenDrawer(true);
    } catch (error) {
      showNotification('error', 'Gagal', 'Gagal mengambil stok barang');
    }
  };

  const columns: TableColumnsType<BarangMentahInterfaces.ItemsType> = [
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
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => globalHelpers.currencyFormatter(quantity ?? 0),
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      key: 'Satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'nilaiSatuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (value) => `Rp${globalHelpers.currencyFormatter(value ?? 0)}`,
    },
    {
      title: 'Harga Dikeluarkan',
      key: 'total',
      align: 'center',
      render: (_value, record: any) =>
        `Rp${globalHelpers.currencyFormatter(
          toDecimal(record.quantity) * toDecimal(record.nilaiSatuan)
        )}`,
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_value, record: any) => (
        <Space>
          <ButtonEditGroup onClick={() => handleEdit(record.id || record.masterRawMaterialId)} />

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus item ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalKeseluruhan = dataSourceItems.reduce(
    (total: number, item: any) => total + toDecimal(item.quantity) * toDecimal(item.nilaiSatuan),
    0
  );

  return (
    <Card
      title={<TitleCardEdit title="Penyesuaian Barang Mentah Keluar" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerBarangMentahIssue
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <Form
        layout="vertical"
        form={form}
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
              rules={[
                {
                  required: true,
                  message: 'Masukkan kode dokumen!',
                },
              ]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Kode Dokumen" />
            </Form.Item>

            <Form.Item
              label="No. Dokumen"
              name="documentNo"
              rules={[
                {
                  required: true,
                  message: 'Masukkan nomor dokumen!',
                },
              ]}
            >
              <Input prefix={<FilePdf size={16} />} placeholder="No. Dokumen" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Keterangan"
              name="keterangan"
              rules={[
                {
                  required: true,
                  message: 'Masukkan keterangan!',
                },
              ]}
            >
              <Input prefix={<Note size={16} />} placeholder="Keterangan" />
            </Form.Item>

            <Form.Item
              label="Tanggal Keluar"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Masukkan tanggal keluar!',
                },
              ]}
            >
              <DatePicker prefix={<Calendar />} style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label="Di Pergunakan"
              name="diPergunakan"
              rules={[
                {
                  required: true,
                  message: 'Pilih penggunaan barang!',
                },
              ]}
            >
              <Select
                prefix={<Receipt />}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    label: 'Kebun Sendiri',
                    value: 'kebun_sendiri',
                  },
                  {
                    label: 'Unit Seinduk',
                    value: 'unit_seinduk',
                  },
                  {
                    label: 'Pihak Ketiga',
                    value: 'pihak_ketiga',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title="Item Barang Keluar" />}
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
              onClick={() => {
                formItems.resetFields();
                seOpenDrawer(true);
              }}
              style={{ width: 230 }}
            >
              Tambah Barang Keluar
            </Button>
          </div>

          <Table<BarangMentahInterfaces.ItemsType>
            rowKey={(record: any) => record.id || record.masterRawMaterialId}
            columns={columns}
            dataSource={dataSourceItems}
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={false}
            footer={() => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontWeight: 'bold',
                }}
              >
                Total: Rp
                {globalHelpers.currencyFormatter(totalKeseluruhan)}
              </div>
            )}
          />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonEdit loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
