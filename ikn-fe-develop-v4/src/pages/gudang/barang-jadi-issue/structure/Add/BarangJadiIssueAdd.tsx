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
} from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

import * as BarangJadiIssueAxios from '@pages/gudang/barang-jadi-issue/service/BarangJadiIssueAxios';
import * as FinishedGoodsIssueInterfaces from '@/pages/gudang/barang-jadi-issue/interface/BarangJadiIssueInterfaces';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';

import DrawerBarangJadiIssue from './DrawerBarangJadiIssue/DrawerBarangJadiIssue';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { handleDate } from '@/utils/func/func';

interface IssueFormItem {
  finishedGoodId: string;
  kodeBarang: string;
  namaBarang: string;
  kategori?: string;
  quantity: number;
  Satuan: string;
}

export default function BarangJadiIssueAdd() {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [formItems] = Form.useForm();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<IssueFormItem[]>([]);

  // Mengambil daftar unit untuk header dokumen.
  globalHooks.useFetchOptions(unit, setUnit, BarangJadiIssueAxios.fetchDataUnit, [unit.nama]);

  const onFinish = async (values: any) => {
    if (dataSourceItems.length === 0) {
      showNotification('error', 'Validasi', 'Tambahkan minimal satu barang yang akan dikeluarkan.');
      return;
    }

    try {
      setLoading(true);

      const payload: FinishedGoodsIssueInterfaces.FinishedGoodsIssuePayload = {
        documentCode: values.documentCode,
        documentNumber: values.documentNumber,
        unitId: values.unitId,
        date: handleDate(values.date),
        diPergunakan: values.diPergunakan || '',
        keterangan: values.keterangan || '',
        items: dataSourceItems.map((item) => ({
          finishedGoodId: item.finishedGoodId,
          quantity: item.quantity,
          Satuan: item.Satuan,
        })),
      };

      await BarangJadiIssueAxios.createFinishedGoodsIssue(payload);

      showNotification('success', 'Berhasil', 'Berhasil menambahkan pengeluaran barang jadi.');

      form.resetFields();
      setDataSourceItems([]);

      setTimeout(() => {
        navigate('/finished-goods-issue');
      }, 1000);
    } catch (error) {
      showNotification('error', 'Gagal', 'Gagal menambahkan pengeluaran barang jadi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDataSourceItems((prev) => prev.filter((item) => item.finishedGoodId !== id));
  };

  const handleEdit = (id: string) => {
    const selectedItem = dataSourceItems.find((item) => item.finishedGoodId === id);

    if (!selectedItem) return;

    formItems.setFieldsValue({
      ...selectedItem,
    });

    setOpenDrawer(true);
  };

  const columns = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      key: 'kodeBarang',
      align: 'center' as const,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      key: 'namaBarang',
      align: 'center' as const,
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
      align: 'center' as const,
    },
    {
      title: 'Jumlah Dikeluarkan',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (quantity: number) => <span>{globalHelpers.currencyFormatter(quantity)}</span>,
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      key: 'Satuan',
      align: 'center' as const,
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: IssueFormItem) => (
        <Space>
          <ButtonEditGroup onClick={() => handleEdit(record.finishedGoodId)} />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus barang ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.finishedGoodId)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<TitleCardAdd title="Tambah Pengeluaran Barang Jadi" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerBarangJadiIssue
        formItems={formItems}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <Form
        layout="vertical"
        form={form}
        name="finishedGoodsIssue"
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
              <Input prefix={<TagChevron size={16} />} placeholder="Kode Dokumen" />
            </Form.Item>

            <Form.Item
              label="Nomor Dokumen"
              name="documentNumber"
              rules={[{ required: true, message: 'Masukkan nomor dokumen!' }]}
            >
              <Input prefix={<FilePdf size={16} />} placeholder="Nomor Dokumen" />
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
                onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
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
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Dipergunakan Untuk" name="diPergunakan">
              <Input placeholder="Tujuan penggunaan barang" />
            </Form.Item>

            <Form.Item label="Keterangan" name="keterangan">
              <Input.TextArea rows={3} placeholder="Masukkan keterangan" />
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
                onClick={() => {
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
          <Table
            rowKey="finishedGoodId"
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
