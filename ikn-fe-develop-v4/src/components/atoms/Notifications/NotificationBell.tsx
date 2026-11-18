import { useState } from 'react';
import { Badge, Popover, List } from 'antd';
import { Bell } from '@phosphor-icons/react';

export default function NotificationBell({ count = 0, data = [] }: { count?: number; data?: any }) {
  const [open, setOpen] = useState(false);
  console.log('data', data);

  return (
    <Popover
      title="Notifikasi"
      styles={{
        body: {
          background: '#EAEFEF',
        },
      }}
      content={
        <List
          dataSource={data.filter((item: any) => !item.isPosted)}
          renderItem={(item: any) => (
            <List.Item>{`Jurnal ${item.numberJurnal} belum di proses`}</List.Item>
          )}
          locale={{ emptyText: 'Tidak ada notifikasi' }}
          style={{ width: 250, maxHeight: 300, overflowY: 'auto' }}
        />
      }
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="leftTop"
    >
      <Badge size="small" count={count}>
        <Bell style={{ cursor: 'pointer' }} size={25} />
      </Badge>
    </Popover>
  );
}
