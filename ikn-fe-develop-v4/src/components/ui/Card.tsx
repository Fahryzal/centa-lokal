import React from 'react';
import { Card as AntCard, CardProps } from 'antd';

/**
 * Custom Card wrapper untuk Ant Design
 * Supaya nanti kalau ganti library / custom style cukup ubah di sini.
 */
const Card: React.FC<CardProps> = ({ children, ...rest }) => {
  return (
    <AntCard
      {...rest}
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        ...rest.style, // biar bisa override dari luar
      }}
    >
      {children}
    </AntCard>
  );
};

export default Card;
