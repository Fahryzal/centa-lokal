import { Alert } from 'antd';

const AlertCustome = () => {
  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e, 'I was closed.');
  };

  return (
    <Alert
      message="Terjadi Kesalahan"
      description="Internal Server Error"
      type="error"
      closable
      onClose={onClose}
    />
  );
};

export default AlertCustome;
