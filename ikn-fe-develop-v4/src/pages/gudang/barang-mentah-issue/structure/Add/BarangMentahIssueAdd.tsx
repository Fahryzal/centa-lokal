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
import { useState } from 'react';
import * as BarangMentahIssueAxios from '@pages/gudang/barang-mentah-issue/service/BarangMentahIssueAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
// import * as globalHooks from "@/hooks";
import type { TableColumnsType } from 'antd';
import DrawerBarangJadi from './DrawerBarangMentahIssue/DrawerBarangMentahIssue';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangMentahInterfaces from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import { DeleteOutlined } from '@ant-design/icons';
import { handleDate } from '@/utils/func/func';

export default function BarangMentahIssueAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [dataSourceItems, setDataSourceItems] = useState<BarangMentahInterfaces.ItemsType[]>([]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const picked = dataSourceItems.map(
        ({
          masterRawMaterialId,
          quantity,
          Satuan,
          nilaiSatuan,
          accountCode,
          accountName,
        }: BarangMentahInterfaces.ItemsType) => ({
          masterRawMaterialId,
          quantity: Number(String(quantity).replace(',', '.')),
          Satuan,
          nilaiSatuan,
          accountCode,
          accountName,
        })
      );

      values = {
        ...values,
        date: handleDate(values.date),
        items: picked,
      };
      await BarangMentahIssueAxios.posBarangMentahIssue(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/raw-material-issue');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
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
      render: (quantity) => {
        return <span>{globalHelpers.currencyFormatter(quantity)}</span>;
      },
    },
    {
      title: 'Satuan',
      dataIndex: 'Satuan',
      key: 'satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'nilaiSatuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (nilaiSatuan) => {
        return <span>Rp{globalHelpers.currencyFormatter(nilaiSatuan)}</span>;
      },
    },
    {
      title: 'Harga Dikeluarkan',
      dataIndex: 'nilaiSatuan',
      key: 'nilaiSatuan',
      align: 'center',
      render: (nilaiSatuan, record: any) => {
        return <span>Rp{globalHelpers.currencyFormatter(nilaiSatuan * record.quantity)}</span>;
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
            <ButtonEditGroup onClick={() => handleEdit(record.masterRawMaterialId)} />
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus data ini?"
              okText="Ya"
              cancelText="Batal"
              onConfirm={() => handleDelete(record.masterRawMaterialId)} // Fungsi delete
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
    const filterData = dataSourceItems.filter((item) => item.masterRawMaterialId != id);
    setDataSourceItems(filterData);
  };

  const handleEdit = (id: string) => {
    const findOne = dataSourceItems.find((items) => items.masterRawMaterialId === id) as any;
    formItems.setFieldsValue({
      masterRawMaterialId: findOne.masterRawMaterialId,
      itemCode: findOne.itemCode,
      itemName: findOne.itemName,
      unit: findOne.unit,
      Satuan: findOne.Satuan,
      nilaiSatuan: findOne?.nilaiSatuan || 0,
      accountCode: findOne.accountCode,
      stok: findOne?.stok || 0,
      quantity: findOne.quantity,
      harga: findOne.harga,
      accountName: findOne?.accountName || '',
    });
    seOpenDrawer(true);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Barang Mentah Keluar" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerBarangJadi
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <Form
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
            <Form.Item
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

            <Form.Item
              label="No. Dokumen"
              name="documentNo"
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
            <Form.Item
              label="Keterangan"
              name="keterangan"
              rules={[{ required: true, message: 'Masukan keterangan!' }]}
            >
              <Input
                // disabled
                style={{ width: '100%' }}
                prefix={<Note size={16} />}
                placeholder="keterangan"
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Keluar"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Keluar!' }]}
            >
              <DatePicker
                prefix={<Calendar />}
                style={{ width: '100%' }}
                placeholder="Tanggal keluar"
              />
            </Form.Item>

            <Form.Item
              label="Di Pergunakan"
              name="diPergunakan"
              rules={[{ required: true, message: 'Masukan dipergunakan!' }]}
            >
              <Select
                style={{
                  width: '100%',
                }}
                prefix={<Receipt />}
                showSearch
                placeholder="Pilih"
                optionFilterProp="label"
                options={[
                  { label: 'Kebun Sendiri', value: 'kebun_sendiri' },
                  { label: 'Unit Seinduk', value: 'unit_seinduk' },
                  { label: 'Pihak Ketiga', value: 'pihak_ketiga' },
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
              onClick={() => seOpenDrawer(true)}
              style={{ width: 230 }}
            >
              Tambah Barang Keluar
            </Button>
          </div>
          <Table<BarangMentahInterfaces.ItemsType>
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
