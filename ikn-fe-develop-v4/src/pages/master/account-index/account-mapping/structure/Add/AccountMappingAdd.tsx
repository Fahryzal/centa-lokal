import { TagChevron, Unite } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, message, Flex, Tooltip, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useNavigate } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import ModalAccount from './ModalAccountMapping/ModalAccountMapping';
import { SearchOutlined } from '@ant-design/icons';
import { convertToKebabCase } from '@/utils/helper';
import * as AccountAxios from '@pages/master/account-index/account/service/AccountAxios';

export default function AccounMappingtAdd() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const onFinish = async (values: AccountInterfaces.AccountTypePosType) => {
    try {
      setLoading(true);
      const { parentName, ...payload } = values;
      await AccountAxios.posAccount(payload);

      messageApi.info('Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/akun-mapping');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      messageApi.error('Gagal Menambahkan Data');
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

  const handleRowDoubleClick = (record: AccountInterfaces.AccountType) => {
    form.setFieldsValue({
      parentId: record.id || null,
      parentName: record.name,
    });
    setOpen(false);
  };

  const name = Form.useWatch('name', form);
  useEffect(() => {
    if (name) {
      form.setFieldsValue({
        id: convertToKebabCase(name),
      });
    }
  }, [name]);

  return (
    <Card
      title={<TitleCardAdd title="Tambah Account" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalAccount open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item
                label="Parent"
                name="parentId"
                style={{ width: '100%', display: 'none' }}
                rules={[{ required: false, message: 'Masukan Parent Id!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Parent Id" />
              </Form.Item>

              <Form.Item
                label="Nama Akun Parent"
                name="parentName"
                style={{ width: '100%' }}
                rules={[{ required: false, message: 'Masukan Nama Akun Parent!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nama Akun Parent" />
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
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Masukan Nama!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nama" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="ID" name="id" rules={[{ required: true, message: 'Masukan ID' }]}>
              <Input disabled prefix={<Unite size={16} />} placeholder="masukan ID" />
            </Form.Item>

            <Form.Item
              label="Tipe"
              name="type"
              rules={[{ required: true, message: 'Masukan type' }]}
            >
              <Select
                placeholder="type"
                style={{ width: '100%' }}
                options={[
                  { value: 'ASSET', label: 'ASSET' },
                  { value: 'EQUITY', label: 'EQUITY' },
                  { value: 'REVENUE', label: 'REVENUE' },
                  { value: 'EXPENSE', label: 'EXPENSE' },
                  { value: 'LIABILITY', label: 'LIABILITY' },
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
