import { Card, DatePicker, Form, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import * as JurnalKhususAxios from '@/pages/keuangan/jurnal/jurnal-khusus/service/JurnalKhususAxios';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';

import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as InterfacesBukuBesar from '@pages/akuntansi/buku-besar/interfaces/InterfacesBukuBesar';
import JournalTable from './JournalTable';
import exportToExcel from '@/utils/generateExcel/BukuBesar/exportToExcel';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import { FileExcelOutlined } from '@ant-design/icons';
import exportBukuBesarPdf from '@/utils/generatePdf/exportBukuBesarPdf';
import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';

// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
import 'dayjs/locale/id';
import { Unite } from '@phosphor-icons/react';
const monthFormat = 'YYYY/MM';

export default function BukuBesar() {
  const [idDelete, _setIdDelete] = useState('');
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 10,
    loading: false,
    date: null,
    jenisJurnal: 'All',
    startDate: null,
    endDate: null,
    total: 0,
    periode_month: null,
    status: null,
    // IsNottypeJournalEntry: 'RN_EKSPOR',
    unitId: null,
    isPosted: 'YES',
  });
  const [periode, setPeriode] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const fetch = async () => {
      const res = await JurnalKhususAxios.fetchJurnalKhusus({
        ...dataTable,
        periode: dayjs(periode).format('YYYY-MM'),
      });
      setTable((prev) => ({
        ...prev,
        data: res.data,
        loading: false,
        total: res.totalData,
      }));
    };
    fetch();
  }, [
    dataTable.page,
    dataTable.endDate,
    dataTable.startDate,
    dataTable.jenisJurnal,

    dataTable.periode_month,
    dataTable.status,
    dataTable.unitId,
    periode,
  ]);

  const dataSource: InterfacesBukuBesar.ResponseDetailJurnal[] = useMemo(
    () => dataTable.data,
    [dataTable.data]
  );

  useEffect(() => {
    const newDdata = dataTable.data.filter((item: any) => item.id != idDelete);
    setTable((prev) => ({
      ...prev,
      page: 1,
      data: newDdata,
      total: prev.total - 1,
    }));
  }, [idDelete]);

  const handleExportJournalToExcel = () => {
    const fetch = async () => {
      const dataTableNew = {
        ...dataTable,
        isDownload: true,
        periode: dayjs(periode).format('YYYY-MM'),
      };
      const res = await JurnalKhususAxios.fetchJurnalKhusus(dataTableNew);
      exportToExcel(res.data, dayjs(periode).format('YYYY-MM'));
    };
    fetch();
  };

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  const handleExportJournalToPdf = () => {
    const fetch = async () => {
      const dataTableNew = {
        ...dataTable,
        isDownload: true,
        periode: dayjs(periode).format('YYYY-MM'),
      };
      const res = await JurnalKhususAxios.fetchJurnalKhusus(dataTableNew);
      exportBukuBesarPdf(res.data, dayjs(periode).format('YYYY-MM'));
    };
    fetch();
  };

  return (
    <Card
      style={{
        backgroundColor: 'white',
        padding: 0,
        textAlign: 'center',
        marginTop: 10,
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      }}
      extra={
        <div
          style={{
            display: 'flex',
            gap: 10,
            width: '100%',
          }}
        >
          <Form.Item<BarangJadiInterfaces.PayloadBarangJadiType>
            name="unitId"
            rules={[{ required: true, message: 'Masukan unit kode!' }]}
          >
            <Select
              prefix={<Unite />}
              showSearch
              loading={unit.loading}
              placeholder="Pilih unit"
              optionFilterProp="label"
              onChange={(e) => setTable((prev) => ({ ...prev, unitId: e }))}
              options={globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama')}
            />
          </Form.Item>

          <DatePicker
            defaultValue={dayjs()}
            format={monthFormat}
            picker="month"
            onChange={(value) => setPeriode(value)}
            style={{
              height: 30,
            }}
          />
          <ButtonFile
            text="Download Excel"
            icon={<FileExcelOutlined />}
            onClick={handleExportJournalToExcel}
          />
          <ButtonFile onClick={handleExportJournalToPdf} />
        </div>
      }
    >
      <JournalTable setTable={setTable} dataTable={dataTable as any} data={dataSource as any} />;
    </Card>
  );
}
