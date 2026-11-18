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
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerBarangJadi from './DrawerBarangJadi/DrawerBarangJadi';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { handleDate } from '@/utils/func/func';

export default function BarangJadiAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm<BarangJadiInterfaces.PayloadBarangJadiType>();
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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

  const [dataSourceItems, setDataSourceItems] = useState<BarangJadiInterfaces.BarangJadiType[]>([]);

  const onFinish = async (values: BarangJadiInterfaces.PayloadBarangJadiType) => {
    try {
      setLoading(true);
      const picked = dataSourceItems.map(
        ({
          finishedGoodId,
          quantity,
          satuan,
          nilaiSatuan,
          spesifikasi,
          // unitId,
          namaBarang,
          kodeBarang,
          kategori,
          unit,
        }: BarangJadiInterfaces.BarangJadiType) => ({
          finishedGoodId,
          quantity,
          satuan,
          nilaiSatuan,
          spesifikasi,
          namaBarang,
          kodeBarang,
          kategori,
          unitId: unit?.split('$')[0] || '-',
        })
      );

      values = {
        ...values,
        date: handleDate(values.date as any),
        items: picked,
      };
      await BarangJadiAxios.posBarangJadi(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/finished-goods');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, BarangJadiAxios.fetchDataCustomer, [
    customer.name,
  ]);

  const columns: TableColumnsType<BarangJadiInterfaces.BarangJadiType> = [
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
      render: (quantity) => {
        return <span>{globalHelpers.currencyFormatter(quantity)}</span>;
      },
    },
    {
      title: 'Nilai Satuan',
      dataIndex: 'nilaiSatuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (nilaiSatuan) => {
        return <span>{globalHelpers.currencyFormatter(nilaiSatuan)}</span>;
      },
    },

    {
      title: 'Jumlah Total',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.nilaiSatuan * quantity)}</span>;
      },
    },

    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (unit) => unit.split('$')[1],
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: BarangJadiInterfaces.BarangJadiType) => {
        return (
          <Space>
            <ButtonEditGroup onClick={() => handleEdit(record.finishedGoodId)} />
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
              onConfirm={() => handleDelete(record.finishedGoodId)} // Fungsi delete
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

  const handleDelete = (id: string) => {
    const filterData = dataSourceItems.filter((item) => item.finishedGoodId != id);
    setDataSourceItems(filterData);
  };

  const handleEdit = (id: string) => {
    const findOne = dataSourceItems.find((items) => items.finishedGoodId === id) as any;
    formItems.setFieldsValue({
      finishedGoodId: findOne.finishedGoodId,
      kodeBarang: findOne.kodeBarang,
      namaBarang: findOne.namaBarang,
      kategori: findOne.kategori,
      satuan: findOne.satuan,
      nilaiSatuan: findOne.nilaiSatuan,
      quantity: findOne.quantity,
      spesifikasi: findOne.spesifikasi,
      totalBerat: findOne.totalBerat,
      unit: findOne.unit,
    });
    seOpenDrawer(true);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Barang Jadi" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerBarangJadi
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />
      <Form<BarangJadiInterfaces.PayloadBarangJadiType>
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item<BarangJadiInterfaces.PayloadBarangJadiType>
              label="Kode Dokumen"
              name="documentCode"
              rules={[{ required: true, message: 'Masukan nilai Kode Dokumen!' }]}
            >
              <Input
                // disabled
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nilai Kode Dokumen"
              />
            </Form.Item>

            <Form.Item<BarangJadiInterfaces.PayloadBarangJadiType>
              label="No. Dokumen"
              name="documentNumber"
              rules={[{ required: true, message: 'Masukan no dokumen!' }]}
            >
              <Input
                // disabled
                style={{ width: '100%' }}
                prefix={<FilePdf size={16} />}
                placeholder="No Dokumen"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<BarangJadiInterfaces.PayloadBarangJadiType>
              label="Unit"
              name="unitId"
              rules={[{ required: true, message: 'Masukan unit kode!' }]}
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

            <Form.Item<BarangJadiInterfaces.PayloadBarangJadiType>
              label="Tanggal Penerimaan"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Penerimaan!' }]}
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
                prefix={<Calendar />}
                style={{ width: '100%' }}
                placeholder="Tanggal Penerimaan"
                format="YYYY-MM-DD"
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
              onClick={() => seOpenDrawer(true)}
              style={{ width: 230 }}
            >
              Tambah Penerimaan Barang
            </Button>
          </div>
          <Table<BarangJadiInterfaces.BarangJadiType>
            columns={columns}
            dataSource={dataSourceItems as any}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
