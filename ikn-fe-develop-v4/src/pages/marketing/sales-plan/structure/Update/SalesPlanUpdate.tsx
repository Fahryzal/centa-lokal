import { Calendar } from '@phosphor-icons/react';
import { Form, Row, Col, Flex } from 'antd';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonEdit from '@/components/atoms/button/buttonEdit';
import TitleCardEdit from '@/components/atoms/Cards/titleCardEdit';
import * as globalHelpers from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import * as helperGlobal from '@/utils/helper';
import { useDebounce, useFetchOptions } from '@/hooks';
import { useSalesPlanByid, useUpdateSalesPlan } from '../../hooks/useSalesPlan';
import { handleMessageError } from '@/utils/func/func';
import * as SalePlanInterfaces from '@pages/marketing/sales-plan/interface/SalePlanInterfaces';
import { useAppNavigate } from '@/hooks/React/useAppNavigate';
import { Card, DatePicker, InputNumber, Select } from '@/components/ui';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import { useState } from '@/hooks/React/useState';
import { useEffect } from '@/hooks/React/useEffect';
import TextTerbilang from '@/components/atoms/Text/TextTerbilang';

export default function SalesPlanUpdate() {
  const navigate = useAppNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });
  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);
  const { data, isLoading, isError } = useSalesPlanByid(id as string);
  const update = useUpdateSalesPlan();

  const onFinish = async (values: SalePlanInterfaces.SalesPlanPayloadType) => {
    try {
      if (id) {
        values = {
          ...values,
          value_rkap: Number(values.value_rkap),
          periode_month: dayjs(values.periode_month).format('MM/YYYY'),
        };
        await update.mutateAsync({ id, payload: values });
        showNotification('success', 'Berhasil', 'Berhasil Edit Data');
        setTimeout(() => {
          navigate('/sales-plan');
        }, 2000);
      }
      form.resetFields();
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Gagal', message);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      value_rkap: data?.value_rkap,
      unitId: data?.unitId,
      periode_month: dayjs(data?.periode_month, 'MM/YYYY'),
    });
  }, [data]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  if (isError) {
    return <AlertCustome />;
  }
  return (
    <Card
      title={<TitleCardEdit title="Edit Rencana Penjualan" />}
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
                disabled={update.isPending}
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
                disabled={isLoading || update.isPending || unit.loading}
                picker="month"
                style={{ width: '100%' }}
                format={'MM/YYYY'}
                placeholder="Periode Bulan"
              />
            </Form.Item>
          </Col>
        </Row>

        <Flex gap="small">
          <Buttonback loading={isLoading || update.isPending} />
          <ButtonEdit loading={isLoading || update.isPending} />
        </Flex>
      </Form>
    </Card>
  );
}
