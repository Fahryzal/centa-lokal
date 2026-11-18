import { DatePicker, InputNumber, Select } from 'antd';
import { useState } from 'react';
import { Input } from 'antd';

import { Unite } from '@phosphor-icons/react';
import * as SalesPlanAxios from '@pages/marketing/sales-plan/service/SalesPlanAxios';

import * as globalHelpers from '@/utils/helper';
import * as globalHooks from '@/hooks';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
// Extend dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const RenderInput = (
  dataIndex: string,
  setSelectedKeys: Function,
  selectedKeys: any,
  handleSearch: Function,
  searchInput: any
) => {
  const commonStyle = { marginBottom: 8, display: 'block', width: '100%' };

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
  });

  globalHooks.useFetchOptions(unit, setUnit, SalesPlanAxios.fetchDataUnit, [unit.nama]);

  const onSearchUnit = globalHooks.useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  const handleDateChange = (format: string) => (value: dayjs.Dayjs | null) => {
    setSelectedKeys(value ? [value.format(format)] : []);
  };

  if (dataIndex.includes('periode_month')) {
    return (
      <DatePicker
        format="MM/YYYY"
        picker="month"
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0]), 'MM/YYYY') : undefined}
        onChange={handleDateChange('MM/YYYY')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('date')) {
    return (
      <DatePicker
        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : undefined}
        onChange={handleDateChange('YYYY-MM-DDTHH:mm:ss.SSSZ')}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('value_rkap')) {
    return (
      <InputNumber
        formatter={globalHelpers.formatter}
        parser={globalHelpers.parser}
        placeholder={`Search ${dataIndex}`}
        value={Number(selectedKeys[0]) || 0}
        onChange={(value) => setSelectedKeys(value !== undefined && value !== null ? [value] : [])}
        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
        controls={false}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('status')) {
    return (
      <Select
        showSearch
        placeholder="Pilih status"
        optionFilterProp="label"
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={[
          { value: 'PENDING', label: 'PENDING' },
          { value: 'APPROVED', label: 'APPROVED' },
          { value: 'REJECTED', label: 'REJECTED' },
          { value: 'VERIFED', label: 'VERIFED' },
        ]}
        style={commonStyle}
      />
    );
  }

  if (dataIndex.includes('unit')) {
    return (
      <Select
        prefix={<Unite />}
        showSearch
        loading={unit.loading}
        placeholder="Pilih unit"
        optionFilterProp="label"
        onChange={(value) => {
          setSelectedKeys(value ? [value.split('$')[1]] : []);
          setUnit((prev) => ({ ...prev, nama: '' }));
        }}
        onSearch={onSearchUnit}
        options={globalHelpers.toAntdOptions(unit.data || [], 'kode', 'nama')}
        style={commonStyle}
      />
    );
  }

  return (
    <Input
      ref={searchInput}
      placeholder={`Search ${dataIndex}`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
      style={commonStyle}
    />
  );
};

export default RenderInput;
