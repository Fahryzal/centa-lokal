import { InputNumber as AntInputNumber, InputNumberProps } from 'antd';

/**
 * Custom InputNumber wrapper untuk Ant Design
 */
const InputNumber = ({ ...rest }: InputNumberProps) => {
  return (
    <AntInputNumber
      controls={false}
      size="middle"
      style={{
        width: '100%',
        borderRadius: 8,
        ...rest.style,
      }}
      {...rest}
    />
  );
};

export default InputNumber;
