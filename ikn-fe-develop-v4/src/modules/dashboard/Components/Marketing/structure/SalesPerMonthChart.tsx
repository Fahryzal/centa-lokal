import { Select, Typography, Space, DatePicker } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as MarektingAxios from '@/modules/dashboard/service/MarektingAxios';
import { showNotification } from '@/contexts/services/notificationService';
import { getRandomColorV2 } from '@/utils/helper';
import { handleMessageError } from '@/utils/func/func';
import dayjs from 'dayjs';

const { Title } = Typography;
export const SalesPerMonthChart = ({ unitId }: { unitId: string }) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [dataChar, setData] = useState<any>({});
  const [kategoriOptions, setKategoriOptions] = useState([
    { label: 'Semua Kategori', value: 'all' },
  ]);
  const rawData = dataChar[selectedYear];

  // Jika pilih "all", reshape jadi { month: 'Jan', PRN: 120000, PPR: 90000, ... }
  const chartData =
    selectedKategori === 'all'
      ? rawData?.reduce((acc: any[], cur: any) => {
          const existing = acc.find((a) => a.month === cur.month);
          if (existing) {
            existing[cur.kategori] = cur.value;
          } else {
            acc.push({ month: cur.month, [cur.kategori]: cur.value });
          }
          return acc;
        }, [])
      : rawData
          ?.filter((d: any) => d.kategori === selectedKategori)
          .map((d: any) => ({
            month: d.month,
            [d.kategori]: d.value,
          }));

  // Warna di-generate sekali per kategori, bukan tiap render, biar tidak berubah-ubah
  const kategoriColors = useMemo(() => {
    const colors: Record<string, string> = {};
    kategoriOptions
      .filter((items) => items.value !== 'all')
      .forEach((k) => {
        colors[k.value] = getRandomColorV2();
      });
    return colors;
  }, [kategoriOptions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ margin: 0, color: p.fill }}>
              {p.name}: Rp {p.value.toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedKategori, unitId]);

  const fetchData = async () => {
    try {
      const params = {
        year: selectedYear,
        kategori: selectedKategori,
        unitId: unitId,
      };
      const data = await MarektingAxios.fetchDataCharSalesPerMonth(params);
      setData(data);

      // Ambil daftar kategori unik dari seluruh tahun yang ada di response
      const allKategori = new Set<string>();
      Object.values(data || {}).forEach((yearData: any) => {
        yearData?.forEach((d: any) => allKategori.add(d.kategori));
      });
      const dataClean = [
        { label: 'Semua Kategori', value: 'all' },
        ...Array.from(allKategori).map((k) => ({ label: k, value: k })),
      ];
      setKategoriOptions(dataClean);
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Terjadi Kesalahan', message);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>
          Sales Per Month
        </Title>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Select
              value={selectedKategori}
              options={kategoriOptions}
              onChange={setSelectedKategori}
              style={{ width: 200 }}
            />
            <DatePicker
              format="YYYY"
              defaultValue={dayjs()}
              picker="year"
              onChange={(v) => setSelectedYear(v.year())}
            />
          </Space>
        </Space>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `Rp ${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {selectedKategori === 'all'
              ? kategoriOptions
                  .filter((items) => items.value !== 'all')
                  .map((kat) => (
                    <Bar
                      key={kat.value}
                      dataKey={kat.value}
                      fill={kategoriColors[kat.value]}
                      barSize={40}
                      radius={[8, 8, 0, 0]}
                    />
                  ))
              : (() => {
                  const kat = selectedKategori;
                  return (
                    <Bar
                      dataKey={kat}
                      fill={kategoriColors[kat] || getRandomColorV2()}
                      barSize={40}
                      radius={[8, 8, 0, 0]}
                    />
                  );
                })()}
          </BarChart>
        </ResponsiveContainer>
      </Space>
    </div>
  );
};
