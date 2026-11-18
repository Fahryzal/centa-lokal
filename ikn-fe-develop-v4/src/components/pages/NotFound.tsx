import React from 'react';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan."
      extra={
        <Button type="primary" icon={<HomeOutlined />} onClick={() => (window.location.href = '/')}>
          Kembali ke Beranda
        </Button>
      }
      style={{
        minHeight: '100vh',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        background: '#f5f5f5',
      }}
    />
  );
};

export default NotFound;
