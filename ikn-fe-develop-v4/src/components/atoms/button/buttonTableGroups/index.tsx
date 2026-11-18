import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export const ButtonDetailGroup = ({
  onClick,
  disabled,
}: Readonly<{ onClick: () => void; disabled?: boolean }>) => {
  return (
    <Button
      style={{
        backgroundColor: '#3D90D7',
        borderColor: '#3D90D7',
        color: 'white',
      }}
      icon={<EyeOutlined />}
      onClick={onClick}
      disabled={disabled}
    >
      Detail
    </Button>
  );
};

export const ButtonEditGroup = ({
  onClick,
  disabled,
  text = 'Edit',
}: Readonly<{ onClick: () => void; disabled?: boolean; text?: string }>) => {
  return (
    <Button
      style={{
        backgroundColor: `${disabled ? 'rgba(0, 0, 0, 0.04)' : '#328E6E'}`,
        borderColor: `${disabled ? 'rgba(0, 0, 0, 0.04)' : '#328E6E'}`,
        color: `${disabled ? 'rgba(0, 0, 0, 0.25)' : 'white'}`,
      }}
      disabled={disabled}
      icon={<EditOutlined />}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export const ButtonDeleteGroup = ({
  onClick,
  disabled,
}: Readonly<{ onClick?: () => void; disabled?: boolean }>) => {
  return (
    <Button
      type="primary"
      style={{
        backgroundColor: '#FF0B55',
        borderColor: '#FF0B55',
        color: 'white',
      }}
      disabled={disabled}
      icon={<DeleteOutlined />}
      onClick={onClick}
    >
      Delete
    </Button>
  );
};
