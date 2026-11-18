import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import CrossChekPajakRA from './structure/Component/CekPajakRA';
import CrossChekPajakRN from './structure/Component/CekPajakRN';
import { decodeJwt } from '@/utils/helper';
const unitIdRA = import.meta.env.VITE_ID_UNIT_RA;
const unitIdRN = import.meta.env.VITE_ID_UNIT_RN;

export default function CrossChekPajakPage() {
  const onChange = (key: string) => {
    console.log(key);
  };
  const dataUser = decodeJwt();

  const isRoot = dataUser?.isRoot === 'Y';
  const unitId = dataUser?.unitId;
  const isPusat = dataUser?.isPusat;

  const items: TabsProps['items'] = [
    ...(isRoot || isPusat || unitId === unitIdRA
      ? [
          {
            key: '1',
            label: 'Pajak RA',
            children: <CrossChekPajakRA />,
          },
        ]
      : []),
    ...(isRoot || isPusat || unitId === unitIdRN
      ? [
          {
            key: '2',
            label: 'Pajak RN',
            children: <CrossChekPajakRN />,
          },
        ]
      : []),
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
