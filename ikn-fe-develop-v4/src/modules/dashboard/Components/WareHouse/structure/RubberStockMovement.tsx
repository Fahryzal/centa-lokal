import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Aktiva Lancar', amount: 4000 },
  { name: 'Aktiva Tetap', amount: 3000 },
  { name: 'Aktiva Lainnya', amount: 2000 },
  { name: 'Kewajiban', amount: 2780 },
  { name: 'Modal', amount: 1890 },
];

export default function BalanceSheetChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map((entry, index) => (
          <Bar
            key={entry.name}
            dataKey="amount"
            name={entry.name}
            fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'][index % 5]} // kasih warna beda
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
