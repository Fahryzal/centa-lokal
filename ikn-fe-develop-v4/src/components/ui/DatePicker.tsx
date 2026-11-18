import { DatePicker as AntDatePicker, DatePickerProps } from 'antd';

/**
 * Custom DatePicker wrapper untuk Ant Design
 */
const DatePicker = ({ ...rest }: DatePickerProps) => {
  return (
    <AntDatePicker
      format="DD/MM/YYYY"
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

export default DatePicker;
