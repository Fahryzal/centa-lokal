import { ArrowLeft, FilePdf } from '@phosphor-icons/react';
import { Card, Button, Form, Flex, Table, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import * as DeliveryOrderPraAxios from '@pages/marketing/delivery-order-pra/service/DeliveryOrderPraAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
import { generateRADeliveryOrderPDF } from '@/utils/generatePdf/generateRADeliveryOrderPDF';
import { FileExcelOutlined } from '@ant-design/icons';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import * as generateForms from '@/utils/generatePdf/generateForms';
import { handleExportDO_RA } from '@/utils/generateExcel/RA/generateExcelDO_RA';
import { showNotification } from '@/contexts/services/notificationService';
import api from '@/api/axiosInstance';
import { openUrl } from '@/utils/func/func';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default function DeliveryOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataPO, setDataPO] = useState<OrderPraInterfaces.PurchaseOrderData | null>(null);
  const [dataDeliveryOrder, setDataDeliveryOrder] = useState<any>(null);

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
        await DeliveryOrderPraAxios.updateDeliveryOrderPra(id, values);

        showNotification('success', 'Berhasil', 'Berhasil Ubah Data');

        setTimeout(() => {
          navigate('/delivery-order-pra');
        }, 2000);

        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'agal Ubah Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, DeliveryOrderPraAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, DeliveryOrderPraAxios.fetchDataCustomer, [
    customer.name,
  ]);

  useEffect(() => {
    getDataCode();
    getDataSalesOrderPradId();
  }, []);

  const getDataCode = async () => {
    setLoading(true);

    const data = await DeliveryOrderPraAxios.fetchGenCodePo();

    form.setFieldsValue({
      orderNumber: data.code,
    });

    setLoading(false);
  };

  const getDataSalesOrderPradId = async () => {
    try {
      if (id) {
        setLoading(true);

        const data = await DeliveryOrderPraAxios.fetchDataDeliveryOrderPraById(id);

        setDataPO(data.purchaseOrder);
        setDataDeliveryOrder(data);

        const deliveryOrderDetails = data?.DeliveryOrderDetail ?? [];
        const isNewData = deliveryOrderDetails.length > 0;

        const totalAmountHeader = isNewData
          ? (data?.totalAmount ?? 0)
          : (data?.purchaseOrder?.subtotalAmount ?? 0);

        if (deliveryOrderDetails.length > 0) {
          const deliveryOrderTotalAmount = data?.totalAmount ?? 0;

          const dataNew = deliveryOrderDetails.map((item: any) => ({
            ...item,
            ...item.MasterBarangJadi,
            qtyKirim: item.qtyKirim,
            au58Number: data?.au58?.documentNumber ?? '-',
            au58Date: data?.au58?.au58Date ?? null,
            deliveryOrderTotalAmount,
            deliveryOrderCreatedAt: data?.createdAt ?? null,
          }));

          setDataSourceItems(dataNew);
        } else {
          const purchaseOrderTotalAmount = data?.purchaseOrder?.subtotalAmount ?? 0;

          const dataNew = (data?.purchaseOrder?.items ?? []).map((item: any) => ({
            ...item,
            ...item.product,
            au58Number: data?.au58?.documentNumber ?? '-',
            au58Date: data?.au58?.au58Date ?? null,
            deliveryOrderTotalAmount: purchaseOrderTotalAmount,
            deliveryOrderCreatedAt: data?.createdAt ?? null,
            qtyKirim: null,
          }));

          setDataSourceItems(dataNew);
        }

        form.setFieldsValue({
          orderNumber: data?.purchaseOrder?.orderNumber,
          customerId: data?.purchaseOrder?.customerId,
          customerName: data?.purchaseOrder?.customerName,
          date: globalHelpers.dateFormat(data?.purchaseOrder?.date),
          description: data?.purchaseOrder?.description,
          franco: data?.purchaseOrder?.franco,
          status: data?.status,
          totalAmount: totalAmountHeader,
          address: data?.purchaseOrder?.customer?.address,
          au58Number: data?.au58?.documentNumber,
          au58Date: data?.au58?.au58Date,
          createdAt: data?.createdAt ?? null,
        });
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kode Barang',
      key: 'kodeBarangProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return record.kodeBarangProduct ?? record.kodeBarang ?? '-';
      },
    },
    {
      title: 'Nama Brg',
      key: 'namabarangProductInvoice',
      align: 'center',
      render: (_: any, record: any) => {
        return record.namabarangProductInvoice ?? '-';
      },
    },
    {
      title: 'Harga',
      key: 'priceProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span>
            Rp
            {globalHelpers.currencyFormatter(record.priceProduct || 0)}
          </span>
        );
      },
    },
    {
      title: 'Satuan',
      key: 'satuanProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return record.satuanProduct ?? '-';
      },
    },
    {
      title: 'Spesifikasi',
      key: 'spesifikasiProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return record.spesifikasiProduct ?? '-';
      },
    },
    {
      title: 'Unit',
      key: 'unitProduct',
      align: 'center',
      render: (_: any, record: any) => {
        return record.unitProduct ?? '-';
      },
    },
    {
      title: 'Jumlah Brg',
      key: 'quantity',
      align: 'center',
      render: (_: any, record: any) => {
        return globalHelpers.currencyFormatter(record.quantity || 0);
      },
    },
    {
      title: 'QTY',
      key: 'qtyKirim',
      align: 'center',
      render: (_: any, record: any) => {
        return record.qtyKirim === null || record.qtyKirim === undefined
          ? '-'
          : globalHelpers.currencyFormatter(record.qtyKirim);
      },
    },
  ];

  const onDownloadPdfPO = () => {
    if (dataDeliveryOrder) {
      const result = generateRADeliveryOrderPDF(dataDeliveryOrder, 'DELIVERY ORDER');
      openUrl(result.url);
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

      const response = await api.get(finalUrl, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      const url = generateForms.generateAU58DoRA(dataDeliveryOrder);

      globalHelpers.mergePdfBlobs([blob, url.blob]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      showNotification('warning', 'Gagal', 'Gagal Merge File');
    }
  };

  return (
    <Card
      title={<TitleCardDetail title="Detail Pengiriman Pesanan (PRA)" />}
      style={{
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
      extra={
        <div
          style={{
            display: 'flex',
            gap: 5,
          }}
        >
          <ButtonFile color="blue" text="Cetak DO" onClick={onDownloadPdfPO} />

          <ButtonFile
            color="danger"
            text="Cetak AU-58"
            onClick={() => {
              const data = generateForms.generateAU58DoRA(dataDeliveryOrder);

              window.open(data.url, '_blank');
            }}
          />

          <ButtonFile
            color="green"
            icon={<FileExcelOutlined />}
            text="Download Excel"
            onClick={() => handleExportDO_RA(dataPO as any, dataDeliveryOrder)}
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
        title={<TitleCardItems title="Detail Pengiriman" />}
        style={{
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
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
              <p>Rp. {globalHelpers.currencyFormatter(form.getFieldValue('totalAmount') || 0)}</p>

              <p
                style={{
                  color: 'green',
                }}
              >
                {globalHelpers.terbilangRupiah(form.getFieldValue('totalAmount') || 0)}
              </p>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal Pesanan">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>

          <Descriptions.Item label="No AU58">
            {form.getFieldValue('au58Number') || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal AU58">
            {form.getFieldValue('au58Date')
              ? dayjs(form.getFieldValue('au58Date')).format('DD/MM/YYYY')
              : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {form.getFieldValue('createdAt')
              ? dayjs(form.getFieldValue('createdAt')).format('DD/MM/YYYY')
              : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Form
        layout="vertical"
        form={form}
        name="login"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 20,
        }}
        onFinish={onFinish}
      >
        <Card
          title={<TitleCardItems title="Pesanan Item" />}
          style={{
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table<DataType>
            columns={columns}
            dataSource={dataSourceItems}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>

        <Flex gap="small">
          <Button
            loading={loading}
            onClick={() => navigate(-1)}
            color="green"
            htmlType="button"
            icon={<ArrowLeft />}
            style={{
              width: '150px',
            }}
          >
            Back
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}
