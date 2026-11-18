import { User } from '@phosphor-icons/react';
import { Card, Form, Input, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as RoleInterfaces from '@pages/user-management/interface/RoleInterfaces';
import * as RoleAxios from '@pages/user-management/service/RoleAxios';
import * as MenuAxios from '@pages/user-management/service/MenuAxios';
import MenuPermissions from '../Component/Menu/MenuPermissions';
import { showNotification } from '@/contexts/services/notificationService';

interface Permission {
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export default function RoleAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);

  const onFinish = async (values: RoleInterfaces.PayloadType) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        rolePermission: rolePermissions,
      };

      await RoleAxios.posRoles(payload);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await MenuAxios.fetchDataMenusByGroup();
      setData(res as any);
    };
    fetch();
  }, []);

  return (
    <Card
      title={<TitleCardAdd title="Tambah Role" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Col xs={24}>
          <Form.Item
            name="name"
            label="Nama Role"
            rules={[{ required: true, message: 'Nama Role!' }]}
            style={{ width: '100%' }}
          >
            <Input
              style={{ width: '100%' }}
              prefix={<User size={16} />}
              placeholder="Masukan Nama Role"
            />
          </Form.Item>
        </Col>
        <MenuPermissions
          data={data}
          rolePermissions={rolePermissions}
          setRolePermissions={setRolePermissions}
        />
        <Flex gap="small" style={{ marginTop: 20 }}>
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
