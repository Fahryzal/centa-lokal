import { FilePdf } from '@phosphor-icons/react';
import { Card, Button, Form, Flex, Table, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import * as OrderPraAxios from '@pages/marketing/order-pra/service/OrderPraAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
import { generatePurchaseOrderPDF } from '@/utils/generatePdf/generatePurchaseOrderPDF';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import Buttonback from '@/components/atoms/button/buttonBack';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import * as generateExcel from '@/utils/generateExcel/RN/generateExcelPO_RN';
import { showNotification } from '@/contexts/services/notificationService';
import AdditionalChargesForm from '../Components/AdditionalChargesForm';
import api from '@/api/axiosInstance';
import dayjs from 'dayjs';
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default function OrderEksporPRNDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataPO, setDataPO] = useState<OrderPraInterfaces.PurchaseOrderData | null>(null);
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

  const [dataSourceItems, setDataSourceItems] = useState<any>([]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      type Product = {
        productId: string;
        quantity: number;
        unitPrice: number;
        price: number;
      };

      function hitungTotalHarga(products: Product[]): number {
        return products.reduce((total, product) => {
          return total + product.quantity * (product.unitPrice || product.price);
        }, 0);
      }
      const picked = dataSourceItems
        .filter((item: any) => item.productId)
        .map(({ productId, quantity, unitPrice }: any) => ({
          productId,
          quantity,
          unitPrice,
        }));
      values = {
        ...values,
        description: '-',
        subtotalAmount: hitungTotalHarga(dataSourceItems),
        items: picked,
      };
      if (id) {
        await OrderPraAxios.updateOrderPra(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Ubah Data');
        setTimeout(() => {
          navigate('/po-order-prn-ekspor');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Ubah Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, OrderPraAxios.fetchDataUnit, [unit.nama]);
  globalHooks.useFetchOptions(customer, setCustomer, OrderPraAxios.fetchDataCustomer, [
    customer.name,
  ]);

  useEffect(() => {
    getDataCode();
    getDataPurchaseOrderPradId();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await OrderPraAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const getDataPurchaseOrderPradId = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = await OrderPraAxios.fetchDataOrderPraById(id);
        setDataPO(data);
        setDataSourceItems(data?.items || []);
        form.setFieldsValue({
          orderNumber: data.orderNumber,
          customerId: `${data.customerId}$${data.customerName}`,
          date: globalHelpers.dateFormat(data.date),
          description: data.description,
          franco: data.franco,
          subtotalAmount: data.subtotalAmount,
          address: data?.customer?.address,
          customerName: data?.customerName,
          downPayment: Number(data?.downPayment || 0),
        });
        formAdd.setFieldValue('additionalCharges', data?.additionalCharges);
      }
      setLoading(false);
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
      setLoading(false);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarangProduct',
      key: 'kodeBarangProduct',
      align: 'center',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namabarangProduct',
      key: 'namabarangProduct',
      align: 'center',
    },
    {
      title: 'Satuan',
      dataIndex: 'satuanProduct',
      key: 'satuanProduct',
      align: 'center',
    },
    {
      title: 'Spesifikasi',
      dataIndex: 'spesifikasiProduct',
      key: 'spesifikasiProduct',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unitProduct',
      key: 'unitProduct',
      align: 'center',
    },
    {
      title: 'Jumlah Barang',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
  ];

  const onDownloadPdfPO = () => {
    // return
    if (dataPO) {
      const url = generatePurchaseOrderPDF(dataPO, 'PURCHASE ORDER', '$');
      window.open(url.url, '_blank');
    }
  };

  const handleOpenFile = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(dataPO?.fileUrl);
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

  const handleOpenFileKontrak = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(dataPO?.fileUrlKontrak);
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

  const handleOpenFileEkspor = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(dataPO?.fileUrlEkspor);
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

  const handleOpenFileProduksi = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(dataPO?.fileUrlProduksi);
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

  const handleOpenFileBL = async () => {
    try {
      const data = await OrderPraAxios.getFileOrderPra(dataPO?.fileUrlBl);
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

  const previewMergedPdf = async () => {
    try {
      const dataMerge = [
        dataPO?.fileUrlEkspor,
        dataPO?.fileUrl,
        dataPO?.fileUrlKontrak,
        dataPO?.fileUrlProduksi,
        dataPO?.fileUrlBl,
      ].filter(Boolean);
      const params = new URLSearchParams();
      dataMerge.forEach((url) => params.append('urls', url as string));
      const finalUrl = `/api/v1/files-upload/merged?${params.toString()}`;
      setLoading(true);
      const response = await api.get(finalUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = generatePurchaseOrderPDF(dataPO as any, 'PURCHASE ORDER');
      globalHelpers.mergePdfBlobs([blob, url.blob]);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      showNotification('warning', 'Gagal', 'Gagal Merge File');
    }
  };

  return (
    <Card
      title={<TitleCardDetail title="Detail Pesanan (RN Ekspor)" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: 8,
            padding: 10,
          }}
        >
          <ButtonFile
            disabled={!dataPO?.fileUrlProduksi}
            text="Cetak Packing List & COA"
            color="lime"
            icon={<FilePdf />}
            onClick={() => handleOpenFileProduksi()}
          />

          <ButtonFile
            disabled={!dataPO?.fileUrlEkspor}
            text="PI/SI/PBE/NE"
            color="lime"
            icon={<FilePdf />}
            onClick={() => handleOpenFileEkspor()}
          />

          <ButtonFile
            text="Cetak Bukti Pesanan"
            color="danger"
            icon={<FilePdf />}
            onClick={() => handleOpenFile()}
          />
          <ButtonFile
            text="Cetak Kontrak"
            color="gold"
            icon={<FilePdf />}
            onClick={() => handleOpenFileKontrak()}
          />
          <ButtonFile color="blue" text="Cetak Pesanan" onClick={onDownloadPdfPO} />
          <ButtonFile
            text="Download Excel"
            icon={<FileExcelOutlined />}
            onClick={() => generateExcel.handleExportPO_RN(dataPO as any)}
          />
          <ButtonFile
            text="File BL"
            color="orange"
            icon={<FilePdf />}
            onClick={() => handleOpenFileBL()}
          />

          <ButtonFile
            loading={loading}
            text="Merge PDF"
            icon={<FilePdf />}
            onClick={() => previewMergedPdf()}
          />
        </div>
      }
    >
      <Card
        title={<TitleCardItems title="Detail Pesanan" />}
        style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Pesanan">
            {form.getFieldValue('orderNumber')}
          </Descriptions.Item>
          <Descriptions.Item label="Keterangan">
            {form.getFieldValue('description')}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {form.getFieldValue('customerName')}
          </Descriptions.Item>
          <Descriptions.Item label="Franco">{form.getFieldValue('franco')}</Descriptions.Item>
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
              <p>$. {globalHelpers.currencyFormatter(form.getFieldValue('subtotalAmount') || 0)}</p>
              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangDollar(form.getFieldValue('subtotalAmount') || 0)}
              </p>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Pesanan">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>

          <Descriptions.Item label="Telah dibayarkan">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p>$. {globalHelpers.currencyFormatter(form.getFieldValue('downPayment') || 0)}</p>
              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangDollar(form.getFieldValue('downPayment') || 0)}
              </p>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

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
          marginTop: 10,
        }}
        onFinish={onFinish}
      >
        <Card
          title={<TitleCardItems title="Item Pesanan" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}
          >
            <Button type="primary" htmlType="button" disabled style={{ width: 150 }}>
              Tambah Items
            </Button>
          </div>
          <Table<DataType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>
        <AdditionalChargesForm disabled={true} form={formAdd} totalBarang={0} />
        <Flex gap="small">
          <Buttonback loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
