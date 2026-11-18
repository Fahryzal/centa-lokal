import React from 'react';
import { Input as AntInput, InputProps } from 'antd';

/**
 * Custom Input wrapper untuk Ant Design
 * Tujuan: agar bisa diganti/diupgrade dengan mudah tanpa ubah semua page.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref: any) => {
  return (
    <AntInput
      ref={ref}
      // allowClear
      // size="middle"
      style={{
        // borderRadius: 8,
        ...props.style, // biar bisa override style dari luar
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input'; // ✅ penting supaya gak muncul warning di devtools

export default Input;
