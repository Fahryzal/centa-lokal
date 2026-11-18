'use client';

import { useState } from 'react';
import { Card, Col, Row, DatePicker, Statistic } from 'antd';
import dayjs from 'dayjs';

const FinancialSummary = ({ data }: { data: any }) => {
  const [periode, setPeriode] = useState(dayjs());

  const handleChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setPeriode(date);
      // Panggil API berdasarkan periode baru di sini
      // fetchData({ period: date.format('YYYY-MM') });
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <DatePicker picker="month" value={periode} onChange={handleChange} format="MMMM YYYY" />
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Laba Rugi">
            <Statistic title="Total Pendapatan" value={data.labaRugi.totalPendapatan} prefix="Rp" />
            <Statistic title="Total Beban" value={data.labaRugi.totalBeban} prefix="Rp" />
            <Statistic title="Laba/Rugi Bersih" value={data.labaRugi.labaRugiBersih} prefix="Rp" />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Neraca">
            <Statistic title="Aset" value={data.neraca.assets} prefix="Rp" />
            <Statistic title="Liabilitas" value={data.neraca.liabilities} prefix="Rp" />
            <Statistic title="Ekuitas" value={data.neraca.equity} prefix="Rp" />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Perubahan Modal">
            <Statistic title="Ekuitas Awal" value={data.perubahanModal.equityAwal} prefix="Rp" />
            <Statistic
              title="Laba/Rugi Periode Ini"
              value={data.perubahanModal.labaRugi}
              prefix="Rp"
            />
            <Statistic title="Ekuitas Akhir" value={data.perubahanModal.equityAkhir} prefix="Rp" />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FinancialSummary;
