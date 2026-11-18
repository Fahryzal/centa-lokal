import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "antd";
import { useNavigate } from "react-router";

export default function Buttonback({
  loading,
}: Readonly<{ loading?: boolean }>) {
  const navigate = useNavigate();
  return (
    <Button
      loading={loading}
      onClick={() => navigate(-1)}
      color="green"
      htmlType="button"
      icon={<ArrowLeft />}
      style={{ width: "150px" }}
    >
      Kembali
    </Button>
  );
}
