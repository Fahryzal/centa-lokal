import { EditFilled } from "@ant-design/icons";
import { Button, Form } from "antd";

export default function ButtonEdit({
  loading,
}: Readonly<{ loading?: boolean }>) {
  return (
    <Form.Item>
      <Button
        loading={loading}
        type="primary"
        htmlType="submit"
        icon={<EditFilled />}
        style={{ width: "150px" }}
      >
        Simpan
      </Button>
    </Form.Item>
  );
}
