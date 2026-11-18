import { TagChevron, Unite } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import { showNotification } from '@/contexts/services/notificationService';

export default function UnitUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await UnitAxios.updateUnit(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/unit');
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
    getDataUnitById();
  }, []);

  const getDataUnitById = async () => {
    setLoading(true);
    if (id) {
      const data = await UnitAxios.fetchDataUnitById(id);
      form.setFieldsValue({
        kode: data.kode,
        nama: data.nama,
      });
    }
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardEdit title="Edit Unit" />}
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
              <Input prefix={<Unite size={16} />} placeholder="Unit" />
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
