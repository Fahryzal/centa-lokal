'use client';

import React, { useState } from 'react';
import { Card, Statistic, Row, Col, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';

const BalanceSheetSummary: React.FC = () => {
  const [periode, setPeriode] = useState(dayjs());
  const [data, _setData] = useState<{ assets: number; liabilities: number; equity: number } | null>(
    {
      assets: 16000000,
      liabilities: 16000000,
      equity: 0,
    }
  );
  const [loading, _setLoading] = useState(false);

  //   const fetchBalanceSheet = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get('/api/balance-sheet', {
  //         params: {
  //           year: periode.year(),
  //           month: periode.month() + 1,
  //         },
  //       });
  //       setData(response.data.data);
  //     } catch (err) {
  //       console.error('Failed to fetch balance sheet:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchBalanceSheet();
  //   }, [periode]);

  return (
    <Card
      title="Balance Sheet"
      extra={<DatePicker picker="month" value={periode} onChange={(v) => v && setPeriode(v)} />}
    >
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Assets"
              value={data?.assets ?? 0}
              prefix="Rp"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Liabilities"
              value={data?.liabilities ?? 0}
              prefix="Rp"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Equity"
              value={data?.equity ?? 0}
              prefix="Rp"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default BalanceSheetSummary;
