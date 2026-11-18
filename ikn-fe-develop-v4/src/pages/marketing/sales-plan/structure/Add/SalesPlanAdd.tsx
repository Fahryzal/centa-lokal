import { Calendar } from '@phosphor-icons/react';
import { Form, Row, Col, Flex } from 'antd';
import * as globalHelpers from '@/utils/helper';
import dayjs from 'dayjs';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import { showNotification } from '@/contexts/services/notificationService';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import { useCreateSalesPlan } from '../../hooks/useSalesPlan';
import { handleMessageError } from '@/utils/func/func';
import * as SalePlanInterfaces from '@pages/marketing/sales-plan/interface/SalePlanInterfaces';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { useState } from '@/hooks/React/useState';
import { Card, DatePicker, InputNumber, Select } from '@/components/ui';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';
export default function SalesPlanAdd() {
  const navigate = useAppNavigate();
  const create = useCreateSalesPlan();
  const [form] = Form.useForm();
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);
  const onFinish = async (values: SalePlanInterfaces.SalesPlanPayloadType) => {
    try {
      values = {
        ...values,
        typeSalesPlan: 'RA',
        description: '-',
        periode_month: dayjs(values.periode_month).format('MM/YYYY'),
      };
      await create.mutateAsync(values);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
      setTimeout(() => {
        navigate('/sales-plan');
      }, 2000);
      form.resetFields();
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  return (
    <Card
      title={<TitleCardAdd title="Tambah Rencana Penjualan" />}
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
              extra={<TextTerbilang form={form} properti="value_rkap" />}
            >
              <InputNumber
                controls={false}
                formatter={globalHelpers.formatNumber2Digits}
                parser={globalHelpers.parseNumber2Digits}
                style={{ width: '100%' }}
                prefix={<span>RP</span>}
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
          <Buttonback loading={create.isPending} />
          <ButtonAdd loading={create.isPending} />
        </Flex>
      </Form>
    </Card>
  );
}
