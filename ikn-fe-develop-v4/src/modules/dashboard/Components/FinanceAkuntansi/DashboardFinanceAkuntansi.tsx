import { Card, Typography } from 'antd';
import IncomeVsExpensesChart from './structure/IncomeVsExpensesChart';
import CashFlowChart from './structure/CashFlowChart';
import NetProfitChart from './structure/netProfitData';
import ExpenseBreakdownChart from './structure/ExpenseBreakdownChart';
import BankBalanceChart from './structure/BankBalanceChart';

const { Title } = Typography;

export const DashboardFinanceAkuntansi = ({
  unitId,
  typePo,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>
        📦 Finance and Accountant
      </Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          overflow: 'auto',
          flexWrap: 'wrap',
        }}
      >
        <Card title="📊 Pendapatan dan Pengeluaran (Income vs Expenses)">
          <IncomeVsExpensesChart unitId={unitId} typePo={typePo} />
        </Card>
        <Card title="💵 Arus Kas (Cash Flow)">
          <CashFlowChart unitId={unitId} />
        </Card>
        <Card title="📈 Laba Bersih (Net Profit)">
          <NetProfitChart />
        </Card>
        <Card title="📊 Komposisi Biaya (Expense Breakdown)">
          <ExpenseBreakdownChart unitId={unitId} />
        </Card>
        <Card title="🏦 Komposisi Biaya (Expense Breakdown)">
          <BankBalanceChart unitId={'unitId'} />
        </Card>
        {/* <Card title="🏦 Balamce Sheet">
          <BalanceSheetCharts />
        </Card> */}
      </div>
    </>
  );
};
