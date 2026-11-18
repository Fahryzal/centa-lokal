import { Plus } from '@phosphor-icons/react';
import { Button, Form } from 'antd';

export default function ButtonAdd({
  loading,
  text = 'Simpan',
}: Readonly<{ loading?: boolean; text?: string }>) {
  return (
    <Form.Item>
      <Button
        loading={loading}
        type="primary"
        htmlType="submit"
        icon={<Plus />}
        style={{ width: '150px' }}
      >
        {text}
      </Button>
    </Form.Item>
  );
}
