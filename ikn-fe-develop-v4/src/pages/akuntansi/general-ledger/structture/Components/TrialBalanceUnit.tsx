import { FC } from 'react';
import { Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import TrialBalanceTable from './TrialBalanceTable';
import { Dayjs } from 'dayjs';
import { currencyFormatter } from '@/utils/helper';

type Ledger = {
  accountCode: string;
  accountName: string;
  mutationDebit: number;
  mutationCredit: number;
};

type UnitLedgerGroup = {
  unitName: string;
  ledgers: Ledger[];
};

type Props = {
  data: UnitLedgerGroup[];
  dataTrialBalance: any;
  setUnit: React.Dispatch<React.SetStateAction<any>>;
  onSearchUnit: any;
  unit: any;
  setPeriode: React.Dispatch<React.SetStateAction<Dayjs>>;
  periode: Dayjs;
};

const columns: ColumnsType<Ledger> = [
  {
    title: 'Kode Akun',
    dataIndex: 'accountCode',
    key: 'accountCode',
  },
  {
    title: 'Nama Akun',
    dataIndex: 'accountName',
    key: 'accountName',
  },
  {
    title: 'Mutasi Debet',
    dataIndex: 'mutationDebit',
    key: 'mutationDebit',
    align: 'right',
    render: (value: number) => currencyFormatter(Number(value)),
  },
  {
    title: 'Mutasi Kredit',
    dataIndex: 'mutationCredit',
    key: 'mutationCredit',
    align: 'right',
    render: (value: number) => currencyFormatter(Number(value)),
  },
];

const TrialBalanceByUnit: FC<Props> = ({
  data,
  dataTrialBalance,
  setUnit,
  unit,
  onSearchUnit,
  setPeriode,
  periode,
}) => {
  const items: TabsProps['items'] = data.map((unit) => ({
    key: unit.unitName,
    label: `Unit: ${unit.unitName.toUpperCase()}`,
    children: (
      <Table
        columns={columns}
        dataSource={unit.ledgers}
        pagination={false}
        rowKey={(row) => `${unit.unitName}-${row.accountCode}`}
        bordered
        size="small"
      />
    ),
  }));

  return (
    <Tabs
      items={[
        ...items,
        {
          key: 'trial_balance',
          label: 'Trial Balance',
          children: (
            <TrialBalanceTable
              setPeriode={setPeriode}
              periode={periode}
              unit={unit}
              setUnit={setUnit}
              onSearchUnit={onSearchUnit}
              data={dataTrialBalance}
              period={periode}
            />
          ),
        },
      ]}
    />
  );
};

export default TrialBalanceByUnit;
