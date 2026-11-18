import { terbilangRupiah } from "@/utils/helper";
import { masterColors } from "@/utils/matser-color";
import { Form, FormInstance } from "antd";

export default function TextTerbilang({
  form,
  properti
}: Readonly<{ form: FormInstance, properti: string }>) {
  return (
    <i
      style={{
        color: masterColors.green,
        textTransform: "capitalize",
        textDecoration: "underline",
      }}
    >
      Terbilang: {terbilangRupiah(Form.useWatch(properti, form))}
    </i>
  );
}
