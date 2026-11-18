import {
  Calendar,
  CreditCard,
  FileText,
  Plus,
  Receipt,
  TagChevron,
  Warehouse,
} from '@phosphor-icons/react';
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
  Tooltip,
  Select,
  Space,
  Popconfirm,
  Checkbox,
} from 'antd';
import { useEffect, useState } from 'react';
import * as BarangMentahAxios from '@pages/gudang/barang-mentah/service/BarangMentahAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import DrawerBarangMentah from './DrawerBarangMentah/DrawerBarangMentah';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangMentahInterfaces from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import ModalSupplier from './ModalBarangMentah/ModalSupplier';
import * as SupplierInterfaces from '@pages/master/supplier/interface/SupplierInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';
import dayjs from 'dayjs';
import { handleDate } from '@/utils/func/func';

export default function BarangMentahAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formItems] = Form.useForm();
  const [openDrawer, seOpenDrawer] = useState<boolean>(false);
  const [modalSupplier, setModalSupplier] = useState<boolean>(false);
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

  const [dataSourceItems, setDataSourceItems] = useState<BarangMentahInterfaces.ItemsType[]>([]);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const picked = dataSourceItems.map(
        ({
          masterRawMaterialId,
          quantity,
          Satuan,
          hargaTotal,
          accountCode,
          accountName,
        }: BarangMentahInterfaces.ItemsType) => ({
          masterRawMaterialId,
          quantity,
          Satuan,
          nilaiSatuan: hargaTotal / quantity,
          accountCode,
          accountName,
        })
      );

      values = {
        ...values,
        date: handleDate(values.date),
        items: picked,
        simpanKeBarangJadi: form.getFieldValue('simpanKeBarangJadi') === true,
      };

      // const { namaRekanan, ...newValues } = values;
      const newValues = globalHelpers.omitProps(values, ['namaRekanan']);

      await BarangMentahAxios.posBarangMentah(newValues as any);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/raw-material-receipt');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e: any) {
      setLoading(false);

      const responseData = e?.response?.data;
      const message = responseData?.message;
      const unmatchedCodes = responseData?.unmatchedCodes;

      const errorMessage = Array.isArray(unmatchedCodes)
        ? `${Array.isArray(message) ? message.join(', ') : message} Kode bermasalah: ${unmatchedCodes.join(', ')}`
        : Array.isArray(message)
          ? message.join(', ')
          : message || 'Gagal Menambahkan Data';

      showNotification('error', 'Gagal', errorMessage);
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, BarangMentahAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, BarangMentahAxios.fetchDataCustomer, [
    customer.name,
  ]);

  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await BarangMentahAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    const filterData = dataSourceItems.filter((item) => item.masterRawMaterialId != id);
    setDataSourceItems(filterData);
  };

  const handleEdit = (id: string) => {
    const findOne = dataSourceItems.find((items) => items.masterRawMaterialId === id) as any;
    formItems.setFieldsValue({
      masterRawMaterialId: findOne?.masterRawMaterialId,
      itemCode: findOne?.itemCode,
      itemName: findOne?.itemName,
      unit: findOne?.unit,
      Satuan: findOne?.Satuan,
      accountCode: findOne?.accountCode,
      quantity: findOne?.quantity,
      hargaTotal: findOne?.hargaTotal,
      accountName: findOne?.accountName,
    });
    seOpenDrawer(true);
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
      dataIndex: 'Satuan',
      key: 'Satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record: any) => {
        return <span>Rp{globalHelpers.currencyFormatter(record.hargaTotal / quantity)}</span>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'hargaTotal',
      key: 'hargaTotal',
      align: 'center',
      render: (hargaTotal) => {
        return <span>Rp{globalHelpers.currencyFormatter(hargaTotal || 0)}</span>;
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

  const handleRowDoubleClick = (record: SupplierInterfaces.SupplierType) => {
    form.setFieldsValue({
      namaRekanan: record.namaRekanan,
      idSupplier: record.id,
      noRekening: record.account.code,
      accountCode: record.account.id,
    });
    setModalSupplier(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Barang Mentah" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <DrawerBarangMentah
        formItems={formItems}
        openDrawer={openDrawer}
        seOpenDrawer={seOpenDrawer}
        setDataSourceItems={setDataSourceItems}
      />

      <ModalSupplier
        handleRowDoubleClick={handleRowDoubleClick}
        open={modalSupplier}
        setOpen={setModalSupplier}
      />

      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{
          remember: true,
          simpanKeBarangJadi: false,
        }}
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
              label="accountCode"
              name="accountCode"
              style={{ display: 'none' }}
              rules={[{ required: true, message: 'Masukan accountCode!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<CreditCard size={16} />}
                placeholder="accountCode"
              />
            </Form.Item>

            <Form.Item
              label="No. Rekening"
              name="noRekening"
              rules={[{ required: true, message: 'Masukan No. Rekening!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<CreditCard size={16} />}
                placeholder="No. Rekening"
              />
            </Form.Item>

            <Form.Item
              label="No. Bukti Penerimaan"
              name="documentNo"
              rules={[{ required: true, message: 'Masukan no dokumen!' }]}
            >
              <Input
                // disabled
                style={{ width: '100%' }}
                prefix={<FileText size={16} />}
                placeholder="No Dokumen"
              />
            </Form.Item>

            <Form.Item
              label="Pengadaan Barang"
              name="pengadaanBarang"
              rules={[{ required: true, message: 'Masukan Pengadaan Barang!' }]}
            >
              <Select
                prefix={<Warehouse />}
                showSearch
                loading={unit.loading}
                placeholder="Pilih Pengadaan Barang"
                optionFilterProp="label"
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
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Form.Item
                label="supplier"
                name="idSupplier"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: true, message: 'Masukan supplier!' }]}
              >
                <Input
                  // disabled
                  style={{ width: '100%', flex: 1 }}
                  prefix={<Receipt size={16} />}
                  placeholder="supplier"
                />
              </Form.Item>

              <Form.Item
                label="supplier"
                name="namaRekanan"
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Masukan supplier!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%', flex: 1 }}
                  prefix={<Receipt size={16} />}
                  placeholder="supplier"
                />
              </Form.Item>

              <Tooltip title="search">
                <Button
                  type="primary"
                  onClick={() => setModalSupplier(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>
            <Form.Item
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
                format={'YYYY-MM-DD'}
              />
            </Form.Item>

            <Form.Item
              label="Faktur"
              name="faktur"
              rules={[{ required: true, message: 'Masukan faktur!' }]}
            >
              <Input
                // disabled
                style={{ width: '100%' }}
                prefix={<Receipt size={16} />}
                placeholder="Faktur"
              />
            </Form.Item>

            <Form.Item
              shouldUpdate={(prev, curr) => prev.simpanKeBarangJadi !== curr.simpanKeBarangJadi}
              style={{ marginBottom: 0 }}
            >
              {({ getFieldValue, setFieldsValue }) => {
                const checked = getFieldValue('simpanKeBarangJadi');

                return (
                  <div
                    onClick={() =>
                      setFieldsValue({
                        simpanKeBarangJadi: !checked,
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '6px 8px',
                      border: `1px solid ${checked ? '#52c41a' : '#d9d9d9'}`,
                      borderRadius: 10,
                      background: checked ? '#f6ffed' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        background: checked ? '#d9f7be' : '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Warehouse size={23} color={checked ? '#389e0d' : '#8c8c8c'} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#262626' }}>Simpan Ke Barang Jadi</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 3 }}>
                        Tandai jika barang akan disimpan ke barang jadi
                      </div>
                    </div>

                    <Checkbox
                      checked={checked}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setFieldsValue({
                          simpanKeBarangJadi: e.target.checked,
                        })
                      }
                    />
                  </div>
                );
              }}
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
