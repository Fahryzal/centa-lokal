import { Calendar } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, DatePicker, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as SalesPlanAxios from '@pages/marketing/sales-plan/service/SalesPlanAxios';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import * as globalHelpers from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import TextTerbilangKG from '@/components/atoms/Text/TextTerbilangKg';

/**
 * Edit page for sales plan data. This page displays a form with fields for
 * editing sales plan data. The form is populated with data from the database
 * based on the ID provided in the URL. The form is validated and submitted
 * to the server when the user clicks the "Edit" button.
 */
export default function SalesPlanRNUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);
  /**
   * Callback function when form is submitted.
   * @param {object} values - form values
   * @returns {Promise<void>}
   */
  const onFinish = async (values: any) => {
    try {
      if (id) {
        setLoading(true);
        values = {
          ...values,
          value_rkap: Number(values.value_rkap),
          periode_month: dayjs(values.periode_month).format('MM/YYYY'),
        };
        await SalesPlanAxios.updateSalesPlan(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/sales-plan-rn');
        }, 2000);
      }
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Edit Data');
    }
  };

  useEffect(() => {
    getDataSalesPlanBydId();
  }, []);

  /**
   * Fetches sales plan data by ID and updates the form fields with the retrieved data.
   * Displays a loading indicator while the data is being fetched.
   * If an error occurs during the fetch, a notification is shown.
   */

  const getDataSalesPlanBydId = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = await SalesPlanAxios.fetchDataSalesPlanById(id);
        form.setFieldsValue({
          value_rkap: data?.value_rkap,
          unitId: data?.unitId,
          periode_month: dayjs(data?.periode_month, 'MM/YYYY'),
        });
      }
      setLoading(false);
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
      setLoading(false);
    }
  };
  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);
  return (
    <Card
      title={<TitleCardEdit title="Edit Rencana Penjualan (RN)" />}
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
              label="Unit"
              name="unitId"
              rules={[{ required: true, message: 'Masukan nilai unit!' }]}
            >
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Pilih Unit"
                onSearch={onSearchUnit}
                options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
              />
            </Form.Item>

            <Form.Item
              label="Nilai RKAP"
              name="value_rkap"
              rules={[{ required: true, message: 'Masukan nilai RKAP!' }]}
              extra={<TextTerbilangKG form={form} properti="value_rkap" />}
            >
              <InputNumber
                formatter={globalHelpers.formatter}
                parser={globalHelpers.parser}
                style={{ width: '100%' }}
                prefix={<span>KG</span>}
                placeholder="Nilai RKAP"
                disabled={loading}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Periode Bulan"
              name="periode_month"
              rules={[{ required: true, message: 'Masukan Periode Bulan!' }]}
            >
              <DatePicker
                prefix={<Calendar />}
                disabled={loading}
                picker="month"
                style={{ width: '100%' }}
                format={'MM/YYYY'}
                placeholder="Periode Bulan"
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
