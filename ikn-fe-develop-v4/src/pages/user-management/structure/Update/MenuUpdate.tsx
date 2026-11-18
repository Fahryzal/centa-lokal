import { AddressBook, User } from '@phosphor-icons/react';
import { Card, Button, Form, Input, Row, Col, Flex, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { SearchOutlined } from '@ant-design/icons';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as MenuInterfaces from 'pages/user-management/interface/MenuInterfaces';
import * as MenuAxios from '@pages/user-management/service/MenuAxios';
import ModalMenus from './ModalMenus/ModalMenus';
import { showNotification } from '@/contexts/services/notificationService';

export default function MenuUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm<MenuInterfaces.PayloadMenuType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const onFinish = async (values: MenuInterfaces.PayloadMenuType) => {
    try {
      const { nameParent, ...valueNew } = values;
      setLoading(true);
      if (id) {
        await MenuAxios.updateMenus(+id, valueNew);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/user-management');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  const handleRowDoubleClick = (record: MenuInterfaces.DatumType) => {
    form.setFieldsValue({
      parentId: record.id,
      nameParent: record.name,
    });
    setOpen(false);
  };

  useEffect(() => {
    getDataMenuById();
  }, []);

  const getDataMenuById = async () => {
    try {
      if (id) {
        const result = await MenuAxios.fetchDataMenuById(id);
        form.setFieldsValue({
          name: result?.name,
          path: result?.path,
          parentId: result?.parentId,
          nameParent: result?.nameParent,
        });
      }
    } catch (e) {
      showNotification('error', 'Error', 'Terjadi Kesalahan');
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Edit Menu" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalMenus open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
      <Form<MenuInterfaces.PayloadMenuType>
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item<MenuInterfaces.PayloadMenuType>
              name="parentId"
              label="Parent"
              rules={[{ required: false, message: 'name!' }]}
              style={{ width: '100%', display: 'none' }}
            >
              <Input
                disabled
                style={{ width: '100%' }}
                prefix={<AddressBook size={16} />}
                placeholder="Masukan parent"
              />
            </Form.Item>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Form.Item<MenuInterfaces.PayloadMenuType>
                name="nameParent"
                label="Nama Prent"
                rules={[{ required: false, message: 'name!' }]}
                style={{ width: '100%' }}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<AddressBook size={16} />}
                  placeholder="Masukan parent"
                />
              </Form.Item>

              <Tooltip title="Search">
                <Button
                  onClick={() => setOpen(true)}
                  shape="circle"
                  type="primary"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<MenuInterfaces.PayloadMenuType>
              name="name"
              label="Nama Menu"
              rules={[{ required: true, message: 'name!' }]}
            >
              <Input prefix={<AddressBook size={16} />} placeholder="Masukan nama" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<MenuInterfaces.PayloadMenuType>
              name="path"
              label="Path"
              rules={[{ required: true, message: 'Masukan path' }]}
            >
              <Input prefix={<User size={16} />} placeholder="path" />
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
