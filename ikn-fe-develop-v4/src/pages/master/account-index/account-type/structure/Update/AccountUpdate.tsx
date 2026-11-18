import { TagChevron, Unite } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as AccountTypeInterfaces from '@pages/master/account-index/account-type/interface/AccountTypeInterfaces';
import * as AccounTypetAxios from '@pages/master/account-index/account-type/service/AccounTypetAxios';
import { showNotification } from '@/contexts/services/notificationService';

export default function AccountTypeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<AccountTypeInterfaces.PayloadType>();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: AccountTypeInterfaces.PayloadType) => {
    try {
      if (id) {
        setLoading(true);
        await AccounTypetAxios.updateAccountType(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/akun');
        }, 2000);
        setLoading(false);
        form.resetFields();
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak di temukan');
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Edit Data');
    }
  };

  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = async () => {
    try {
      if (id) {
        const data = await AccounTypetAxios.fetchDataAccountTypeById(id);
        console.log('data', data);
        form.setFieldsValue({
          name: data.name,
          code: data.code,
          description: data.description,
          normalBalance: data.normalBalance,
        });
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak ditemukan');
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Get Data');
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Edit Account Tipe" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form<AccountTypeInterfaces.PayloadType>
        form={form}
        layout="vertical"
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish as any}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item<AccountTypeInterfaces.PayloadType>
              label="Nama Tipe"
              name="name"
              style={{ width: '100%' }}
              rules={[{ required: true, message: 'Masukan Nama Tipe!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nama Tipe" />
            </Form.Item>

            <Form.Item<AccountTypeInterfaces.PayloadType>
              label="Kode Tipe"
              name="code"
              rules={[{ required: true, message: 'Masukan Kode!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<AccountTypeInterfaces.PayloadType>
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Masukan Description' }]}
            >
              <Input prefix={<Unite size={16} />} placeholder="Description" />
            </Form.Item>

            <Form.Item<AccountTypeInterfaces.PayloadType>
              label="Normal Balance"
              name="normalBalance"
              rules={[{ required: true, message: 'Masukan Normal Balance' }]}
            >
              <Select
                placeholder="Normal Balancr"
                style={{ width: '100%' }}
                options={[
                  { value: 'CREDIT', label: 'CREDIT' },
                  { value: 'DEBIT', label: 'DEBIT' },
                ]}
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
