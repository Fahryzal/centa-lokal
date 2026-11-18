import { Folders, Gauge, Package, Stack, TagChevron } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import * as BarangJadiAxios from '@pages/master/barang-jadi/service/BarangJadiAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import * as helperGlobal from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';
import * as globalHelpers from '@/utils/helper';

export default function BarangJadiUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    limit: 5,
    loading: false,
    keterangan: '',
  });

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await BarangJadiAxios.updateBarangjadi(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/barang-jadi');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Edit Data');
    }
  };

  useEffect(() => {
    getDataBarangJadiById();
  }, []);

  useFetchOptions(kategori, setKategori, BarangJadiAxios.fetchDataKategori, [kategori.nama]);

  useFetchOptions(satuan, setSatuan, BarangJadiAxios.fetchDataSatuan, [satuan.keterangan]);

  useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  const getDataBarangJadiById = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = await BarangJadiAxios.fetchDataBarangjadiById(id);
        form.setFieldsValue({
          kodeBarang: data.kodeBarang,
          kategori: `${data.kategori}`,
          satuan: `${data.satuan}`,
          namaBarang: data.namaBarang,
          nilaiSatuan: data.nilaiSatuan,
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e, 'Gagal get data');
      showNotification('error', 'Gagal', message);
    }
  };

  const onSearchSatuan = useDebounce((searchText: string) => {
    setSatuan((prev) => ({ ...prev, keterangan: searchText }));
  }, 1000);

  const onSearchKategori = useDebounce((searchText: string) => {
    setKategori((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  return (
    <Card
      title={<TitleCardEdit title="Edit Barang" />}
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
              rules={[
                { required: true, message: 'Masukan kode barang!' },
                { whitespace: true, message: 'Kode barang tidak boleh kosong!' },
              ]}
            >
              <Input
                prefix={<TagChevron size={16} />}
                placeholder="Masukkan kode barang"
                allowClear
              />
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
                options={helperGlobal.toAntdOptionsV2(
                  satuan.data || [],
                  'keterangan',
                  'keterangan'
                )}
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
          <ButtonEdit loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
