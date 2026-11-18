import { Calendar, FilePdf, TagChevron } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, DatePicker, Input, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import { useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as BarangMentahInterfaces from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import * as BarangMentahIssueAxios from '@pages/gudang/barang-mentah-issue/service/BarangMentahIssueAxios';
import { showNotification } from '@/contexts/services/notificationService';
import dayjs from 'dayjs';

interface DataType {
  key: string;
  documentCode: string;
  documentNumber: string;
  date: Date;
  unitCode: string;
}

export default function BarangMentahIssueDetail() {
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

  const [dataSourceItems, setDataSourceItems] = useState<BarangMentahInterfaces.ItemsType[]>([]);

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
        const data: BarangMentahInterfaces.DataType =
          await BarangMentahIssueAxios.fetchDataBarangMentahIssueById(id);
        form.setFieldsValue({
          documentCode: data.documentCode,
          documentNo: data.documentNo,
          // unit: data.unit,
          supplier: data.supplier,
          date: globalHelpers.dateFormat(data.date),
        });
        setDataSourceItems(data.items);
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

  const columns: TableColumnsType<DataType> = [
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
      dataIndex: 'satuan',
      key: 'satuan',
      align: 'center',
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'nilaiSatuan',
      key: 'satuan',
      align: 'center',
      render: (nilaiSatuan) => {
        return <span>Rp{globalHelpers.currencyFormatter(nilaiSatuan)}</span>;
      },
    },
    {
      title: 'Harga Total Dikeluarkan',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (total) => {
        return <span>Rp{globalHelpers.currencyFormatter(total)}</span>;
      },
    },
  ];

  const data = dataSourceItems.map((item) => ({
    ...item.masterRawMaterial,
    quantity: item.quantity,
    nilaiSatuan: item.nilaiSatuan,
    total: item.Total,
  }));

  const totalKeseluruhan = useMemo(() => {
    return data.reduce((acc, item) => acc + item.total, 0);
  }, [data]);

  return (
    <Card
      title={<TitleCardDetail title="Detail Barang Mentah Keluar" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
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
              name="documentNo"
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
              label="Tanggal Keluar"
              name="date"
              rules={[{ required: true, message: 'Masukan Tanggal Keluar!' }]}
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
                placeholder="Tanggal Keluar"
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
          </Col>
        </Row>
        <Card
          title={<TitleCardItems title="Item Keluar Barang Mentah" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<DataType>
            columns={columns}
            dataSource={
              dataSourceItems.map((item: any) => ({
                ...item.masterRawMaterial,
                quantity: item.quantity,
                nilaiSatuan: item.nilaiSatuan,
                total: item.Total,
                unit: item?.masterRawMaterial?.unit?.nama || '-',
              })) as any
            }
            scroll={{ x: 'max-content' }}
            footer={() => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    textAlign: 'center',
                    width: '20%',
                    // background: 'red',
                    alignSelf: 'flex-start',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    textAlign: 'center',
                    width: '20%',
                    fontWeight: 'bold',
                    // background: 'blue'
                  }}
                >
                  Rp
                  {
                    <Tooltip title={globalHelpers.terbilangRupiah(totalKeseluruhan)}>
                      {globalHelpers.currencyFormatter(totalKeseluruhan)}
                    </Tooltip>
                  }
                </span>
              </div>
            )}
          />{' '}
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          {/* <ButtonAdd loading={loading} /> */}
        </Flex>
      </Form>
    </Card>
  );
}
