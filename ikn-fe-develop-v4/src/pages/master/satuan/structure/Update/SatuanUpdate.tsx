import { Gauge, Tag } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import * as SatuanAxios from '@pages/master/satuan/service/SatuanAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import { showNotification } from '@/contexts/services/notificationService';

export default function SatuanUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await SatuanAxios.updateSatuan(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/satuan');
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
    getDataSatuanById();
  }, []);

  const getDataSatuanById = async () => {
    setLoading(true);
    if (id) {
      const data = await SatuanAxios.fetchDataSatuanById(id);
      form.setFieldsValue({
        kode: data.kode,
        keterangan: data.keterangan,
        name: data.name,
      });
    }
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardEdit title="Edit Satuan" />}
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
              <Input disabled prefix={<Tag size={16} />} placeholder="Kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="keterangan"
              rules={[{ required: true, message: 'Masukan keterangan' }]}
            >
              <Input prefix={<Gauge size={16} />} placeholder="Keterangan" />
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
          <ButtonEdit loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
