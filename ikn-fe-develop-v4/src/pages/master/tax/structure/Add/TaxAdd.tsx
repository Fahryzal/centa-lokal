import { TagChevron, Vault } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, InputNumber, Select, Tooltip, Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import { showNotification } from '@/contexts/services/notificationService';
import * as TaxAxios from '@pages/master/tax/service/TaxAxios';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';

import { SearchOutlined } from '@ant-design/icons';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
export default function TaxAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await TaxAxios.posTax(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/tax');
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
      accountCode: record.code || null,
      namaAccount: record.name,
    });
    setOpen(false);
  };

  return (
    <Card
      title={<TitleCardAdd title="Tambah Tax" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalAccount open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
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
                label="Nama Akun"
                name="namaAccount"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: false, message: 'Masukan namaAccount!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Parent Id" />
              </Form.Item>

              <Form.Item
                label="Kode Akun"
                name="accountCode"
                style={{ width: '100%' }}
                rules={[{ required: false, message: 'Masukan Account Code!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Akun accountCode" />
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
              label="Nama Pajak"
              name="taxtType"
              rules={[{ required: true, message: 'Masukan Nama Pajak!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nama Pajak" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Type Pajak"
              name="type"
              rules={[{ required: true, message: 'Masukan type' }]}
            >
              <Select
                showSearch
                placeholder="Pilih Type"
                optionFilterProp="label"
                options={[
                  { value: 'VAT_OUT', label: 'VAT OUT' },
                  { value: 'VAT_IN', label: 'VAT IN' },
                  { value: 'WITHHOLD', label: 'WITHHOLD' },
                  { value: 'SALARY', label: 'SALARY' },
                  { value: 'FINAL', label: 'FINAL' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Nilai Pajak"
              name="taxValue"
              rules={[{ required: true, message: 'Masukan Nilai Pajak!' }]}
            >
              <InputNumber
                controls={false}
                style={{
                  width: '100%',
                }}
                prefix={<Vault size={16} />}
                placeholder="Nama Nilai Pajak"
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
