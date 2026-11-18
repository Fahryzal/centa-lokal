import { useMemo, useState } from 'react';
import {
  Card,
  Divider,
  Flex,
  Row,
  Col,
  Select,
  Segmented,
  Typography,
  Statistic,
  Space,
  Tooltip,
} from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// -----------------------------
// Types
// -----------------------------

type BalanceCategory =
  | 'Assets:Cash'
  | 'Assets:Accounts Receivable'
  | 'Assets:Inventory'
  | 'Assets:Fixed Assets'
  | 'Liabilities:Accounts Payable'
  | 'Liabilities:Short-term Loans'
  | 'Liabilities:Accrued Expenses'
  | 'Equity:Paid-in Capital'
  | 'Equity:Retained Earnings';

type MonthPoint = {
  month: string; // e.g. "2025-01"
  account: BalanceCategory;
  amount: number; // positive values, in IDR
};

// -----------------------------
// Mock Data (replace with API data)
// -----------------------------

const months = [
  '2025-01',
  '2025-02',
  '2025-03',
  '2025-04',
  '2025-05',
  '2025-06',
  '2025-07',
  '2025-08',
];

const mockData: MonthPoint[] = [
  // Assets
  ...months.map((m, i) => ({
    month: m,
    account: 'Assets:Cash' as const,
    amount: 800_000_000 + i * 25_000_000,
  })),
  ...months.map((m, i) => ({
    month: m,
    account: 'Assets:Accounts Receivable' as const,
    amount: 450_000_000 + i * 30_000_000,
  })),
  ...months.map((m, i) => ({
    month: m,
    account: 'Assets:Inventory' as const,
    amount: 520_000_000 + (i % 3) * 10_000_000,
  })),
  ...months.map((m, _i) => ({
    month: m,
    account: 'Assets:Fixed Assets' as const,
    amount: 1_900_000_000,
  })),

  // Liabilities
  ...months.map((m, i) => ({
    month: m,
    account: 'Liabilities:Accounts Payable' as const,
    amount: 300_000_000 + (i % 2) * 15_000_000,
  })),
  ...months.map((m, i) => ({
    month: m,
    account: 'Liabilities:Short-term Loans' as const,
    amount: 250_000_000 - i * 10_000_000,
  })),
  ...months.map((m, i) => ({
    month: m,
    account: 'Liabilities:Accrued Expenses' as const,
    amount: 110_000_000 + (i % 4) * 5_000_000,
  })),

  // Equity
  ...months.map((m) => ({
    month: m,
    account: 'Equity:Paid-in Capital' as const,
    amount: 1_500_000_000,
  })),
  ...months.map((m, i) => ({
    month: m,
    account: 'Equity:Retained Earnings' as const,
    amount: 1_000_000_000 + i * 20_000_000,
  })),
];

// -----------------------------
// Helpers
// -----------------------------

const fmtIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v);

const monthLabel = (isoMonth: string) => {
  const [y, m] = isoMonth.split('-').map(Number);
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });
};

function groupBy<T, K extends string | number>(arr: T[], key: (t: T) => K) {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ||= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

function sumBy<T>(arr: T[], picker: (t: T) => number) {
  return arr.reduce((s, t) => s + picker(t), 0);
}

const isAsset = (a: BalanceCategory) => a.startsWith('Assets:');
const isLiability = (a: BalanceCategory) => a.startsWith('Liabilities:');
const isEquity = (a: BalanceCategory) => a.startsWith('Equity:');

// -----------------------------
// Component
// -----------------------------

export default function BalanceSheetCharts() {
  const [selectedMonth, setSelectedMonth] = useState<string>(months[months.length - 1]);
  const [stackMode, setStackMode] = useState<'grouped' | 'stacked'>('stacked');

  // Aggregate per month for: Assets vs Liabilities+Equity
  const monthlyALE = useMemo(() => {
    const byMonth = groupBy(mockData, (d) => d.month);
    return Object.entries(byMonth)
      .map(([month, rows]) => {
        const assets = sumBy(
          rows.filter((r) => isAsset(r.account)),
          (r) => r.amount
        );
        const liabilities = sumBy(
          rows.filter((r) => isLiability(r.account)),
          (r) => r.amount
        );
        const equity = sumBy(
          rows.filter((r) => isEquity(r.account)),
          (r) => r.amount
        );
        return {
          month,
          Assets: assets,
          Liabilities: liabilities,
          Equity: equity,
          LPlusE: liabilities + equity,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  // Data for Column chart
  const columnData = useMemo(() => {
    const rows: Array<{ month: string; group: string; value: number }> = [];
    monthlyALE.forEach((m) => {
      rows.push({ month: monthLabel(m.month), group: 'Assets', value: m.Assets });
      rows.push({ month: monthLabel(m.month), group: 'Liabilities', value: m.Liabilities });
      rows.push({ month: monthLabel(m.month), group: 'Equity', value: m.Equity });
    });
    return rows;
  }, [monthlyALE]);

  // Composition for selected month
  const monthRows = useMemo(
    () => mockData.filter((d) => d.month === selectedMonth),
    [selectedMonth]
  );
  const assetsRows = monthRows.filter((r) => isAsset(r.account));
  const liabilitiesRows = monthRows.filter((r) => isLiability(r.account));
  const equityRows = monthRows.filter((r) => isEquity(r.account));

  const totalAssets = sumBy(assetsRows, (r) => r.amount);
  const totalLiabilities = sumBy(liabilitiesRows, (r) => r.amount);
  const totalEquity = sumBy(equityRows, (r) => r.amount);
  const totalLPlusE = totalLiabilities + totalEquity;

  const pieAssetsData = assetsRows.map((r) => ({ type: r.account.split(':')[1], value: r.amount }));
  const pieLEData = [
    ...liabilitiesRows.map((r) => ({ type: r.account.split(':')[1], value: r.amount })),
    ...equityRows.map((r) => ({ type: r.account.split(':')[1], value: r.amount })),
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <Space direction="vertical" size={16} className="w-full">
        <Flex align="center" justify="space-between" className="w-full">
          <Space>
            <Segmented
              options={[
                { label: 'Stacked', value: 'stacked' },
                { label: 'Grouped', value: 'grouped' },
              ]}
              value={stackMode}
              onChange={(v) => setStackMode(v as any)}
            />
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={months.map((m) => ({ label: monthLabel(m), value: m }))}
              style={{ width: 180 }}
              popupMatchSelectWidth={200}
            />
          </Space>
        </Flex>

        {/* KPI Cards */}
        <Col>
          <Col xs={24}>
            <Card className="rounded-2xl shadow-sm">
              <Statistic
                title="Total Assets"
                value={totalAssets}
                formatter={(v) => <span>{fmtIDR(Number(v))}</span>}
              />
            </Card>
          </Col>

          <Col xs={24}>
            <Card className="rounded-2xl shadow-sm">
              <Statistic
                title="Total Liabilities"
                value={totalLiabilities}
                formatter={(v) => <span>{fmtIDR(Number(v))}</span>}
              />
            </Card>
          </Col>

          <Col xs={24}>
            <Card className="rounded-2xl shadow-sm">
              <Statistic
                title="Total Equity"
                value={totalEquity}
                formatter={(v) => <span>{fmtIDR(Number(v))}</span>}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card className="rounded-2xl shadow-sm">
              <Statistic
                title={
                  <span>
                    A = L + E{' '}
                    <Tooltip title="Keseimbangan neraca: Assets harus sama dengan Liabilities + Equity.">
                      <InfoCircleOutlined className="ml-1" />
                    </Tooltip>
                  </span>
                }
                value={Math.abs(totalAssets - totalLPlusE)}
                suffix={
                  <Text type={Math.abs(totalAssets - totalLPlusE) < 1 ? 'success' : 'danger'}>
                    {Math.abs(totalAssets - totalLPlusE) < 1 ? 'Balanced' : 'Unbalanced'}
                  </Text>
                }
                formatter={(v) => <span>{fmtIDR(Number(v))}</span>}
              />
            </Card>
          </Col>
        </Col>

        {/* Trend: Assets vs Liabilities & Equity */}
        <Card className="rounded-2xl shadow-sm">
          <Flex align="center" justify="space-between">
            <Title level={4} className="!mb-2">
              Tren Neraca per Bulan
            </Title>
          </Flex>
          <Text type="secondary">Perbandingan Assets, Liabilities, dan Equity per bulan.</Text>
          <div className="mt-4">
            <Column
              data={columnData}
              xField="month"
              yField="value"
              seriesField="group"
              isStack={stackMode === 'stacked'}
              isGroup={stackMode === 'grouped'}
              legend={{ position: 'top' }}
              tooltip={{ formatter: (d: any) => ({ name: d.group, value: fmtIDR(d.value) }) }}
              xAxis={{ label: { autoHide: true } }}
              yAxis={{ label: { formatter: (v: any) => fmtIDR(Number(v)) } }}
            />
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Assets Composition */}
          <Col xs={24} md={12}>
            <Card className="rounded-2xl shadow-sm">
              <Title level={4} className="!mb-2">
                Komposisi Assets ({monthLabel(selectedMonth)})
              </Title>
              <Text type="secondary">Distribusi per akun aset.</Text>
              <div className="mt-4">
                <Pie
                  data={pieAssetsData}
                  angleField="value"
                  colorField="type"
                  radius={1}
                  innerRadius={0.6}
                  label={{
                    type: 'inner',
                    offset: '-50%',
                    content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
                    style: { textAlign: 'center' },
                  }}
                  statistic={{ title: false, content: { content: fmtIDR(totalAssets) } }}
                  tooltip={{ formatter: (d: any) => ({ name: d.type, value: fmtIDR(d.value) }) }}
                />
              </div>
            </Card>
          </Col>

          {/* Liabilities & Equity Composition */}
          <Col xs={24} md={12}>
            <Card className="rounded-2xl shadow-sm">
              <Title level={4} className="!mb-2">
                Komposisi Liabilities & Equity ({monthLabel(selectedMonth)})
              </Title>
              <Text type="secondary">Distribusi kewajiban dan ekuitas.</Text>
              <div className="mt-4">
                <Pie
                  data={pieLEData}
                  angleField="value"
                  colorField="type"
                  radius={1}
                  innerRadius={0.6}
                  label={{
                    type: 'inner',
                    offset: '-50%',
                    content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
                    style: { textAlign: 'center' },
                  }}
                  statistic={{ title: false, content: { content: fmtIDR(totalLPlusE) } }}
                  tooltip={{ formatter: (d: any) => ({ name: d.type, value: fmtIDR(d.value) }) }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Treemap Details */}
        {/* <Card className="rounded-2xl shadow-sm">
          <Title level={4} className="!mb-2">
            Detail Akun – Treemap ({monthLabel(selectedMonth)})
          </Title>
          <Text type="secondary">Ukuran kotak merepresentasikan besaran saldo per akun.</Text>
          <div className="mt-4">
            <Treemap
              data={treemapData as any}
              colorField="name"
              interactions={[{ type: 'element-active' }]}
              tooltip={{
                formatter: (d: any) => {
                  return {
                    name: d.data?.name ?? d.name,
                    value: d.value ? fmtIDR(Number(d.value)) : '',
                  };
                },
              }}
            />
          </div>
        </Card> */}

        <Divider />
        <Text type="secondary">
          Tip: Ganti <code>mockData</code> dengan data API Anda. Struktur yang digunakan:{' '}
          {"{ month: 'YYYY-MM', account: 'Group:Name', amount: number }"}.
        </Text>
      </Space>
    </div>
  );
}
