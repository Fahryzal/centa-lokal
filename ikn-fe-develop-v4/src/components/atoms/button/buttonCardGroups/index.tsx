import { DownloadOutlined } from '@ant-design/icons';
import { Eye } from '@phosphor-icons/react';
import { Button } from 'antd';
import { ReactNode } from 'react';

export const ButtonFile = ({
  onClick,
  text = 'Cetak PDF',
  icon,
  color = 'green',
  disabled = false,
  loading = false,
}: Readonly<{
  disabled?: boolean;
  onClick: () => void;
  text?: string;
  icon?: ReactNode;
  color?:
    | 'green'
    | 'blue'
    | 'cyan'
    | 'gold'
    | 'lime'
    | 'magenta'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'red'
    | 'yellow'
    | 'default'
    | 'primary'
    | 'danger'
    | 'volcano'
    | 'geekblue'
    | undefined;
  loading?: boolean;
}>) => {
  return (
    <Button
      disabled={disabled}
      loading={loading}
      variant="outlined"
      color={color}
      onClick={onClick}
      icon={!icon ? <DownloadOutlined /> : icon}
    >
      {text}
    </Button>
  );
};
export const ButtonViewImage = ({ onClick }: Readonly<{ onClick: () => void }>) => {
  return (
    <Button
      style={{
        backgroundColor: '#077A7D',
        borderColor: '#077A7D',
        color: 'white',
      }}
      onClick={onClick}
      icon={<Eye />}
    >
      Lihat Gambar
    </Button>
  );
};
