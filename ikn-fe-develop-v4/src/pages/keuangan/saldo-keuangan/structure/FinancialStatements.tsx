import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Input,
  Layout,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

/**
 * Types
 */
type IncomeStatement = {
  revenue: number;
  expense: number;
  netIncome: number; // revenue - expense
};

type BalanceSheet = {
  asset: number;
  liability: number;
  equity: number; // openingEquity + netIncome (simplified for the period)
};

type ChangesInEquity = {
  openingEquity: number;
  netIncome: number;
  closingEquity: number;
};

type Summary = {
  totalDebit: number;
  totalCredit: number;
};

export type FinancialData = {
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  changesInEquity: ChangesInEquity;
  summary: Summary;
};

/**
 * Helpers
 */
const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0);

const toNumber = (v: string) => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Sample (from your payload)
 */
const sample: FinancialData = {
  incomeStatement: { revenue: 0, expense: 1_000_000, netIncome: -1_000_000 },
  balanceSheet: { asset: 0, liability: 0, equity: -1_000_000 },
  changesInEquity: {
    openingEquity: 0,
    netIncome: -1_000_000,
    closingEquity: -1_000_000,
  },
  summary: { totalDebit: 1_000_000, totalCredit: 1_000_000 },
};

/**
 * Main Component
 */
export default function FinancialStatements() {
  const [data, setData] = useState<FinancialData>(sample);

  const checks = useMemo(() => {
    const { incomeStatement, balanceSheet, changesInEquity, summary } = data;

    const recomputedNet = incomeStatement.revenue - incomeStatement.expense;
    const netOk = recomputedNet === incomeStatement.netIncome;

    const recomputedClosingEq = changesInEquity.openingEquity + changesInEquity.netIncome;
    const closingEqOk = recomputedClosingEq === changesInEquity.closingEquity;

    const accountingOk = balanceSheet.asset === balanceSheet.liability + balanceSheet.equity;

    const trialOk = summary.totalDebit === summary.totalCredit;

    // Cross-check IS -> CIE -> BS equity consistency
    const equityFlowOk =
      changesInEquity.closingEquity === balanceSheet.equity &&
      changesInEquity.netIncome === incomeStatement.netIncome;

    return {
      netOk,
      closingEqOk,
      accountingOk,
      trialOk,
      equityFlowOk,
      recomputedNet,
      recomputedClosingEq,
    };
  }, [data]);

  /** Tables **/
  type KV = { key: string; label: string; amount: number };

  const isRows: KV[] = [
    { key: 'revenue', label: 'Revenue', amount: data.incomeStatement.revenue },
    { key: 'expense', label: 'Expense', amount: data.incomeStatement.expense },
    { key: 'netIncome', label: 'Net Income (Loss)', amount: data.incomeStatement.netIncome },
  ];

  const bsRows: KV[] = [
    { key: 'asset', label: 'Assets', amount: data.balanceSheet.asset },
    { key: 'liability', label: 'Liabilities', amount: data.balanceSheet.liability },
    { key: 'equity', label: 'Equity', amount: data.balanceSheet.equity },
  ];

  const cieRows: KV[] = [
    { key: 'openingEquity', label: 'Opening Equity', amount: data.changesInEquity.openingEquity },
    { key: 'netIncome', label: 'Net Income (Loss)', amount: data.changesInEquity.netIncome },
    { key: 'closingEquity', label: 'Closing Equity', amount: data.changesInEquity.closingEquity },
  ];

  const columns: ColumnsType<KV> = [
    { title: 'Item', dataIndex: 'label', key: 'label' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (v: number) => <Text>{idr(v)}</Text>,
    },
  ];

  const loadSample = () => setData(sample);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-statements.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Header className="bg-white border-b border-gray-100">
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0 }}>
            Financial Statements
          </Title>
          <Space>
            <Button onClick={loadSample}>Load Sample</Button>
            <Button type="primary" onClick={exportJson}>
              Export JSON
            </Button>
          </Space>
        </Flex>
      </Header>

      <Content className="p-6">
        <Space direction="vertical" size="large" className="w-full">
          {/* Health Checks */}
          <Card title="Validation">
            <Space wrap>
              <Tag color={checks.netOk ? 'green' : 'red'}>
                IS Net = Revenue - Expense{' '}
                {checks.netOk ? 'OK' : `Mismatch (${idr(checks.recomputedNet)})`}
              </Tag>
              <Tag color={checks.closingEqOk ? 'green' : 'red'}>
                CIE Closing = Opening + Net{' '}
                {checks.closingEqOk ? 'OK' : `Mismatch (${idr(checks.recomputedClosingEq)})`}
              </Tag>
              <Tag color={checks.trialOk ? 'green' : 'red'}>
                Trial Balance {checks.trialOk ? 'Balanced' : 'Unbalanced'}
              </Tag>
              <Tag color={checks.equityFlowOk ? 'green' : 'red'}>
                Equity Consistency {checks.equityFlowOk ? 'OK' : 'Mismatch'}
              </Tag>
              <Tag color={checks.accountingOk ? 'green' : 'red'}>
                Accounting Equation A = L + E {checks.accountingOk ? 'OK' : 'Mismatch'}
              </Tag>
            </Space>

            {!checks.accountingOk && (
              <Alert
                className="mt-4"
                type="warning"
                showIcon
                message="Accounting equation is not balanced"
                description={
                  <span>
                    Assets should equal Liabilities + Equity. Current:{' '}
                    {idr(data.balanceSheet.asset)} vs{' '}
                    {idr(data.balanceSheet.liability + data.balanceSheet.equity)}.
                  </span>
                }
              />
            )}
          </Card>

          {/* Headline Stats */}
          <Flex gap={16} wrap>
            <Card className="flex-1 min-w-[260px]">
              <Statistic
                title="Revenue"
                value={data.incomeStatement.revenue}
                precision={0}
                prefix="Rp"
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
            <Card className="flex-1 min-w-[260px]">
              <Statistic
                title="Expense"
                value={data.incomeStatement.expense}
                precision={0}
                prefix="Rp"
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
            <Card className="flex-1 min-w-[260px]">
              <Statistic
                title="Net Income (Loss)"
                value={data.incomeStatement.netIncome}
                precision={0}
                prefix="Rp"
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
          </Flex>

          <Divider />

          {/* Income Statement */}
          <Card title="Income Statement">
            <Table<KV> rowKey="key" columns={columns} dataSource={isRows} pagination={false} />
          </Card>

          {/* Balance Sheet */}
          <Card title="Balance Sheet">
            <Table<KV> rowKey="key" columns={columns} dataSource={bsRows} pagination={false} />
          </Card>

          {/* Changes in Equity */}
          <Card title="Changes in Equity">
            <Table<KV> rowKey="key" columns={columns} dataSource={cieRows} pagination={false} />
          </Card>

          {/* Trial Balance Summary */}
          <Card title="Trial Balance Summary">
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Total Debit">
                {idr(data.summary.totalDebit)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Credit">
                {idr(data.summary.totalCredit)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={checks.trialOk ? 'green' : 'red'}>
                  {checks.trialOk ? 'Balanced' : 'Unbalanced'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Quick Edit (optional small playground) */}
          <Card title="Quick Edit (try numbers)">
            <Space direction="vertical" size="middle" className="w-full">
              <Title level={5}>Income Statement</Title>
              <Flex gap={8} wrap>
                <Input
                  addonBefore="Revenue"
                  type="number"
                  value={data.incomeStatement.revenue}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      incomeStatement: {
                        ...d.incomeStatement,
                        revenue: toNumber(e.target.value),
                        netIncome: toNumber(e.target.value) - d.incomeStatement.expense,
                      },
                      changesInEquity: {
                        ...d.changesInEquity,
                        netIncome: toNumber(e.target.value) - d.incomeStatement.expense,
                        closingEquity:
                          d.changesInEquity.openingEquity +
                          (toNumber(e.target.value) - d.incomeStatement.expense),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
                <Input
                  addonBefore="Expense"
                  type="number"
                  value={data.incomeStatement.expense}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      incomeStatement: {
                        ...d.incomeStatement,
                        expense: toNumber(e.target.value),
                        netIncome: d.incomeStatement.revenue - toNumber(e.target.value),
                      },
                      changesInEquity: {
                        ...d.changesInEquity,
                        netIncome: d.incomeStatement.revenue - toNumber(e.target.value),
                        closingEquity:
                          d.changesInEquity.openingEquity +
                          (d.incomeStatement.revenue - toNumber(e.target.value)),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
              </Flex>

              <Divider />

              <Title level={5}>Changes in Equity</Title>
              <Flex gap={8} wrap>
                <Input
                  addonBefore="Opening Equity"
                  type="number"
                  value={data.changesInEquity.openingEquity}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      changesInEquity: {
                        ...d.changesInEquity,
                        openingEquity: toNumber(e.target.value),
                        closingEquity: toNumber(e.target.value) + d.incomeStatement.netIncome,
                      },
                      balanceSheet: {
                        ...d.balanceSheet,
                        equity: toNumber(e.target.value) + d.incomeStatement.netIncome,
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
              </Flex>

              <Divider />

              <Title level={5}>Balance Sheet</Title>
              <Flex gap={8} wrap>
                <Input
                  addonBefore="Assets"
                  type="number"
                  value={data.balanceSheet.asset}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      balanceSheet: {
                        ...d.balanceSheet,
                        asset: toNumber(e.target.value),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
                <Input
                  addonBefore="Liabilities"
                  type="number"
                  value={data.balanceSheet.liability}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      balanceSheet: {
                        ...d.balanceSheet,
                        liability: toNumber(e.target.value),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
                <Input
                  addonBefore="Equity"
                  type="number"
                  value={data.balanceSheet.equity}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      balanceSheet: {
                        ...d.balanceSheet,
                        equity: toNumber(e.target.value),
                      },
                      changesInEquity: {
                        ...d.changesInEquity,
                        closingEquity: toNumber(e.target.value),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
              </Flex>

              <Divider />

              <Title level={5}>Trial Balance Summary</Title>
              <Flex gap={8} wrap>
                <Input
                  addonBefore="Total Debit"
                  type="number"
                  value={data.summary.totalDebit}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      summary: {
                        ...d.summary,
                        totalDebit: toNumber(e.target.value),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
                <Input
                  addonBefore="Total Credit"
                  type="number"
                  value={data.summary.totalCredit}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      summary: {
                        ...d.summary,
                        totalCredit: toNumber(e.target.value),
                      },
                    }))
                  }
                  style={{ maxWidth: 260 }}
                />
              </Flex>
            </Space>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}
