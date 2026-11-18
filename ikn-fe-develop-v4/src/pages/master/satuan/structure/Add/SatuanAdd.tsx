import { Gauge, TagChevron } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import * as SatuanAxios from '@pages/master/satuan/service/SatuanAxios';
import { useNavigate } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as SatuanInterfaces from '@pages/master/satuan/interface/SatuanInterfaces';
import { showNotification } from '@/contexts/services/notificationService';

export default function SatuanAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: SatuanInterfaces.SatuanType) => {
    try {
      setLoading(true);
      await SatuanAxios.posSatuan(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/satuan');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await SatuanAxios.fetchGenCodeSatuan();
    form.setFieldsValue({
      kode: data.code,
    });
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah satuan" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="kode" rules={[{ required: true, message: 'Masukan kode!' }]}>
              <Input disabled prefix={<TagChevron size={16} />} placeholder="Masukan kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="keterangan"
              rules={[{ required: true, message: 'Masukan keterangan' }]}
            >
              <Input prefix={<Gauge size={16} />} placeholder="Masukan keterangan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="name" rules={[{ required: true, message: 'Masukan nama' }]}>
              <Input prefix={<Gauge size={16} />} placeholder="Masukan nama" />
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
