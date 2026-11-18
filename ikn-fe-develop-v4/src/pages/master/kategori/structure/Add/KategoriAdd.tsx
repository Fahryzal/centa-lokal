import { Folders, TagChevron } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex } from 'antd';
import { useState } from 'react';
import * as kategoriAxios from '@pages/master/kategori/service/kategoriAxios';
import { useNavigate } from 'react-router';
import TitleCard from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';

export default function KategoriAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await kategoriAxios.posKategori(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/kategori');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  // useEffect(() => {
  //   getDataCode();
  // }, []);

  // const getDataCode = async () => {
  //   setLoading(true);
  //   const data = await kategoriAxios.fetchGenCodeKategori();
  //   form.setFieldsValue({
  //     kode: data.code,
  //   });
  //   setLoading(false);
  // };

  return (
    <Card
      title={<TitleCard title="Tambah kategori" />}
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
              <Input prefix={<TagChevron size={16} />} placeholder="Kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="nama" rules={[{ required: true, message: 'Masukan kategori' }]}>
              <Input prefix={<Folders size={16} />} placeholder="Masukan kategori" />
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
