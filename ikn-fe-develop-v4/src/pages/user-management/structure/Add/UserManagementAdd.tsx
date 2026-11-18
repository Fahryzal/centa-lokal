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
import { useState } from 'react';
import * as UserManagementAxios from '@pages/user-management/service/UserManagementAxios';
import { useNavigate } from 'react-router';
import { RotateLeftOutlined } from '@ant-design/icons';
import { useDebounce, useFetchOptions } from '@/hooks';
import { toAntdOptionsV2 } from '@/utils/helper';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import * as hooksGlobal from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import { PayloadAddUser } from '../interfaces/interfaces';
import { handleMessageError } from '@/utils/func/func';

export default function UserManagementAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm<PayloadAddUser>();
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
    limit: 5,
    loading: false,
    nama: '',
  });
  const onFinish = async (values: PayloadAddUser) => {
    try {
      setLoading(true);
      await UserManagementAxios.posUserManagement(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  useFetchOptions(userRoles, setUserRoles, UserManagementAxios.fetchDataRoles, [userRoles.name]);

  const onSearch = useDebounce((searchText: string) => {
    setUserRoles((prev) => ({ ...prev, name: searchText }));
  }, 1000);

  const onSearchUnit = hooksGlobal.useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  // unit
  hooksGlobal.useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  return (
    <Card
      title={<TitleCardAdd title="Tambah User" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form<PayloadAddUser>
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item<PayloadAddUser>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Masukan email!' }]}
            >
              <Input prefix={<AddressBook size={16} />} placeholder="email@example.com" />
            </Form.Item>

            <Form.Item<PayloadAddUser>
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Masukan nama' }]}
            >
              <Input prefix={<User size={16} />} placeholder="nama" />
            </Form.Item>

            <Form.Item<PayloadAddUser>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Masukan password' }]}
            >
              <Input type="password" prefix={<Password size={16} />} placeholder="password" />
            </Form.Item>

            <Form.Item<PayloadAddUser>
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

            <Form.Item<PayloadAddUser>
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
            <Form.Item<PayloadAddUser>
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

            <Form.Item<PayloadAddUser>
              label="Nik"
              name="nik"
              rules={[{ required: true, message: 'Masukan nik!' }]}
            >
              <Input prefix={<Numpad size={16} />} placeholder="nik" />
            </Form.Item>

            <Form.Item<PayloadAddUser>
              label="Jabatan"
              name="jabatan"
              rules={[{ required: true, message: 'Masukan jabatan' }]}
            >
              <Input prefix={<OfficeChair size={16} />} placeholder="jabatan" />
            </Form.Item>

            <Form.Item<PayloadAddUser>
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
