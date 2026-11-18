import { EditFilled } from "@ant-design/icons";

export default function TitleCardEdit({title}: Readonly <{title: string}>) {
    return(
        <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: 'center'
        }}
      >
        <EditFilled />
        <p>{title}</p>
      </div>
    )
}