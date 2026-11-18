import { Table as AntTable, TableProps } from 'antd';

/**
 * Custom Table wrapper untuk Ant Design
 * Tujuannya agar mudah diubah saat upgrade/ganti library.
 */
const Table = <T extends object>({ ...rest }: TableProps<T>) => {
  return (
    <AntTable<T>
      bordered
      size="middle"
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        ...rest.style, // biar bisa override style dari luar
      }}
      {...rest}
    />
  );
};

export default Table;
