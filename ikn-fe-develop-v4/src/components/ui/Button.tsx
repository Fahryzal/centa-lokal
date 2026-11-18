import React from 'react';
import { Button as AntButton, ButtonProps } from 'antd';

/**
 * Custom Button wrapper untuk Ant Design
 * agar mudah diubah nanti kalau ganti library.
 */
const Button: React.FC<ButtonProps> = (props) => {
  return <AntButton {...props} />;
};

export default Button;
