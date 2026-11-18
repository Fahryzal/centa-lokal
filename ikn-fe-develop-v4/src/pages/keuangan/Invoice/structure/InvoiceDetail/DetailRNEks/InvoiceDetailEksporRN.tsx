import { Card, Form, Flex, Divider, Descriptions, Space } from 'antd';
import { useEffect, useState } from 'react';
import * as InvoiceEksporRNAxios from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/service/InvoiceEksporRNAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardAdd from '@/components/atoms/Cards/titleCardAdd';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { showNotification } from '@/contexts/services/notificationService';
import * as InvoiceEksporRNInterfaces from '@/pages/marketing-rn-ekspor/invoice-rn-ekspor/interface/InvoiceEksporRNInterfaces';
import dayjs from 'dayjs';
import ModalNumberAccount from './ModalNumberAccount/ModalNumberAccount';
import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import { handleMessageError } from '@/utils/func/func';
import AdditionalChargesForm from './Components/AdditionalChargesForm';

export default function InvoiceDetailEkpsorRNFinance() {
  const navigate = useNavigate();
  const [form] = Form.useForm<
    InvoiceEksporRNInterfaces.PayloadInvoiceEksporType | InvoiceEksporRNInterfaces.ShippingInfoType
  >();
  const [formInv] = Form.useForm();
  const [formAsuransi] = Form.useForm<{ costSummary: InvoiceEksporRNInterfaces.CostSummaryType }>();
  const { id } = useParams();
  const [open, setOpen] = useState<boolean>(false);

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
  const [dataSourceItems, setDataSourceItems] = useState<InvoiceEksporRNInterfaces.ItemType[]>([]);
  const [urlFile, setUrlfFile] = useState<string | null>(null);

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
    const payload: any = {
      ...values,
      ...formAsuransi.getFieldsValue(),
      items: dataSourceItems.map((item) => ({
        ...item,
        unitPrice: item.priceProduct,
      })),
    };

    const payloadAfterFormat: any = {
      shippingInfo: {},
    };

    Object.keys(payload).forEach((key) => {
      if (
        [
          'vesselName',
          'sailingDate',
          'loadingPort',
          'destinationPort',
          'lcNumber',
          'issuedBy',
        ].includes(key)
      ) {
        payloadAfterFormat.shippingInfo[key] = payload[key];
      } else {
        payloadAfterFormat[key] = payload[key];
      }
    });
    try {
      setLoading(true);
      await InvoiceEksporRNAxios.posInvoiceEkspor(payloadAfterFormat);
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
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
        });
        setUrlfFile(data?.fileUrl || null);
        setDataSourceItems(data?.items || ([] as any));
        formAsuransi.setFieldValue('costSummary', data?.costSummary);
      } else {
        showNotification('warning', 'Peringatan', 'ID invoice tidak ditemukan');
      }
    } catch (e) {
      showNotification('error', 'Gagal', 'Gagal Mendapatkan Data');
    }
  };

  const handleRowDoubleClick = (record: MasterAkunBankInterfaces.DataBankAccountType) => {
    formInv.setFieldsValue({
      bankAccountNumber: record.bankAccountNumber,
      bankName: record.bankName,
    });
    setOpen(false);
  };

  const handleOpenFile = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(urlFile);
      if (data) {
        // Creating a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = data; // Assuming data is a valid URL to the file
        link.target = '_blank'; // Opens the file in a new tab/window
        link.setAttribute('download', ''); // Adds the download attribute for compatibility

        // Triggering click event to initiate download
        document.body.appendChild(link);
        link.click();

        // Removing the temporary anchor element
        document.body.removeChild(link);
      }
    } catch (error) {
      const message = handleMessageError(error);
      showNotification('error', 'Terjadi Kessalahan', message);
      // Handle error state, e.g., show a message to the user
    }
  };

  return (
    <Card
      title={<TitleCardAdd title="Buat Invoices (RN Ekspor)" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={
        <div
          style={{
            display: 'flex',
            gap: 5,
          }}
        >
          {/* <ButtonFile text="Cetak Invoice" onClick={() => generateInvoiceEkpsorPDF()} /> */}
          <ButtonFile text="Cetak Invoice" onClick={() => handleOpenFile()} />
        </div>
      }
    >
      <ModalNumberAccount
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
      />

      {/* <Card
        title={<TitleCardItems title="Detail Invoice" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          layout="vertical"
          form={formInv}
          name="login"
          initialValues={{ remember: true }}
          style={{
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Form.Item
                  label="Pilih Bank"
                  style={{ flex: 1, width: '100%' }}
                  name="bankName"
                  rules={[{ required: true, message: 'Masukan nilai nomor pesanan!' }]}
                >
                  <Input
                    disabled
                    style={{ width: '100%' }}
                    prefix={<TagChevron size={16} />}
                    placeholder="Nomor pesanan"
                  />
                </Form.Item>

                <Tooltip title="search">
                  <Button
                    shape="circle"
                    type="primary"
                    onClick={() => setOpen(true)}
                    icon={<SearchOutlined />}
                  />
                </Tooltip>
              </div>

              <Form.Item
                label="No. Rekening"
                style={{ flex: 1, width: '100%' }}
                name="bankAccountNumber"
                rules={[{ required: true, message: 'Masukan Rekening!' }]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nomor Rekening"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Nama TTD"
                style={{ flex: 1, width: '100%' }}
                name="ttdName"
                rules={[{ required: true, message: 'Masukan Nama TTD!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Nama TTD"
                />
              </Form.Item>

              <Form.Item
                label="Jabatan"
                style={{ flex: 1, width: '100%' }}
                name="jabatan"
                rules={[{ required: true, message: 'Masukan Jabatan!' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  prefix={<TagChevron size={16} />}
                  placeholder="Jabatan"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card> */}

      <Divider />
      <Card
        title={<TitleCardItems title="Detail Invoice" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Invoice">
            {form.getFieldValue('invoiceNumber')}
          </Descriptions.Item>
          <Descriptions.Item label="Nomor Performa">
            {form.getFieldValue('proformaNumber')}
          </Descriptions.Item>
          <Descriptions.Item label="Nomor Pesanan">
            {form.getFieldValue('purchaseOrder')}
          </Descriptions.Item>
          <Descriptions.Item label="Keterangan">
            {form.getFieldValue('description')}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {form.getFieldValue('customerName')}
          </Descriptions.Item>
          <Descriptions.Item label="Incoterm">{form.getFieldValue('incoterms')}</Descriptions.Item>
          <Descriptions.Item label="Alamat Customer" style={{ maxWidth: 200 }}>
            {form.getFieldValue('address')}
          </Descriptions.Item>
          <Descriptions.Item label="Harga Total">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>$. {globalHelpers.currencyFormatter(form.getFieldValue('totalCIF') || 0)}</p>
              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangDollar(form.getFieldValue('totalCIF') || 0)}
              </p>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Invoice">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Pesanan">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Space />
      <Form
        layout="vertical"
        form={form as any}
        name="login"
        initialValues={{ remember: true }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 10,
        }}
        onFinish={onFinish}
      >
        <Card
          title={<TitleCardItems title="Detail Invoice" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <AdditionalChargesForm totalBarang={10} form={formAsuransi} disabled={true} />
        </Card>

        <Flex gap="small">
          <Buttonback loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
