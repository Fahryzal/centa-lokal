'use client';

import React, { useState } from 'react';
import { Card, Statistic, Row, Col, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
const { MonthPicker } = DatePicker;

interface ChangeEquity {
  equityAwal: number;
  labaRugi: number;
  equityAkhir: number;
}

const ChangeEquity: React.FC = () => {
  const [periode, setPeriode] = useState(dayjs());
  const [data, _setData] = useState<ChangeEquity | null>({
    equityAwal: -100000,
    labaRugi: 100000,
    equityAkhir: 0,
  });
  const [loading, _setLoading] = useState(false);

  //   const fetchData = async (periode: dayjs.Dayjs) => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(`/api/change-equity`, {
  //         params: {
  //           month: periode.month() + 1, // month is 0-indexed
  //           year: periode.year(),
  //         },
  //       });
  //       setData(res.data.data);
  //     } catch (err) {
  //       message.error('Gagal memuat data perubahan ekuitas');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchData(periode);
  //   }, [periode]);

  return (
    <Card
      title="Perubahan Ekuitas"
      extra={
        <MonthPicker
          value={periode}
          onChange={(value) => value && setPeriode(value)}
          format="MMMM YYYY"
          allowClear={false}
        />
      }
    >
      {loading ? (
        <Spin />
      ) : data ? (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Ekuitas Awal"
              value={data.equityAwal}
              valueStyle={{ color: '#8c8c8c' }}
              prefix="Rp"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Laba / Rugi"
              value={data.labaRugi}
              valueStyle={{ color: data.labaRugi >= 0 ? '#3f8600' : '#cf1322' }}
              prefix="Rp"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Ekuitas Akhir"
              value={data.equityAkhir}
              valueStyle={{ color: '#096dd9' }}
              prefix="Rp"
            />
          </Col>
        </Row>
      ) : (
        <p>Tidak ada data.</p>
      )}
    </Card>
  );
};

export default ChangeEquity;
