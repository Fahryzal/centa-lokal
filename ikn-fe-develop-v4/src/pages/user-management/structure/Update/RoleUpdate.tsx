import { User } from '@phosphor-icons/react';
import { Card, Form, Input, Col, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as RoleInterfaces from '@pages/user-management/interface/RoleInterfaces';
import { useMenusByGroup } from '@pages/user-management/hooks/useMenus';
import { useRole, useUpdateRole } from '@pages/user-management/hooks/useRoles';
import MenuPermissions from '../Component/Menu/MenuPermissions';

interface Permission {
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export default function RoleUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);

  // Hooks
  const { data: menuData, isLoading: loadingMenus } = useMenusByGroup();
  const { data: roleData, isLoading: loadingRole } = useRole(id as string);
  const updateRoleMutation = useUpdateRole();

  // Populate Form and Permissions when Role Data is fetched
  useEffect(() => {
    if (roleData) {
      form.setFieldsValue({
        name: roleData.name,
      });
      const permissions = roleData.permissions || (roleData as any).rolePermission;
      if (permissions) {
        const mappedPermissions = permissions.map((p: any) => ({
          menuId: Number(p.menuId),
          canView: Boolean(p.canView),
          canAdd: Boolean(p.canAdd),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
          canApprove: Boolean(p.canApprove),
        }));
        setRolePermissions(mappedPermissions);
      }
    }
  }, [roleData, form]);

  const onFinish = (values: RoleInterfaces.PayloadType) => {
    if (!id) return;

    const payload = {
      ...values,
      rolePermission: rolePermissions,
    };

    updateRoleMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate('/user-management');
          }, 2000);
          form.resetFields();
        },
      }
    );
  };

  const loading = loadingMenus || loadingRole || updateRoleMutation.isPending;
  console.log({ menuData });

  return (
    <Card
      title={<TitleCardAdd title="Edit Role" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form<RoleInterfaces.PayloadType>
        form={form}
        name="role-update"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Col xs={24}>
          <Form.Item<RoleInterfaces.PayloadType>
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
          data={menuData || ([] as any)}
          rolePermissions={rolePermissions}
          setRolePermissions={setRolePermissions}
        />
        <Flex gap="small" style={{ marginTop: 20 }}>
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} text="Simpan" />
        </Flex>
      </Form>
    </Card>
  );
}
