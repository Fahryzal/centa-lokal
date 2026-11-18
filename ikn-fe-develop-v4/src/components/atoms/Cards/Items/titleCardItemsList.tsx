import { ListBullets } from "@phosphor-icons/react";

export default function TitleCardItemsList({title}: Readonly<{title: string}>){
    return(
        <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <ListBullets />
              <p>{title}</p>
            </div>
    )
}