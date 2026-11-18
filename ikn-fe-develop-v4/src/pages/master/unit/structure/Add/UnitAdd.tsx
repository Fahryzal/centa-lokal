import { TagChevron, Unite } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useNavigate } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import { showNotification } from '@/contexts/services/notificationService';

export default function UnitAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await UnitAxios.posUnit(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/unit');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', '"Gagal Menambahkan Data');
    }
  };

  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await UnitAxios.fetchGenCodeUnit();
    form.setFieldsValue({
      kode: data.code,
    });
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Unit" />}
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
              <Input disabled prefix={<TagChevron size={16} />} placeholder="Kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="nama" rules={[{ required: true, message: 'Masukan unit' }]}>
              <Input prefix={<Unite size={16} />} placeholder="masukn nama unit" />
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
