import { TagChevron } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Tooltip, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useNavigate, useParams } from 'react-router';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import ModalAccount from './ModalAccount/ModalAccount';
import { SearchOutlined } from '@ant-design/icons';
import * as AccountAxios from '@pages/master/account-index/account/service/AccountAxios';
import * as AccounTypetAxios from '@pages/master/account-index/account-type/service/AccounTypetAxios';
import * as AccountTypeInterfaces from '@pages/master/account-index/account-type/interface/AccountTypeInterfaces';
import { showNotification } from '@/contexts/services/notificationService';

export default function AccountUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dataTable, setTable] = useState({
    data: [] as AccountTypeInterfaces.AccountType[],
    page: 1,
    limit: 5,
    loading: false,
    kode: null,
    nama: null,
    total: 0,
  });

  const onFinish = async (values: AccountInterfaces.AccountTypePosType) => {
    try {
      if (id) {
        setLoading(true);
        await AccountAxios.updateAccount(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Update Data');
        setTimeout(() => {
          navigate('/akun');
        }, 2000);
        setLoading(false);
        form.resetFields();
      } else {
        showNotification('warning', 'Perhatian', 'ID tidak ditemukan');
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Update');
    }
  };

  useEffect(() => {
    getDataCode();
    getTypeAccount();
    getDataById();
  }, []);

  const getTypeAccount = async () => {
    try {
      setLoading(true);
      const data = await AccounTypetAxios.fetchDataAccountType(dataTable as any);
      setTable((prev) => ({ ...prev, data: data?.data?.data?.data || [] }));
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Get Data');
    }
  };

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
      parentId: record.code || null,
      parentName: record.name,
    });
    setOpen(false);
  };

  const getDataById = async () => {
    try {
      if (id) {
        const data = await AccountAxios.fetchDataUnitById(id);
        form.setFieldsValue({
          parentId: data.parentId,
          parentName: data.parentName,
          code: data.code,
          name: data.name,
          accountTypeId: data.accountTypeId,
          typeNeraca: data.typeNeraca,
          isLocked: data.isLocked,
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
      title={<TitleCardAdd title="Edit Account" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <ModalAccount open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
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
              label="Nomor Rekening"
              name="code"
              style={{ width: '100%' }}
              rules={[{ required: true, message: 'Masukan Nomor Rekening!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nomor Rekening" />
            </Form.Item>

            <Form.Item
              label="Nama Akun"
              name="name"
              rules={[{ required: true, message: 'Masukan Nama Akun!' }]}
            >
              <Input prefix={<TagChevron size={16} />} placeholder="Nama Akun" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Tipe"
              name="accountTypeId"
              rules={[{ required: true, message: 'Masukan type' }]}
            >
              <Select
                placeholder="type"
                style={{ width: '100%' }}
                options={dataTable.data.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })}
              />
            </Form.Item>

            <Form.Item
              label="Tipe Neraca"
              name="typeNeraca"
              rules={[{ required: true, message: 'Masukan type neraca' }]}
            >
              <Select
                placeholder="type neraca"
                style={{ width: '100%' }}
                options={[
                  {
                    value: '-',
                    label: '-',
                  },
                  {
                    value: 'NERACA',
                    label: 'NERACA',
                  },
                  {
                    value: 'LABARUGI',
                    label: 'LABARUGI',
                  },
                  {
                    value: 'LABARUGI-NERACA',
                    label: 'LABARUGI-NERACA',
                  },
                  {
                    value: 'LABARUGI-PAJAK',
                    label: 'LABARUGI-PAJAK',
                  },
                  {
                    value: 'LABARUGI-BEBAN-POKOK-PENJUALAN',
                    label: 'LABARUGI-BEBAN-POKOK-PENJUALAN',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Locked"
              name="isLocked"
              rules={[{ required: true, message: 'Masukan Loked' }]}
            >
              <Select
                placeholder="type"
                style={{ width: '100%' }}
                options={[
                  {
                    value: 'N',
                    label: 'NO',
                  },
                  {
                    value: 'Y',
                    label: 'YES',
                  },
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
