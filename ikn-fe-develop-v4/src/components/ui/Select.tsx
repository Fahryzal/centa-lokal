import { Select as AntSelect, SelectProps } from 'antd';

/**
 * Custom Select wrapper untuk Ant Design
 */
const Select = <T extends object = any>({ ...rest }: SelectProps<T>) => {
  return (
    <AntSelect<T>
      showSearch
      allowClear
      size="middle"
      optionFilterProp="label"
      style={{
        width: '100%',
        borderRadius: 8,
        ...rest.style,
      }}
      {...rest}
    />
  );
};

export default Select;
