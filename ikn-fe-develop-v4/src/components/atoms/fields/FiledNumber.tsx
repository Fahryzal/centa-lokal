import { InputNumber } from "antd";
import * as globalHelpers from "@/utils/helper";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

export default function FieldNumber({
  placeholder,
  disabled = false,
  icon = <DollarCircleOutlined />,
}: Readonly<{ placeholder?: string; disabled?: boolean; icon?: ReactNode }>) {
  return (
    <InputNumber
      prefix={icon}
      formatter={globalHelpers.formatter}
      parser={globalHelpers.parser}
      disabled={disabled}
      controls={false}
      style={{ width: "100%" }}
      placeholder={placeholder}
    />
  );
}
