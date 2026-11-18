import { Button } from "antd";

export const GreenButton = ({title}: Readonly<{title:  string, onClick?: Function}>) => {
  return (
    <Button 
      type="primary" 
      onClick={() => onclick}
      style={{ backgroundColor: "green", borderColor: "green" }}
    >
      {title}
    </Button>
  );
};
