import { Package, TagChevron, Unite, Gauge } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import * as BarangJadiAxios from '@pages/master/barang-jadi/service/BarangJadiAxios';
import * as RawMaterialAxios from '@pages/master/barang-mentah/service/RawMaterialAxios';

import { useNavigate, useParams } from 'react-router';
import * as helperGlobal from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import ModalRawMaterial from './ModalRawMaterial/ModalRawMaterial';
import { SearchOutlined } from '@ant-design/icons';
import { showNotification } from '@/contexts/services/notificationService';

export default function RawMaterialUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [kategori, setKategori] = useState({
    data: [],
    page: 1,
    limit: 50,
    loading: false,
    nama: '',
  });

  const [satuan, setSatuan] = useState({
    data: [],
    page: 1,
    limit: 50,
    loading: false,
    name: '',
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
        await RawMaterialAxios.updateRawMaterial(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Update Data');
        setTimeout(() => {
          navigate('/raw-material');
        }, 2000);
        setLoading(false);
        form.resetFields();
      } else {
        showNotification('warning', 'Perhatian', 'Gagal Update Data');
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Update Data');
    }
  };

  useFetchOptions(kategori, setKategori, BarangJadiAxios.fetchDataKategori, [kategori.nama]);

  useFetchOptions(satuan, setSatuan, BarangJadiAxios.fetchDataSatuan, [satuan.keterangan]);

  useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  const onSearchSatuan = useDebounce((searchText: string) => {
    setSatuan((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const handleRowDoubleClick = (record: any) => {
    form.setFieldsValue({
      accountCode: record.code,
    });
    setOpen((open) => !open);
  };

  useEffect(() => {
    getDataByid();
  }, []);

  const getDataByid = async () => {
    try {
      if (id) {
        const data = await RawMaterialAxios.fetchDataRawmaterialById(id);
        form.setFieldsValue({
          accountCode: data.accountCode,
          itemCode: data.itemCode,
          itemName: data.itemName,
          unitId: data.unitId,
          satuan: data.satuan,
        });
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak ditemukan');
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Mendapatkan Data');
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Barang Mentah" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalRawMaterial open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
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
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item
                label="Nomor Akun"
                style={{ flex: 1, width: '100%' }}
                name="accountCode"
                rules={[{ required: true, message: 'Masukan nilai nomor akun!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor akun"
                />
              </Form.Item>

              <Tooltip title="search">
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>

            <Form.Item
              label="Kode Barang"
              name="itemCode"
              rules={[{ required: true, message: 'Masukan kode barang!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Kode barang" />
            </Form.Item>
            <Form.Item
              label="Nama Barang"
              name="itemName"
              rules={[{ required: true, message: 'Masukan nama barang mentah' }]}
            >
              <Input prefix={<Package size={16} />} placeholder="Nama barang" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Unit Barang"
              name="unitId"
              rules={[{ required: true, message: 'Masukan unit barang mentah' }]}
            >
              <Select
                prefix={<Unite />}
                showSearch
                loading={kategori.loading}
                placeholder="Pilih unit"
                optionFilterProp="label"
                onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                onSearch={onSearchUnit}
                options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
              />
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
                options={helperGlobal.toAntdOptionsV2(satuan.data || [], 'name', 'name')}
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
