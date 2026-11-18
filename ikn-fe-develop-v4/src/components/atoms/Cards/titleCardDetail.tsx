import { Eye } from "@phosphor-icons/react";

export default function TitleCardDetail({title}: Readonly <{title: string}>) {
    return(
        <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: 'center'
        }}
      >
        <Eye />
        <p>{title}</p>
      </div>
    )
}