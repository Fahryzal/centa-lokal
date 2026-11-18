import { Folders, TagChevron } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import * as kategoriAxios from '@pages/master/kategori/service/kategoriAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';

export default function KategoriUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await kategoriAxios.updateKategori(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/kategori');
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
    getDataKategoriById();
  }, []);

  const getDataKategoriById = async () => {
    setLoading(true);
    if (id) {
      const data = await kategoriAxios.fetchDataKategoriById(id);
      form.setFieldsValue({
        kode: data.kode,
        nama: data.nama,
      });
    }
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardEdit title="Edit Kategori" />}
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
            <Form.Item name="nama" rules={[{ required: true, message: 'Masukan kategori' }]}>
              <Input prefix={<Folders size={16} />} placeholder="Kategori" />
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
