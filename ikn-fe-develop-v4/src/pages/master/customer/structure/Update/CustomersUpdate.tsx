import { Globe, Phone, TagChevron, Unite, User } from '@phosphor-icons/react';
import { Card, Form, Input, Row, Col, Flex, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as CustomersAxios from '@pages/master/customer/service/CustomersAxios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { HomeOutlined, MailOutlined } from '@ant-design/icons';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import { showNotification } from '@/contexts/services/notificationService';
import { toAntdOptionsValue } from '@/utils/helper';
import countryByContinent from '@/utils/data.json';

export default function CustomerUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [regionalType, setRegionalType] = useState({
    regional_type: '',
  });
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        await CustomersAxios.updateCustomer(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/customer');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', ' Gagal', 'Gagal Edit Data');
    }
  };

  useEffect(() => {
    getDataCustomerById();
  }, []);

  const getDataCustomerById = async () => {
    setLoading(true);
    if (id) {
      const data = await CustomersAxios.fetchDataCustomerById(id);
      form.setFieldsValue({
        code: data.code,
        name: data.name,
        email: data.email,
        unit: data.unit,
        regional_type: data.regional_type,
        address: data.address,
        phone: data.phone,
        country: data.country,
        continent: data.continent,
      });
      setRegionalType((prev) => ({ ...prev, regional_type: data.regional_type }));
    }
    setLoading(false);
  };

  return (
    <Card
      title={<TitleCardEdit title="Edit Customer" />}
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
              label="Kode"
              name="code"
              rules={[{ required: true, message: 'Masukan kode!' }]}
            >
              <Input disabled prefix={<TagChevron size={16} />} placeholder="Kode" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Masukan nama' }]}
            >
              <Input prefix={<User size={16} />} placeholder="Nama" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Masukan email' }]}
            >
              <Input prefix={<MailOutlined size={16} />} placeholder="Email" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Alamat"
              name="address"
              rules={[{ required: true, message: 'Masukan alamat' }]}
            >
              <Input prefix={<HomeOutlined size={16} />} placeholder="Alamat" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: true, message: 'Masukan unit' }]}
            >
              <Input prefix={<Unite size={16} />} placeholder="Unit" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="No HP"
              name="phone"
              rules={[{ required: true, message: 'Masukan no hp' }]}
            >
              <Input prefix={<Phone size={16} />} placeholder="No HP" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Regional"
              name="regional_type"
              rules={[{ required: true, message: 'Masukan regional' }]}
            >
              <Select
                prefix={<Globe size={16} />}
                showSearch
                placeholder="Pilih regional"
                onChange={(value) => setRegionalType((prev) => ({ ...prev, regional_type: value }))}
                optionFilterProp="label"
                options={[
                  { value: 'international', label: 'International' },
                  { value: 'domestic', label: 'Domestic' },
                ]}
              />
            </Form.Item>
          </Col>

          {regionalType.regional_type === 'international' && (
            <>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Benua"
                  name="continent"
                  rules={[
                    {
                      required: regionalType.regional_type === 'international',
                      message: 'Masukan benua',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Pilih benua"
                    optionFilterProp="label"
                    options={[
                      { value: 'Asia', label: 'Asia' },
                      { value: 'Africa', label: 'Afrika' },
                      { value: 'Europe', label: 'Europe' },
                      { value: 'North America', label: 'Amerika Utara' },
                      { value: 'South America', label: 'Amerika Selatan' },
                      { value: 'Oceania', label: 'Oceania' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Negara"
                  name="country"
                  rules={[
                    {
                      required: regionalType.regional_type === 'international',
                      message: 'Masukan negara',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Pilih negara"
                    optionFilterProp="label"
                    options={toAntdOptionsValue(countryByContinent, 'country', 'country')}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonEdit loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
