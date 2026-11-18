import { Card, Form, Flex, Table, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';
import { useNavigate, useParams } from 'react-router';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import type { TableColumnsType } from 'antd';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import Buttonback from '@/components/atoms/button/buttonBack';
import * as SpbsInterfaces from '@pages/akuntansi/spbs/interface/SpbsInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import dayjs from 'dayjs';

export default function SpbsDetail({ dataBasic }: { dataBasic: any }) {
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

  const [customer, setCustomer] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    name: '',
  });

  const [dataSourceItems, setDataSourceItems] = useState<SpbsInterfaces.ItemsSPBType[]>([]);

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
        .filter((item) => item.productId)
        .map(({ productId, quantity, unitPrice }: any) => ({
          productId,
          quantity,
          unitPrice,
        }));
      values = {
        ...values,
        description: '-',
        subtotalAmount: hitungTotalHarga(dataSourceItems as any),
        items: picked,
      };
      if (id) {
        await SpbsAxios.updateSpbs(id, values);
        showNotification('success', 'Berhasil', 'Berhasil Ubah Data');
        setTimeout(() => {
          navigate('/po-order-pra');
        }, 2000);
        setLoading(false);
        form.resetFields();
      }
    } catch (e) {
      setLoading(false);
      showNotification('error', 'Gagal', 'Gagal Ubah Data');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, SpbsAxios.fetchDataUnit, [unit.nama]);

  globalHooks.useFetchOptions(customer, setCustomer, SpbsAxios.fetchDataCustomer, [customer.name]);

  useEffect(() => {
    getDataCode();
    getDataSalesOrderPradId();
  }, []);

  const getDataCode = async () => {
    setLoading(true);
    const data = await SpbsAxios.fetchGenCodePo();
    form.setFieldsValue({
      orderNumber: data.code,
    });
    setLoading(false);
  };

  const getDataSalesOrderPradId = async () => {
    try {
      if (id) {
        setLoading(true);
        const data = dataBasic?.spb || {};
        setDataSourceItems(data?.itemsSPB || []);
        form.setFieldsValue({
          orderNumber: data.orderNumber,
          customerId: data.customerName,
          date: globalHelpers.dateFormat(data.date),
          tanggalPengiriman: globalHelpers.dateFormat(data?.tanggalPengiriman),
          description: data.description,
          franco: data.franco,
          status: data.status,
        });
      }
      setLoading(false);
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan!');
      setLoading(false);
    }
  };

  const columns: TableColumnsType<SpbsInterfaces.ItemsSPBType> = [
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
      title: 'Keterangan',
      dataIndex: 'namabarangProductInvoice',
      key: 'namabarangProductInvoice',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'priceProduct',
      key: 'priceProduct',
      align: 'center',
      render: (priceProduct) => {
        return <span>Rp{globalHelpers.currencyFormatter(priceProduct || 0)}</span>;
      },
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
      title: 'Stok',
      dataIndex: 'stockProduct',
      key: 'stockProduct',
      align: 'center',
      render: (stockProduct: number) => {
        return <span>{globalHelpers.currencyFormatter(stockProduct)}</span>;
      },
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
      render: (_: any, record: any) => {
        return <span>{globalHelpers.currencyFormatter(record.quantity)}</span>;
      },
    },
  ];

  return (
    <Card
      title={<TitleCardDetail title="Detail SPBS" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
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
          <Descriptions.Item label="Customer">{form.getFieldValue('customerId')}</Descriptions.Item>
          <Descriptions.Item label="Franco">{form.getFieldValue('franco')}</Descriptions.Item>

          <Descriptions.Item label="Tanggal Pengiriman">
            {dayjs(form.getFieldValue('tanggalPengiriman')).format('DD/MMMM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Pesanan">
            {dayjs(form.getFieldValue('date')).format('DD/MMMM/YYYY')}
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
          title={<TitleCardItems title="Pesanan Item" />}
          style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          <Table<SpbsInterfaces.ItemsSPBType>
            columns={columns}
            dataSource={dataSourceItems}
            scroll={{ x: 'max-content' }}
          />{' '}
        </Card>
        <Flex gap="small">
          <Buttonback loading={loading} />
        </Flex>
      </Form>
    </Card>
  );
}
