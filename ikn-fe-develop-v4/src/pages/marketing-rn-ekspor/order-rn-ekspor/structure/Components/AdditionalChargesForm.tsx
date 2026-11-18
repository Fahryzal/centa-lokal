import React, { useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Select,
  Typography,
  Divider,
  FormInstance,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as globalHelpers from '@/utils/helper';

const { Option } = Select;
const { Text } = Typography;

interface Props {
  totalBarang: number;
  defaultInsuranceRate?: number; // input 1 artinya 1%
  form: FormInstance;
  disabled?: boolean;
}

const AdditionalChargesForm: React.FC<Props> = ({
  totalBarang,
  defaultInsuranceRate = 1.5, // default 1.5%
  form,
  disabled = false,
}) => {
  const handleAutoUpdateInsurance = () => {
    const charges = form.getFieldValue('additionalCharges') || [];
    const updatedCharges = [...charges];
    form.setFieldsValue({ additionalCharges: updatedCharges });
  };

  useEffect(() => {
    handleAutoUpdateInsurance();
  }, [totalBarang]);

  return (
    <Form
      form={form}
      name="additionalChargesForm"
      layout="vertical"
      initialValues={{ insuranceRate: defaultInsuranceRate }}
    >
      <Divider orientation="left">Biaya Tambahan</Divider>
      <Form.List name="additionalCharges">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  rules={[{ required: true, message: 'Isi deskripsi' }]}
                >
                  <Input disabled={disabled} placeholder="Deskripsi (misal: Freight Jakarta)" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'type']}
                  rules={[{ required: true, message: 'Pilih jenis biaya' }]}
                >
                  <Select
                    disabled={disabled}
                    placeholder="Jenis"
                    style={{ width: 120 }}
                    onChange={handleAutoUpdateInsurance}
                  >
                    <Option value="freight">Freight</Option>
                    <Option value="insurance">Insurance</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'amount']}
                  rules={[{ required: true, message: 'Masukkan nilai' }]}
                >
                  <InputNumber
                    disabled={disabled}
                    placeholder="$"
                    min={0}
                    style={{ width: 120 }}
                    formatter={globalHelpers.formatter}
                    parser={globalHelpers.parser}
                  />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                disabled={disabled}
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Tambah Biaya Tambahan
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Text type="secondary">
        *Biaya asuransi akan dihitung otomatis sebesar{' '}
        <strong>{form.getFieldValue('insuranceRate') || defaultInsuranceRate}%</strong> dari total
        nilai barang (Rp {totalBarang.toLocaleString('id-ID')}). Nilai tetap bisa diedit manual.
      </Text>
    </Form>
  );
};

export default AdditionalChargesForm;
