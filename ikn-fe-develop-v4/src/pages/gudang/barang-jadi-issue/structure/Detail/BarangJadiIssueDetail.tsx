import { Calendar, FilePdf, TagChevron, User } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, Select, DatePicker, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import dayjs from 'dayjs';

import * as BarangJadiIssueAxios from '@pages/gudang/barang-jadi-issue/service/BarangJadiIssueAxios';
import * as FinishedGoodsIssueInterfaces from '@/pages/gudang/barang-jadi-issue/interface/BarangJadiIssueInterfaces';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';

import type { TableColumnsType } from 'antd';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import { showNotification } from '@/contexts/services/notificationService';

export default function BarangJadiIssueDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [dataSourceItems, setDataSourceItems] = useState<
    FinishedGoodsIssueInterfaces.FinishedGoodsIssueItem[]
  >([]);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  // Mengambil pilihan unit.
  globalHooks.useFetchOptions(unit, setUnit, BarangJadiIssueAxios.fetchDataUnit, [unit.nama]);

  // Mengambil detail pengeluaran barang jadi berdasarkan ID.
  useEffect(() => {
    const getDataById = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data: FinishedGoodsIssueInterfaces.FinishedGoodsIssueData =
          await BarangJadiIssueAxios.fetchDataFinishedGoodsIssueById(id);

        form.setFieldsValue({
          documentCode: data.documentCode,
          documentNumber: data.documentNumber,
          unitId: data.unitId,
          date: data.date ? dayjs(data.date) : undefined,
          diPergunakan: data.diPergunakan ?? '',
          keterangan: data.keterangan ?? '',
        });

        setDataSourceItems(data.ProductionIssueItem ?? []);
      } catch (error) {
        showNotification('error', 'Gagal', 'Gagal mendapatkan detail pengeluaran barang jadi.');
      } finally {
        setLoading(false);
      }
    };

    getDataById();
  }, [id, form]);

  // Kolom tabel item pengeluaran.
  const columns: TableColumnsType<FinishedGoodsIssueInterfaces.FinishedGoodsIssueItem> = [
    {
      title: 'Kode Barang',
      key: 'kodeBarang',
      align: 'center',
      render: (_, record) => record.finishedGood?.kodeBarang ?? '-',
    },
    {
      title: 'Nama Barang',
      key: 'namaBarang',
      align: 'center',
      render: (_, record) => record.finishedGood?.namaBarang ?? '-',
    },
    {
      title: 'Kategori',
      key: 'kategori',
      align: 'center',
      render: (_, record) => record.finishedGood?.kategori ?? '-',
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
  ];

  return (
    <Card
      title={<TitleCardDetail title="Detail Pengeluaran Barang Jadi" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form
        layout="vertical"
        form={form}
        name="finishedGoodsIssueDetail"
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Kode Dokumen" name="documentCode">
              <Input disabled prefix={<TagChevron size={16} />} placeholder="Kode Dokumen" />
            </Form.Item>

            <Form.Item label="Nomor Dokumen" name="documentNumber">
              <Input disabled prefix={<FilePdf size={16} />} placeholder="Nomor Dokumen" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Unit" name="unitId">
              <Select
                disabled
                prefix={<User />}
                placeholder="Unit"
                loading={unit.loading}
                options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
              />
            </Form.Item>

            <Form.Item label="Tanggal Pengeluaran" name="date">
              <DatePicker
                disabled
                prefix={<Calendar />}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder="Tanggal Pengeluaran"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Dipergunakan Untuk" name="diPergunakan">
              <Input disabled placeholder="Tujuan penggunaan barang" />
            </Form.Item>

            <Form.Item label="Keterangan" name="keterangan">
              <Input.TextArea disabled rows={3} placeholder="Keterangan" />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title={<TitleCardItems title="Item Pengeluaran Barang" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<FinishedGoodsIssueInterfaces.FinishedGoodsIssueItem>
            rowKey="id"
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
            pagination={false}
            loading={loading}
            locale={{
              emptyText: 'Belum ada item pengeluaran barang.',
            }}
          />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
