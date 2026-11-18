import { AppWindow } from "@phosphor-icons/react";

export default function TitleCardItems({title}: Readonly<{title: string}>){
    return(
        <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <AppWindow />
              <p>{title}</p>
            </div>
    )
}