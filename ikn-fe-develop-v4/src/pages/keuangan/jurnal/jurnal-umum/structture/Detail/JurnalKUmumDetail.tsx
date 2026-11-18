import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router';
import * as JurnalKhususAxios from '@pages/keuangan/jurnal/jurnal-khusus/service/JurnalKhususAxios';
import Buttonback from '@/components/atoms/button/buttonBack';
import { SaveOutlined } from '@ant-design/icons';
import * as JurnalHeaderInterfaces from '@pages/keuangan/jurnal/jurnal-khusus/interface/JurnalHeaderInterfaces';
import { useDebounce, useFetchOptions } from '@/hooks';
import * as helperGlobal from '@/utils/helper';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { showNotification } from '@/contexts/services/notificationService';
import dayjs from 'dayjs';

interface DataTable {
  data: JurnalHeaderInterfaces.JurnalHeaderInterface | undefined | null;
  loading: boolean;
}

const JurnalKUmumDetail: React.FC = () => {
  const { id } = useParams();
  const [details, setDetails] = useState<JurnalHeaderInterfaces.JournalDetailType[]>([]);

  const [dataTable, setDataTable] = useState<DataTable>({
    data: null,
    loading: false,
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    isAll: 'Y',
  });

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const handleChange = (
    id: string,
    field: keyof JurnalHeaderInterfaces.JournalDetailType,
    value: string | number
  ) => {
    const detailsNew = details.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setDetails(detailsNew);
  };

  const [loading, settLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const columns: ColumnsType<JurnalHeaderInterfaces.JournalDetailType> = [
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 300,
    },

    {
      title: 'Account Name',
      dataIndex: ['account', 'name'],
      key: 'accountCode',
      width: 300,
    },

    {
      title: 'Unit',
      dataIndex: 'unit',
      render: (_: any, record) => {
        return (
          <Select
            disabled
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Pilih Unit"
            onChange={(val) => handleChange(record.id, 'unitId', val)}
            onSearch={onSearchUnit}
            value={record.unitId}
            options={helperGlobal.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
          />
        );
      },
    },

    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 300,
      render: (value) => `Rp.${helperGlobal.currencyFormatterUS(Number(value))}`,
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: (value) => `Rp.${helperGlobal.currencyFormatterUS(Number(value))}`,
    },
  ];
  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = async () => {
    if (id) {
      const data = await JurnalKhususAxios.fetchJurnalKhususDetail(id);
      setDataTable((prev) => ({ ...prev, data: data }));
    }
  };

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.nama]);

  const handlePost = async () => {
    try {
      if (id) {
        settLoading(true);
        await JurnalKhususAxios.posPostingJurnal(id);
        showNotification('success', 'Berhasil', 'Berhasil Posting Jurnal');

        navigate('/jurnal-umum');
      } else {
        showNotification('warning', 'Peringatan', 'ID jurnal kosong');
      }
    } catch (e) {
      settLoading(false);
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}
    >
      <Card title="Journal Entry">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nomor Jurnal">{dataTable.data?.numberJurnal}</Descriptions.Item>
          <Descriptions.Item label="Tanggal">
            {dataTable.data?.date && dayjs(dataTable.data?.date).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Referensi">{dataTable.data?.referenceNumber}</Descriptions.Item>
          <Descriptions.Item label="Dibuat oleh">{dataTable.data?.createdBy}</Descriptions.Item>
          <Descriptions.Item label="Unit">{dataTable.data?.unit.nama}</Descriptions.Item>
          <Descriptions.Item label="Keterangan" span={2}>
            {dataTable.data?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color="green"> {dataTable.data?.status}</Tag>
          </Descriptions.Item>
        </Descriptions>

        <Table
          dataSource={dataTable.data?.details}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{ marginTop: 24 }}
        />

        <Space style={{ marginTop: 24 }}>
          <Buttonback />
          <Button
            disabled={dataTable.data?.isPosted}
            loading={loading}
            icon={<SaveOutlined />}
            type="primary"
            onClick={handlePost}
          >
            Posting
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default JurnalKUmumDetail;
