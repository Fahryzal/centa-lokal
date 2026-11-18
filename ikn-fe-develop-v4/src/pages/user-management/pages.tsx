import { Tabs } from 'antd';
import UserManagemenTab from './structure/Component/Tabs/UsermanegementTab';
import MenuTab from './structure/Component/Tabs/MenuTab';
import RoleTab from './structure/Component/Tabs/RoleTab';
const { TabPane } = Tabs;

export default function UserManagementPage() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="User Management" key="1">
          <UserManagemenTab />
        </TabPane>

        <TabPane tab="Menu" key="2">
          <MenuTab />
        </TabPane>

        <TabPane tab="Role" key="3">
          <RoleTab />
        </TabPane>
      </Tabs>
    </div>
  );
}
