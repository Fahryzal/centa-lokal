import { Bank } from "@phosphor-icons/react";

export default function TitleCardPublic({ title }: Readonly<{ title: string }>) {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Bank />
      <p>{title}</p>
    </div>
  );
}
