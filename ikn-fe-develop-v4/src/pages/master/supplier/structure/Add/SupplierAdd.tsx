import { TagChevron, User } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Tooltip, Button } from 'antd';
import { useState } from 'react';
import * as SupplierAxios from '@pages/master/supplier/service/SupplierAxios';
import { useNavigate } from 'react-router';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ModalAccount from './ModalAccount/ModalAccount';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import { showNotification } from '@/contexts/services/notificationService';

export default function SupplierAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await SupplierAxios.posSupplier(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/supplier');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  const handleRowDoubleClick = (record: AccountInterfaces.AccountType) => {
    form.setFieldsValue({
      accountCode: record.code,
      code: record.code,
    });
    setOpen(false);
  };
  return (
    <Card
      title={<TitleCardAdd title="Tambah Supplier" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalAccount open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Form.Item
                label="Akun"
                style={{ width: '100%', display: 'none' }}
                name="accountCode"
                rules={[{ required: true, message: 'Masukan Account!' }]}
              >
                <Input prefix={<TagChevron size={16} />} placeholder="Account" />
              </Form.Item>

              <Form.Item
                label="Akun"
                style={{ width: '100%' }}
                name="code"
                rules={[{ required: true, message: 'Masukan Accounr ID!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Account ID" />
              </Form.Item>

              <Tooltip title="Search">
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>

            <Form.Item
              label="Nama Supplier"
              name="namaRekanan"
              rules={[{ required: true, message: 'Masukan Nama Supplier' }]}
            >
              <Input prefix={<User size={16} />} placeholder="Nama Supplier" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Alamat"
              name="alamatRekanan"
              rules={[{ required: true, message: 'Masukan alamat' }]}
            >
              <Input prefix={<HomeOutlined size={16} />} placeholder="Alamat" />
            </Form.Item>

            <Form.Item
              label="Nomor Pengenal"
              name="nomorPengenal"
              rules={[{ required: true, message: 'Masukan Nomor Pengenal!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nomor Pengenal" />
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
