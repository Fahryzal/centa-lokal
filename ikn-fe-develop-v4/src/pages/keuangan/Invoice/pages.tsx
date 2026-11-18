import { Tabs } from 'antd';
import InvoicePageRN from './structure/InvoicePageRN';
import InvoicePageRA from './structure/InvoicePageRA';
import InvoicePageEksporRN from './structure/InvoicePageRnEkspor';
import { decodeJwt } from '@/utils/helper';
const { TabPane } = Tabs;
const unitIdRA = import.meta.env.VITE_ID_UNIT_RA;
const unitIdRN = import.meta.env.VITE_ID_UNIT_RN;

export default function InvoiceFinance() {
  const dataUser = decodeJwt();

  const isRoot = dataUser?.isRoot === 'Y';
  const unitId = dataUser?.unitId;
  const isPusat = dataUser?.isPusat;

  return (
    <Tabs defaultActiveKey="1">
      {(isRoot || isPusat || unitId === unitIdRN) && (
        <TabPane tab="Invoice RN" key="1">
          <InvoicePageRN />
        </TabPane>
      )}

      {(isRoot || isPusat || unitId === unitIdRA) && (
        <TabPane tab="Invoice RA" key="2">
          <InvoicePageRA />
        </TabPane>
      )}

      {(isRoot || isPusat || unitId === unitIdRN) && (
        <TabPane tab="Invoice RN (EKSPOR)" key="3">
          <InvoicePageEksporRN isFinance={true} />
        </TabPane>
      )}
    </Tabs>
  );
}
