import { Calendar } from '@phosphor-icons/react';
import { Card, Form, Row, Col, Flex, DatePicker, InputNumber, Select } from 'antd';
import { useState } from 'react';
import * as SalesPlanAxios from '@pages/marketing/sales-plan/service/SalesPlanAxios';
import { useNavigate } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import dayjs from 'dayjs';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { decodeToken } from '@/api/authService';
import { showNotification } from '@/contexts/services/notificationService';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import TextTerbilangKG from '@/components/atoms/Text/TextTerbilangKg';

export default function SalesPlanEksporRNAdd() {
  const navigate = useNavigate();
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
  const onFinish = async (values: any) => {
    try {
      const dataToken = decodeToken();
      setLoading(true);
      values = {
        ...values,
        staffId: dataToken?.id,
        description: '-',
        periode_month: dayjs(values.periode_month).format('MM/YYYY'),
        typeSalesPlan: 'RN_EKSPOR',
      };
      await SalesPlanAxios.posSalesPlan(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/sales-plan-rn-ekspor');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Ubah Data');
    }
  };

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  return (
    <Card
      title={<TitleCardAdd title="Tambah Rencana Penjualan (RN Ekspor)" />}
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
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
