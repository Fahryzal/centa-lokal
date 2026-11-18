import { Card } from 'antd';
import { SalesPerMonthChart } from './structure/SalesPerMonthChart';
import { SalesStatusStackedChart } from './structure/SalesStatusStackedChart';
import { InvoiceStatusDonut } from './structure/InvoiceStatusDonut';
import LineChartPlanVsActual from './structure/LineChartPlanVsActual';
import BuyerChart from './structure/BuyerChart';

export const DashboardMarketing = ({
  unitId,
  typePo,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <Card title="📑 Penjualan">
        <SalesPerMonthChart unitId={unitId} />
      </Card>

      <Card title="📈 Monhtly Status Sale Charts">
        <SalesStatusStackedChart unitId={unitId} typePo={typePo} />
      </Card>

      <Card title="🧯 Status Invoice">
        <InvoiceStatusDonut unitId={unitId} typePo={typePo} />
      </Card>
      <Card title="Plan Sales" style={{ minHeight: 350 }}>
        <LineChartPlanVsActual unitId={unitId} typePo={typePo} />
      </Card>

      <Card title="Buyer Chart" style={{ minHeight: 350 }}>
        <BuyerChart />
      </Card>
    </div>
  );
};
