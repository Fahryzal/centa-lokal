import {
  AddressBook,
  AlignCenterVertical,
  Numpad,
  OfficeChair,
  Password,
  Unite,
  User,
} from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as UserManagementAxios from '@pages/user-management/service/UserManagementAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useDebounce, useFetchOptions } from '@/hooks';
import { toAntdOptionsV2 } from '@/utils/helper';
import { RotateLeftOutlined } from '@ant-design/icons';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import * as hooksGlobal from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';

export default function UserManagementUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState({
    data: [],
    page: 1,
    limit: 10,
    loading: false,
    name: '',
  });

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 100,
    loading: false,
    nama: '',
  });
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await UserManagementAxios.updateUserManagement(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/user-management');
        }, 2000);
        form.resetFields();
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Edit Data');
    }
  };

  useEffect(() => {
    getDataUserById();
  }, []);

  const getDataUserById = async () => {
    setLoading(true);
    if (id) {
      const data = await UserManagementAxios.fetchDataUserManagementById(id);
      console.log('data.unitId', data.unitId);
      form.setFieldsValue({
        email: data.email,
        name: data.name,
        password: data.password,
        nik: data.nik,
        jabatan: data.jabatan,
        roleIds: data.roles,
        isRoot: data.isRoot,
        isPusat: data.isPusat,
        unitID: data.unitId,
      });
    }
    setLoading(false);
  };
  const onSearch = useDebounce((searchText: string) => {
    setUserRoles((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  useFetchOptions(userRoles, setUserRoles, UserManagementAxios.fetchDataRoles, [userRoles.name]);

  const onSearchUnit = hooksGlobal.useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  // unit
  hooksGlobal.useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  return (
    <Card
      title={<TitleCardEdit title="Edit User" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
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
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Masukan email!' }]}
            >
              <Input disabled prefix={<AddressBook size={16} />} placeholder="email@example.com" />
            </Form.Item>

            <Form.Item
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Masukan nama' }]}
            >
              <Input prefix={<User size={16} />} placeholder="nama" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              // rules={[{ required: true, message: "Masukan password" }]}
            >
              <Input type="password" prefix={<Password size={16} />} placeholder="password" />
            </Form.Item>

            <Form.Item
              label="Unit"
              name="unitID"
              rules={[{ required: true, message: 'Masukan unit' }]}
            >
              <Select
                prefix={<Unite />}
                showSearch
                loading={unit.loading}
                placeholder="Pilih unit"
                optionFilterProp="label"
                onChange={() => setUnit((prev) => ({ ...prev, nama: '' }))}
                onSearch={onSearchUnit}
                options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
              />
            </Form.Item>

            <Form.Item
              label="Is Root"
              name="isRoot"
              rules={[{ required: true, message: 'Masukan Is Root' }]}
            >
              <Select
                prefix={<AlignCenterVertical />}
                optionFilterProp="label"
                showSearch
                maxCount={1}
                style={{ width: '100%' }}
                placeholder="Is Root"
                options={[
                  { label: 'YA', value: 'Y' },
                  { label: 'NO', value: 'N' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="NIK" name="nik" rules={[{ required: true, message: 'Masukan nik!' }]}>
              <Input prefix={<Numpad size={16} />} placeholder="nik" />
            </Form.Item>

            <Form.Item
              label="Jabatan"
              name="jabatan"
              rules={[{ required: true, message: 'Masukan jabatan' }]}
            >
              <Input prefix={<OfficeChair size={16} />} placeholder="jabatan" />
            </Form.Item>

            <Form.Item
              label="Is Pusat"
              name="isPusat"
              rules={[{ required: true, message: 'Masukan Is Pusat' }]}
            >
              <Select
                prefix={<AlignCenterVertical />}
                optionFilterProp="label"
                showSearch
                maxCount={1}
                style={{ width: '100%' }}
                placeholder="Is Pusat"
                options={[
                  { label: 'YA', value: true },
                  { label: 'NO', value: false },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Role"
              name="roleIds"
              rules={[{ required: true, message: 'Masukan roles' }]}
            >
              <Select
                prefix={<RotateLeftOutlined />}
                loading={userRoles.loading}
                optionFilterProp="label"
                showSearch
                mode="multiple"
                maxCount={1}
                style={{ width: '100%' }}
                placeholder="Roles"
                onChange={() => setUserRoles((prev) => ({ ...prev, name: '' }))}
                onSearch={onSearch}
                options={toAntdOptionsV2(userRoles.data || [], 'id', 'name')}
              />
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
