import { Plus } from "@phosphor-icons/react";

export default function TitleCardAdd({ title }: Readonly<{ title: string }>) {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Plus />
      <p>{title}</p>
    </div>
  );
}
