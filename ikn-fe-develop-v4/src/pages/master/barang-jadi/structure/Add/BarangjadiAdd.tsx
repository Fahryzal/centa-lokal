import { Folders, Package, TagChevron, Gauge, Stack } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import * as BarangJadiAxios from '@pages/master/barang-jadi/service/BarangJadiAxios';
import { useNavigate } from 'react-router';
import * as helperGlobal from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as globalHelpers from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';

export default function BarangJadiAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [kategori, setKategori] = useState({
    data: [],
    page: 1,
    limit: 1000,
    loading: false,
    nama: '',
  });

  const [satuan, setSatuan] = useState({
    data: [],
    page: 1,
    limit: 1000,
    loading: false,
    keterangan: '',
    name: '',
  });

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await BarangJadiAxios.posBarangjadi(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahlan Data');
      setTimeout(() => {
        navigate('/barang-jadi');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      console.log(e);
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  useEffect(() => {
    getDataCode();
  }, []);

  useFetchOptions(kategori, setKategori, BarangJadiAxios.fetchDataKategori, [kategori.nama]);

  useFetchOptions(satuan, setSatuan, BarangJadiAxios.fetchDataSatuan, [satuan.keterangan]);

  const getDataCode = async () => {
    setLoading(true);
    const data = await BarangJadiAxios.fetchGenCodeBarangjadi();
    form.setFieldsValue({
      kodeBarang: data.code,
    });
    setLoading(false);
  };

  const onSearchSatuan = useDebounce((searchText: string) => {
    setSatuan((prev) => ({ ...prev, keterangan: searchText }));
  }, 1000);

  const onSearchKategori = useDebounce((searchText: string) => {
    setKategori((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  return (
    <Card
      title={<TitleCardAdd title="Tambah Barang Jadi" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Kode Barang"
              name="kodeBarang"
              rules={[{ required: true, message: 'Masukan kode barang!' }]}
            >
              <Input disabled prefix={<TagChevron size={16} />} placeholder="Kode barang" />
            </Form.Item>
            <Form.Item
              label="Nama Barang"
              name="namaBarang"
              rules={[{ required: true, message: 'Masukan nama barang jadi' }]}
            >
              <Input prefix={<Package size={16} />} placeholder="Nama barang" />
            </Form.Item>

            <Form.Item
              label="Satuan Barang"
              name="satuan"
              rules={[{ required: true, message: 'Masukan satuan barang!' }]}
            >
              <Select
                prefix={<Gauge />}
                loading={satuan.loading}
                showSearch
                placeholder="Pilih satuan"
                optionFilterProp="label"
                onChange={() => setSatuan((prev) => ({ ...prev, keterangan: '' }))}
                onSearch={onSearchSatuan}
                options={helperGlobal.toAntdOptionsV2(satuan.data || [], 'name', 'keterangan')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Kategori Barang"
              name="kategori"
              rules={[{ required: true, message: 'Masukan Kategori barang!' }]}
            >
              <Select
                prefix={<Folders />}
                showSearch
                loading={kategori.loading}
                placeholder="Pilih kategori"
                optionFilterProp="label"
                onChange={() => setKategori((prev) => ({ ...prev, nama: '' }))}
                onSearch={onSearchKategori}
                options={helperGlobal.toAntdOptionsV2(kategori.data || [], 'nama', 'nama')}
              />
            </Form.Item>

            <Form.Item
              label="Berat Satuan"
              name="nilaiSatuan"
              rules={[{ required: true, message: 'Masukan Berat Satuan!' }]}
            >
              <InputNumber
                prefix={<Stack />}
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                // disabled
                controls={false}
                style={{ width: '100%' }}
                placeholder={'Berat Satuan'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
