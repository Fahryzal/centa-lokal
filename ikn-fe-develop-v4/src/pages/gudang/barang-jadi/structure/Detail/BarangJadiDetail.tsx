import { Calendar, FilePdf, TagChevron, Unite } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, Select, DatePicker, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as generateForms from '@/utils/generatePdf/generateForms';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import { showNotification } from '@/contexts/services/notificationService';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id'); // Set default locale ke bahasa Indonesia

export default function BarangJadiDetail() {
  // const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
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

  const [dataSourceItems, setDataSourceItems] = useState<BarangJadiInterfaces.ItemsType[]>([]);
  const [dataAll, seDataAll] = useState(null);

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, BarangJadiAxios.fetchDataCustomer, [
    customer.name,
  ]);

  useEffect(() => {
    getDataCode();
    getDataById();
  }, []);

  const getDataById = async () => {
    try {
      if (id) {
        const data: BarangJadiInterfaces.DataType = await BarangJadiAxios.fetchDataBarangById(id);

        form.setFieldsValue({
          documentCode: data.documentCode,
          documentNumber: data.documentNumber,
          unitId: data.unit.id,
          date: dayjs(globalHelpers.dateFormat(data.date), 'YYYY-MM-DD'),
        });
        setDataSourceItems(data.items);
        seDataAll(data as any);
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Mendapatkan Data');
    }
  };

  const getDataCode = async () => {
    setLoading(true);
    const data = await BarangJadiAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const columns: TableColumnsType<BarangJadiInterfaces.DataType> = [
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

    // {
    //   title: 'Nilai Satuan',
    //   dataIndex: 'quantity',
    //   key: 'nilaiSatuan',
    //   align: 'center',
    //   render: (nilaiSatuan) => {
    //     return <span>Rp {globalHelpers.currencyFormatter(nilaiSatuan)}</span>;
    //   },
    // },

    {
      title: 'Jumlah Total',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => {
        console.log('record', record);
        return <span>{globalHelpers.currencyFormatter(quantity)}</span>;
      },
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'nama'],
      key: 'unit',
      align: 'center',
    },
  ];

  return (
    <Card
      title={<TitleCardDetail title="Detail Penerimaan Barang Jadi" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={
        <ButtonFile
          color="danger"
          text="Cetak Au-53"
          icon={<FilePdf />}
          onClick={() => generateForms.generateAU53Produck(dataAll)}
        />
      }
    >
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
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Kode Dokumen"
              name="documentCode"
              rules={[{ required: true, message: 'Masukan nilai Kode Dokumen!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<TagChevron size={16} />}
                placeholder="Nilai Kode Dokumen"
              />
            </Form.Item>

            <Form.Item
              label="No. Dokumen"
              name="documentNumber"
              rules={[{ required: true, message: 'Masukan no dokumen!' }]}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<FilePdf size={16} />}
                placeholder="No Dokumen"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Unit"
              name="unitId"
              rules={[{ required: true, message: 'Masukan unit!' }]}
            >
              <Select
                disabled
                prefix={<Unite />}
                showSearch
                loading={unit.loading}
                placeholder="Pilih unit"
                optionFilterProp="label"
                onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
              />
            </Form.Item>

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
                disabled
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
          <Table<BarangJadiInterfaces.DataType>
            columns={columns}
            dataSource={
              dataSourceItems.map((item) => ({
                ...item.finishedGood,
                quantity: item.quantity,
                unit: item.unit,
              })) as any
            }
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
