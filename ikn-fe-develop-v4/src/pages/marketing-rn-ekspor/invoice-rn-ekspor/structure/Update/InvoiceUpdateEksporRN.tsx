import { Calculator, Eye, FilePdf, Note, TagChevron, User } from '@phosphor-icons/react';
import {
  Card,
  Form,
  Row,
  Col,
  Flex,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Upload,
  Button,
} from 'antd';
import { useEffect, useState } from 'react';
import * as InvoiceEksporRNAxios from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/service/InvoiceEksporRNAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import { DollarCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Buttonback from '@/components/atoms/button/buttonBack';
import ButtonAdd from '@/components/atoms/button/buttonAdd';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import { showNotification } from '@/contexts/services/notificationService';
import AdditionalChargesForm from '../Components/AdditionalChargesForm';
import * as InvoiceEksporRNInterfaces from '@/pages/marketing-rn-ekspor/invoice-rn-ekspor/interface/InvoiceEksporRNInterfaces';
import TextTerbilangDollar from '@/components/atoms/Text/TextTerbilangDollar';
import { paymentOptions } from '@/utils/conts';
import * as OrderRNAxios from '@pages/marketing-rn/order-rn/service/OrderRNAxios';
import dayjs from 'dayjs';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { handleDate } from '@/utils/func/func';

export default function InvoiceUpdateEksporRN() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [form] = Form.useForm<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>();
  const [formAsuransi] = Form.useForm<{ costSummary: InvoiceEksporRNInterfaces.CostSummaryType }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: '',
  });
  useEffect(() => {
    getDataCode();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await InvoiceEksporRNAxios.fetchGenCodeInvoice();
    form.setFieldsValue({
      invoiceNumber: data.code,
    });
    setLoading(false);
  };

  const onFinish = async (values: InvoiceEksporRNInterfaces.PayloadInvoiceEksporType) => {
    try {
      setLoading(true);
      try {
        values = {
          ...values,
          ...formAsuransi.getFieldsValue(),
          date: handleDate(values.date as any) as any,
        };
        if (values?.fileUrl) {
          const formData = new FormData();
          const originalFile = values.fileUrl.originFileObj;
          // Ganti nama file
          const renamedFile = new File(
            [originalFile],
            `${Date.now()}-${originalFile.name}`, // nama file baru
            { type: originalFile.type }
          );

          values = {
            ...values,
            fileUrl: renamedFile.name as any,
          };
          formData.append('file', renamedFile);
          await OrderRNAxios.uploadFileOrderPra(formData);
        }
      } catch (e) {
        throw new Error('Failed to upload file');
      }
      if (!id) {
        throw new Error('ID not found');
      }
      const { fileUrlRes, ...resultValue } = values;
      await InvoiceEksporRNAxios.updateInvoice(id, resultValue);
      showNotification('success', 'Berhasil', 'Berhasil Edit Data');
      setTimeout(() => {
        navigate('/invoice-rn-ekspor');
      }, 2000);
      setLoading(false);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Menambahkan Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, InvoiceEksporRNAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, InvoiceEksporRNAxios.fetchDataCustomer, [
    customer.name,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (id) {
        const data = await InvoiceEksporRNAxios.fetchDataInvoiceById(id);
        form.setFieldsValue({
          currency: data?.currency,
          customerId: data?.customerId,
          incoterms: data?.incoterms as 'CIF' | 'FOB',
          typePayment: data?.typePayment as any,
          description: data?.description,
          downPayment: data?.downPayment as any,
          totalCIF: data?.totalCIF,
          costSummary: data?.costSummary as any,
          purchaseOrder: data?.purchaseOrder,
          proformaNumber: data?.proformaNumber,
          date: dayjs(data?.date),
          customerName: data?.customer.name,
          address: data?.customer.address,
          fileUrlRes: data?.fileUrl,
        });

        const resultDataSummary = data?.costSummary.map((item) => ({
          amount: item.amount,
          description: item.description,
          type: item.type,
        }));

        formAsuransi.setFieldValue('costSummary', resultDataSummary);
      } else {
        showNotification('warning', 'Peringatan', 'ID invoice tidak ditemukan');
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Mendapatkan Data');
    }
  };

  const onSearcCustomer = globalHooks.useDebounce((searchText: string) => {
    setCustomer((prev) => ({ ...prev, name: searchText }));
  }, 1000);
  const tipePembayaran = Form.useWatch('typePayment', form);

  const handleOpenFile = async () => {
    const fileUrl = form.getFieldValue('fileUrlRes');
    try {
      const data = await OrderPraAxios.getFileOrderPra(fileUrl);
      if (data) {
        const link = document.createElement('a');
        link.href = data;
        link.target = '_blank';
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Buat Invoices (RN Ekspor)" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
        onFinish={onFinish}
      >
        {/* hide */}
        <Form.Item
          label="fileUrlRes"
          name="fileUrlRes"
          style={{ display: 'none' }}
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>
        <Card
          title={<TitleCardItems title="Detail Invoice" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          {' '}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Pelanggan"
                name="customerId"
                rules={[{ required: true, message: 'Masukan Pelanggan!' }]}
              >
                <Select
                  prefix={<User />}
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih customer"
                  optionFilterProp="label"
                  onChange={() => setCustomer((prev) => ({ ...prev, name: '' }))}
                  onSearch={onSearcCustomer}
                  options={globalHelpers.toAntdOptionsV2(customer.data || [], 'id', 'name')}
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Incoterm"
                name="incoterms"
                rules={[{ required: true, message: 'Masukan incoterms!' }]}
              >
                <Select
                  prefix={<User />}
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih incoterms"
                  optionFilterProp="label"
                  options={[
                    {
                      label: 'CIF',
                      value: 'CIF',
                    },
                    {
                      label: 'FOB',
                      value: 'FOB',
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Tanggal Invoice"
                name="date"
                rules={[{ required: true, message: 'Masukan tanggal invoice!' }]}
                getValueFromEvent={(date) => {
                  // simpan ke form dalam format string tanpa timezone
                  return date ? date.format('YYYY-MM-DD') : null;
                }}
                getValueProps={(value) => {
                  // ubah dari string ke dayjs agar tampil di DatePicker
                  return {
                    value: value ? dayjs(value, 'YYYY-MM-DD') : undefined,
                  };
                }}
              >
                <DatePicker
                  prefix={<Calculator />}
                  style={{ width: '100%' }}
                  placeholder="Tanggal invoice"
                  format={'YYYY-MM-DD'}
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Tipe Pembayaran"
                name="typePayment"
                rules={[{ required: true, message: 'Tipe Pembayaran!' }]}
              >
                <Select
                  showSearch
                  loading={unit.loading}
                  placeholder="Pilih Tipe Pembayaran"
                  optionFilterProp="label"
                  options={paymentOptions}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                label="Upload Invoice"
                name="fileUrl"
                valuePropName="fileUrl"
                extra={
                  <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                    <li
                      style={{
                        color: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 4,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={handleOpenFile}
                    >
                      <Eye style={{ marginRight: 8 }} /> Lihat PDF
                    </li>
                    <li style={{ color: '#52c41a', display: 'flex', alignItems: 'center' }}>
                      <FilePdf style={{ marginRight: 8 }} /> File harus PDF
                    </li>
                  </ul>
                }
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList?.[0]; // Ambil file pertama saja
                }}
                rules={[{ required: false }]}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Pilih File</Button>
                </Upload>
              </Form.Item>

              {(tipePembayaran === 'DOWNPAYMENT' ||
                tipePembayaran === 'FULLPAYMENT_BEFORE_INVOICE' ||
                tipePembayaran === 'OTHER') && (
                <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                  label="Jumlah Di Bayarkan"
                  name="downPayment"
                  rules={[{ required: true, message: 'Jumlah dibayarkan total!' }]}
                  extra={<TextTerbilangDollar properti="downPayment" form={form} />}
                >
                  <InputNumber
                    prefix={<DollarCircleOutlined />}
                    formatter={globalHelpers.formatter}
                    parser={globalHelpers.parser}
                    controls={false}
                    style={{ width: '100%', borderRadius: 8 }}
                    placeholder="Jumlah di Bayarkan"
                  />
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Nomor Invoice"
                style={{ flex: 1, width: '100%' }}
                name="invoiceNumber"
                rules={[{ required: true, message: 'Masukan nilai Nomor Invoice!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nilai Invoice Number"
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Nomor Performa"
                style={{ flex: 1, width: '100%' }}
                name="proformaNumber"
                rules={[{ required: true, message: 'Masukan Nomor Performa!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Performa"
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Keterangan"
                name="description"
                rules={[{ required: true, message: 'Masuka Keterangan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<Note size={16} />}
                  placeholder="Keterangan"
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Nomor Pesanan"
                style={{ flex: 1, width: '100%' }}
                name="purchaseOrder"
                rules={[{ required: true, message: 'Masukan Pesanan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Pesanan"
                />
              </Form.Item>

              <Form.Item<InvoiceEksporRNInterfaces.PayloadInvoiceEksporType>
                label="Total Tagihan"
                name="totalCIF"
                rules={[{ required: true, message: 'Masukan Total Amount!' }]}
                extra={<TextTerbilangDollar properti="totalCIF" form={form} />}
              >
                <InputNumber
                  controls={false}
                  formatter={globalHelpers.formatter}
                  parser={globalHelpers.parser}
                  style={{ width: '100%' }}
                  prefix={<DollarCircleOutlined size={16} />}
                  placeholder="Total Amount"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title={<TitleCardItems title="Detail Invoice" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <AdditionalChargesForm totalBarang={10} form={formAsuransi} />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
          <ButtonAdd loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
