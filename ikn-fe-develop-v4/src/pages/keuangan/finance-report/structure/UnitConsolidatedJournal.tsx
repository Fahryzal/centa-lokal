import React from 'react';
import { DatePicker, Space } from 'antd';
import { formatCurrency } from '@/utils/generatePdf/generateInvoicePDF';
import TableDragDrop from '@/components/atoms/table/TableDragDrop';

const { RangePicker } = DatePicker;

// Contoh data hasil konsolidasi jurnal
const exampleData = {
  success: true,
  status: 200,
  message: 'Request successfully processed',
  timestamp: '2025-08-08T14:15:01.240Z',
  data: {
    incomeStatement: {
      revenue: 110000,
      expense: 0,
      netIncome: 110000,
    },
    balanceSheet: {
      asset: 16122200,
      liability: 12200,
      equity: 110000,
    },
    changesInEquity: {
      openingEquity: 0,
      netIncome: 110000,
      closingEquity: 110000,
    },
    summary: {
      totalDebit: 16122200,
      totalCredit: 233300,
    },
  },
};

const columns = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text: number) => <span>{formatCurrency(text)}</span>,
  },
];

const UnitConsolidatedJournal: React.FC = () => {
  // Contoh data untuk ditampilkan
  const data = [
    { key: '1', category: 'Revenue', amount: exampleData.data.incomeStatement.revenue },
    { key: '2', category: 'Expense', amount: exampleData.data.incomeStatement.expense },
    { key: '3', category: 'Net Income', amount: exampleData.data.incomeStatement.netIncome },
    { key: '4', category: 'Asset', amount: exampleData.data.balanceSheet.asset },
    { key: '5', category: 'Liability', amount: exampleData.data.balanceSheet.liability },
    { key: '6', category: 'Equity', amount: exampleData.data.balanceSheet.equity },
  ];

  // Fungsi untuk filter data berdasarkan rentang tanggal
  const handleDateFilterChange = () => {};

  return (
    <TableDragDrop
      scroll={{ x: 'max-content' }} // Hindari overflow
      titleCard="Unit Konsolidasi Journal"
      loading={false}
      baseColumns={columns}
      dataSource={data}
      Other={
        <div
          style={{
            padding: 10,
          }}
        >
          <Space direction="vertical" style={{ marginBottom: 16 }}>
            <RangePicker onChange={handleDateFilterChange} />
          </Space>
        </div>
      }
    />
  );
};

export default UnitConsolidatedJournal;
