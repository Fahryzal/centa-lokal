import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AccountPage from './account/pages';
import AccountMappingPage from './account-mapping/pages';
import AccountTypePage from './account-type/pages';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Master Akun',
    children: <AccountPage />,
  },
  {
    key: '2',
    label: 'Akun Mapping',
    children: <AccountMappingPage />,
  },
  {
    key: '3',
    label: 'Type Akun',
    children: <AccountTypePage />,
  },
];

const AccountIndex: React.FC = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);

export default AccountIndex;
