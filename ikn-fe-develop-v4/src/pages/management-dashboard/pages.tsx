import { Row, Col, Typography, Spin, DatePicker, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import {
  useMarketingSummary,
  useAkuntansiSummary,
  useWarehouseSummary,
} from './hooks/useDashboard';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Text } = Typography;
const { RangePicker } = DatePicker;

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionTheme = 'blue' | 'green' | 'amber';

interface DonutRingProps {
  percent: number;
  theme: SectionTheme;
  size?: number;
}

type DashboardCardProps = {
  title: React.ReactNode;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  percent?: number;
  percentageShow?: boolean;
  period?: {
    start?: string;
    end?: string;
  };
  onDetail?: () => void;
  theme: keyof typeof THEME;
  icon?: React.ReactNode;
  isInOut?: 'in' | 'out' | null;
};

// ─── Theme config (light, friendlier palette) ─────────────────────────────────

const THEME = {
  blue: {
    accent: '#2f6fd1',
    accentDark: '#1b4a94',
    cardBg: '#ffffff',
    cardBorder: 'rgba(47,111,209,.16)',
    iconBg: 'rgba(47,111,209,.10)',
    badgeBg: 'rgba(47,111,209,.08)',
    badgeBorder: 'rgba(47,111,209,.25)',
    donutBg: 'rgba(47,111,209,.12)',
    progressBg: 'rgba(47,111,209,.10)',
  },
  green: {
    accent: '#16a34a',
    accentDark: '#0f6b32',
    cardBg: '#ffffff',
    cardBorder: 'rgba(22,163,74,.16)',
    iconBg: 'rgba(22,163,74,.10)',
    badgeBg: 'rgba(22,163,74,.08)',
    badgeBorder: 'rgba(22,163,74,.25)',
    donutBg: 'rgba(22,163,74,.12)',
    progressBg: 'rgba(22,163,74,.10)',
  },
  amber: {
    accent: '#d97706',
    accentDark: '#92400e',
    cardBg: '#ffffff',
    cardBorder: 'rgba(217,119,6,.18)',
    iconBg: 'rgba(217,119,6,.10)',
    badgeBg: 'rgba(217,119,6,.08)',
    badgeBorder: 'rgba(217,119,6,.28)',
    donutBg: 'rgba(217,119,6,.12)',
    progressBg: 'rgba(217,119,6,.10)',
  },
};

// ─── DonutRing ────────────────────────────────────────────────────────────────

const DonutRing = ({ percent, theme, size = 52 }: DonutRingProps) => {
  const t = THEME[theme];
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(percent, 1));
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.donutBg} strokeWidth="5" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={t.accent}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset .6s ease' }}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill={t.accent}
        fontSize={size < 52 ? '9' : '10'}
        fontWeight="700"
        fontFamily="inherit"
      >
        {Math.round(percent * 100)}%
      </text>
    </svg>
  );
};

// ─── ProgressBar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ percent, theme }: { percent: number; theme: SectionTheme }) => {
  const t = THEME[theme];
  return (
    <div
      style={{ flex: 1, height: 5, borderRadius: 3, background: t.progressBg, overflow: 'hidden' }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.round(Math.min(percent, 1) * 100)}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${t.accentDark}, ${t.accent})`,
          transition: 'width .6s ease',
        }}
      />
    </div>
  );
};

// ─── DashboardCard ────────────────────────────────────────────────────────────

const DashboardCard = ({
  title,
  value,
  subValue,
  percent = 0,
  percentageShow = true,
  period,
  onDetail,
  theme,
  icon,
  isInOut = null,
}: DashboardCardProps) => {
  const t = THEME[theme];

  const inOutColor = isInOut === 'in' ? '#16a34a' : isInOut === 'out' ? '#dc2626' : t.accent;

  const inOutIconBg =
    isInOut === 'in' ? 'rgba(22,163,74,.12)' : isInOut === 'out' ? 'rgba(220,38,38,.12)' : t.iconBg;

  const defaultPeriod = {
    start: dayjs().format('DD/MM/YYYY'),
    end: dayjs().format('DD/MM/YYYY'),
  };

  const finalPeriod = period ?? defaultPeriod;

  const periodLabel =
    finalPeriod?.start && finalPeriod?.end
      ? `${finalPeriod.start} - ${finalPeriod.end}`
      : finalPeriod?.start || dayjs().format('DD/MM/YYYY');

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 10,
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow .2s, transform .2s',
        boxShadow: '0 1px 3px rgba(15,23,42,.06)',
        cursor: onDetail ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,23,42,.10)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${t.accentDark}, ${t.accent})`,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: inOutIconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: inOutColor,
            }}
          >
            {icon}
          </div>

          <Text style={{ color: '#475569', fontSize: 11, fontWeight: 500 }}>{title}</Text>
        </div>

        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            background: t.badgeBg,
            border: `1px solid ${t.badgeBorder}`,
            color: t.accentDark,
            whiteSpace: 'nowrap',
          }}
        >
          {periodLabel}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flex: 1,
        }}
      >
        <div>
          <div
            style={{
              color: '#0f172a',
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            {value}
          </div>

          {subValue && <div style={{ color: '#94a3b8', fontSize: 11 }}>{subValue}</div>}
        </div>

        {percentageShow && <DonutRing percent={percent} theme={theme} size={48} />}
      </div>

      {/* Footer */}
      {(percentageShow || onDetail) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            paddingTop: 8,
            borderTop: '1px solid rgba(15,23,42,.06)',
          }}
        >
          {percentageShow && (
            <>
              <ProgressBar percent={percent} theme={theme} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: t.accentDark,
                  minWidth: 30,
                }}
              >
                {Math.round(percent * 100)}%
              </span>
            </>
          )}

          {onDetail && (
            <button
              onClick={onDetail}
              style={{
                background: t.accent,
                border: 'none',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                height: 26,
                padding: '0 12px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(15,23,42,.15)',
                transition: 'background .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.accentDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = t.accent;
              }}
            >
              Detail
              <span style={{ fontSize: 12, lineHeight: 1 }}>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard = ({
  title,
  value,
  note,
  theme,
  icon,
  onDetail,
  period,
  isInOut = null,
}: {
  title: string;
  value: React.ReactNode;
  note?: string;
  theme: SectionTheme;
  icon: React.ReactNode;
  onDetail?: () => void;
  period?: {};
  isInOut?: 'in' | 'out' | null;
}) => {
  return (
    <DashboardCard
      title={title}
      value={value}
      subValue={note ? <span style={{ color: '#94a3b8' }}>{note}</span> : undefined}
      percentageShow={false}
      period={period}
      onDetail={onDetail}
      theme={theme}
      icon={icon}
      isInOut={isInOut}
    />
  );
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 14 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const I = {
  trendUp: 'M22 7L13.5 15.5L8.5 10.5L2 17M22 7h-6M22 7v6',
  fileInvoice:
    'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-6-4zM14 3v4h4M8 13h8M8 17h4',
  packageBox: 'M16.5 9.4L7.5 4.2M3 7v10l9 5 9-5V7l-9-5-9 5zM12 22V12M3 7l9 5 9-5',
  globe:
    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  receipt: 'M4 2h16l-2 7H6L4 2zM6 9l-2 13h16L18 9M9 13h6M9 17h6',
  fileDollar:
    'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-6-4zM14 3v4h4M10 13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2 .9-2 2 .9 2 2 2M12 11v1M12 17v1',
  plane:
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12',
  users:
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  chartLine: 'M22 12h-4l-3 9L9 3l-3 9H2',
  calculator:
    'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h6M8 18h8',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  bank: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10',
  wallet:
    'M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5H15a3 3 0 0 0 0 6h6',
  box: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12',
  stack: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  truckDelivery:
    'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  dashboard:
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  warehouse:
    'M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.33a2 2 0 0 1 1.48 0l8 3.33A2 2 0 0 1 22 8.35zM6 18h12M6 14h12M6 10h12',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number | string) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount));

const formatKg = (amount: number | string) =>
  new Intl.NumberFormat('id-ID', {
    style: 'unit',
    unit: 'kilogram',
    maximumFractionDigits: 2,
  }).format(Number(amount));

const formatCurrencyDollar = (amount: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));

const safePercentage = (
  numerator: number | string | undefined,
  denominator: number | string | undefined
) => {
  const num = Number(numerator) || 0;
  const den = Number(denominator) || 0;
  return den === 0 ? 0 : num / den;
};

// ─── Section Label ────────────────────────────────────────────────────────────

const SectionLabel = ({
  label,
  subtitle,
  theme,
  icon,
}: {
  label: string;
  subtitle?: string;
  theme: SectionTheme;
  icon: React.ReactNode;
}) => {
  const colors: Record<SectionTheme, string> = {
    blue: '#1b4a94',
    green: '#0f6b32',
    amber: '#92400e',
  };
  const color = colors[theme];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: `1px solid rgba(15,23,42,.08)`,
      }}
    >
      <span style={{ color, fontSize: 13 }}>{icon}</span>
      <span
        style={{
          color,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {subtitle && (
        <span style={{ color: '#94a3b8', fontSize: 10, marginLeft: 4 }}>— {subtitle}</span>
      )}
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${color}33, transparent)`,
          marginLeft: 8,
        }}
      />
    </div>
  );
};

// ─── Hero Panel (left image panel like screenshot) ────────────────────────────

// ─── Hero Panel (left image panel like screenshot) ────────────────────────────

const HeroPanel = ({
  period,
  imageUrl = '/images/dashboard-hero.jpg', // taruh file gambar di folder public/images/
}: {
  period?: { start?: string; end?: string };
  imageUrl?: string;
}) => (
  <div
    style={{
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
      height: '100%',
      minHeight: 200,
      background: '#ffffff',
      border: '1px solid rgba(15,23,42,.08)',
      boxShadow: '0 1px 3px rgba(15,23,42,.06)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Image area */}
    <div
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 160,
        background: '#12241a', // fallback color kalau gambar belum ke-load
      }}
    >
      <img
        src={imageUrl}
        alt="Management Dashboard"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => {
          // fallback kalau gambar tidak ditemukan
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Overlay gradient supaya teks tetap kebaca */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.65) 100%)',
        }}
      />

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          right: 14,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 3,
            color: '#fff',
            fontFamily: 'monospace',
            textShadow: '0 2px 8px rgba(0,0,0,.8)',
          }}
        >
          MANAGEMENT
          <br />
          DASHBOARD
        </div>
      </div>
    </div>

    {/* Info strip */}
    <div
      style={{
        padding: '10px 14px',
        background: '#ffffff',
        borderTop: '1px solid rgba(15,23,42,.06)',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: 9, letterSpacing: 1, marginBottom: 4 }}>
        PERIODE
      </div>
      <div style={{ color: '#92400e', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
        {period?.start ? `${period.start} - ${period.end}` : dayjs().format('MM/YYYY')}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
type Period = {
  start?: string;
  end?: string;
};
const ManagementDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    start: dayjs().format('DD/MM/YYYY'),
    end: dayjs().format('DD/MM/YYYY'),
  });

  const { data: marketingData, isLoading: isLoadingMarketing } =
    useMarketingSummary(selectedPeriod);
  const { data: akuntansiData, isLoading: isLoadingAkuntansi } =
    useAkuntansiSummary(selectedPeriod);
  const { data: warehouseData, isLoading: isLoadingWarehouse } =
    useWarehouseSummary(selectedPeriod);

  const isLoading = isLoadingMarketing || isLoadingAkuntansi || isLoadingWarehouse;

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f4f6f9',
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#2f6fd1' }} spin />} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px 20px',
        background: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(15,23,42,.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #1b4a94, #16a34a)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 15,
            }}
          >
            <Icon d={I.dashboard} size={15} />
          </div>
          <div>
            <div
              style={{
                color: '#0f172a',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                fontFamily: 'monospace',
              }}
            >
              MANAGEMENT DASHBOARD
            </div>
            <div style={{ color: '#64748b', fontSize: 10 }}>PT. Karet Nusantara</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={I.calendar} size={12} />
          <span style={{ color: '#64748b', fontSize: 11 }}>Periode:</span>
          <RangePicker
            picker="date"
            format="DD/MM/YYYY"
            placeholder={['Bulan Awal', 'Bulan Akhir']}
            defaultValue={[dayjs(), dayjs()]}
            onChange={(dates, dateStrings) => {
              setSelectedPeriod(
                dates
                  ? {
                      start: dateStrings[0],
                      end: dateStrings[1],
                    }
                  : {}
              );
            }}
            style={{
              width: 260,
              background: '#ffffff',
              border: '1px solid rgba(15,23,42,.15)',
              borderRadius: 6,
              color: '#334155',
              fontSize: 12,
            }}
          />
        </div>
      </div>

      {/* ── MARKETING section: hero left + cards right ─────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel
          label="Marketing"
          subtitle="Sales & Order"
          theme="blue"
          icon={<Icon d={I.trendUp} size={13} />}
        />

        <Row gutter={[12, 12]}>
          {/* Hero panel */}
          <Col xs={24} sm={24} md={6} lg={5}>
            <HeroPanel period={selectedPeriod} imageUrl="/pabrik 2.png" />{' '}
          </Col>

          {/* Cards */}
          <Col xs={24} sm={24} md={18} lg={19}>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Purchase Order (RA Lokal)"
                  icon={<Icon d={I.fileInvoice} size={13} />}
                  value={
                    <Tooltip title="Dikirim / Total">
                      {marketingData?.purchaseOrder?.approved?.count || 0} /{' '}
                      {marketingData?.purchaseOrder?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Dikirim / Total">
                      {formatCurrency(marketingData?.purchaseOrder?.approved?.totalAmount || 0)} /{' '}
                      {formatCurrency(marketingData?.purchaseOrder?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.purchaseOrder?.approved?.totalAmount,
                    marketingData?.purchaseOrder?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Purchase Order (RN Lokal)"
                  icon={<Icon d={I.packageBox} size={13} />}
                  value={
                    <Tooltip title="Dikirim / Total">
                      {marketingData?.purchaseOrderRn?.approved?.count || 0} /{' '}
                      {marketingData?.purchaseOrderRn?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Dikirim / Total">
                      {formatKg(marketingData?.purchaseOrderRn?.approved?.totalAmount || 0)} /{' '}
                      {formatKg(marketingData?.purchaseOrderRn?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.purchaseOrderRn?.approved?.totalAmount,
                    marketingData?.purchaseOrderRn?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=2')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Purchase Order (RN Ekspor)"
                  icon={<Icon d={I.globe} size={13} />}
                  value={
                    <Tooltip title="Dikirim / Total">
                      {marketingData?.purchaseOrderRnEkspor?.approved?.count || 0} /{' '}
                      {marketingData?.purchaseOrderRnEkspor?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Dikirim / Total">
                      {formatKg(marketingData?.purchaseOrderRnEkspor?.approved?.totalAmount || 0)} /{' '}
                      {formatKg(marketingData?.purchaseOrderRnEkspor?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.purchaseOrderRnEkspor?.approved?.totalAmount,
                    marketingData?.purchaseOrderRnEkspor?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=3')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Invoice Lokal (RA)"
                  icon={<Icon d={I.fileDollar} size={13} />}
                  value={
                    <Tooltip title="Lunas / Total">
                      {marketingData?.invoiceLokalRA?.lunas?.count || 0} /{' '}
                      {marketingData?.invoiceLokalRA?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Lunas / Total">
                      {formatCurrency(marketingData?.invoiceLokalRA?.lunas?.totalAmount || 0)} /{' '}
                      {formatCurrency(marketingData?.invoiceLokalRA?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.invoiceLokalRA?.lunas?.totalAmount,
                    marketingData?.invoiceLokalRA?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Invoice Lokal (RN)"
                  icon={<Icon d={I.fileDollar} size={13} />}
                  value={
                    <Tooltip title="Lunas / Total">
                      {marketingData?.invoiceLokalRN?.lunas?.count || 0} /{' '}
                      {marketingData?.invoiceLokalRN?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Lunas / Total">
                      {formatCurrency(marketingData?.invoiceLokalRN?.lunas?.totalAmount || 0)} /{' '}
                      {formatCurrency(marketingData?.invoiceLokalRN?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.invoiceLokalRN?.lunas?.totalAmount,
                    marketingData?.invoiceLokalRN?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=2')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Invoice Ekspor"
                  icon={<Icon d={I.plane} size={13} />}
                  value={
                    <Tooltip title="Lunas / Total">
                      {marketingData?.invoiceEkspor?.lunas?.count || 0} /{' '}
                      {marketingData?.invoiceEkspor?.total?.count || 0}
                    </Tooltip>
                  }
                  subValue={
                    <Tooltip title="Lunas / Total">
                      {formatCurrencyDollar(marketingData?.invoiceEkspor?.lunas?.totalAmount || 0)}{' '}
                      /{' '}
                      {formatCurrencyDollar(marketingData?.invoiceEkspor?.total?.totalAmount || 0)}
                    </Tooltip>
                  }
                  percent={safePercentage(
                    marketingData?.invoiceEkspor?.lunas?.totalAmount,
                    marketingData?.invoiceEkspor?.total?.totalAmount
                  )}
                  onDetail={() => navigate('/?tab=3')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <StatCard
                  theme="blue"
                  period={selectedPeriod}
                  title="SPB Lokal(RA)"
                  value={marketingData?.spb?.countRa || 0}
                  note="Total dokumen bulan ini"
                  icon={<Icon d={I.receipt} size={13} />}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <StatCard
                  theme="blue"
                  period={selectedPeriod}
                  title="SPB Lokal (RN)"
                  value={marketingData?.spb?.countRn || 0}
                  note="Total dokumen bulan ini"
                  icon={<Icon d={I.receipt} size={13} />}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <StatCard
                  theme="blue"
                  period={selectedPeriod}
                  title="SPB Ekspor (RN)"
                  value={marketingData?.spb?.countRnEkspor || 0}
                  note="Total dokumen bulan ini"
                  icon={<Icon d={I.receipt} size={13} />}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Sales Plan vs Actual (RA Lokal)"
                  icon={<Icon d={I.chartLine} size={13} />}
                  value={
                    <Tooltip title="Actual / Plan">
                      {formatCurrency(marketingData?.salesPlanVsActualRA?.actual || 0)}
                    </Tooltip>
                  }
                  subValue={`Plan: ${formatCurrency(marketingData?.salesPlanVsActualRA?.plan || 0)}`}
                  percent={safePercentage(
                    marketingData?.salesPlanVsActualRA?.actual,
                    marketingData?.salesPlanVsActualRA?.plan
                  )}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Sales Plan vs Actual (RN Lokal)"
                  icon={<Icon d={I.chartLine} size={13} />}
                  value={
                    <Tooltip title="Actual / Plan">
                      {formatKg(marketingData?.salesPlanVsActualRN?.actual || 0)}
                    </Tooltip>
                  }
                  subValue={`Plan: ${formatKg(marketingData?.salesPlanVsActualRN?.plan || 0)}`}
                  percent={safePercentage(
                    marketingData?.salesPlanVsActualRN?.actual,
                    marketingData?.salesPlanVsActualRN?.plan
                  )}
                  onDetail={() => navigate('/?tab=2')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <DashboardCard
                  theme="blue"
                  period={selectedPeriod}
                  title="Sales Plan vs Actual (RN Ekspor)"
                  icon={<Icon d={I.chartLine} size={13} />}
                  value={
                    <Tooltip title="Actual / Plan">
                      {formatKg(marketingData?.salesPlanVsActualRNEkspor?.actual || 0)}
                    </Tooltip>
                  }
                  subValue={`Plan: ${formatKg(marketingData?.salesPlanVsActualRNEkspor?.plan || 0)}`}
                  percent={safePercentage(
                    marketingData?.salesPlanVsActualRNEkspor?.actual,
                    marketingData?.salesPlanVsActualRNEkspor?.plan
                  )}
                  onDetail={() => navigate('/?tab=3')}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <StatCard
                  theme="blue"
                  period={selectedPeriod as string}
                  title="Customer"
                  value={marketingData?.customer?.count || 0}
                  note="Customer aktif"
                  icon={<Icon d={I.users} size={13} />}
                  onDetail={() => navigate('/?tab=1')}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* ── AKUNTANSI ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel
          label="Akuntansi"
          subtitle="Kas & Bank"
          theme="green"
          icon={<Icon d={I.calculator} size={13} />}
        />

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={12} lg={6}>
            <StatCard
              theme="green"
              period={selectedPeriod as string}
              title="Cash Flow (In)"
              value={formatCurrency(akuntansiData?.cashFlowToday?.in || 0)}
              note="Total masuk bulan ini"
              icon={<Icon d={I.arrowDown} size={13} />}
              isInOut="in"
              onDetail={() => navigate('/?tab=4')}
            />
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <StatCard
              theme="green"
              period={selectedPeriod as string}
              title="Cash Flow (Out)"
              value={formatCurrency(akuntansiData?.cashFlowToday?.out || 0)}
              note="Total keluar bulan ini"
              icon={<Icon d={I.arrowUp} size={13} />}
              isInOut="out"
              onDetail={() => navigate('/?tab=4')}
            />
          </Col>

          {akuntansiData?.bankBalances?.map(
            (
              item: {
                bankName: string;
                balance: number;
                balanceDollar?: number;
                year: string;
                isDollar?: boolean;
              },
              index: number
            ) => (
              <>
                {!item.isDollar ? (
                  <Col xs={24} sm={12} md={12} lg={6} key={`bank-${index}`}>
                    <StatCard
                      theme="green"
                      period={selectedPeriod as string}
                      title={item.bankName}
                      value={formatCurrency(item.balance)}
                      icon={<Icon d={I.bank} size={13} />}
                      onDetail={() => navigate('/?tab=4')}
                    />
                  </Col>
                ) : (
                  ''
                )}
              </>
            )
          )}

          {akuntansiData?.bankBalances?.map(
            (
              item: {
                bankName: string;
                balance: number;
                balanceDollar?: number;
                year: string;
                isDollar?: boolean;
              },
              index: number
            ) => (
              <>
                {item.isDollar ? (
                  <Col xs={24} sm={12} md={12} lg={6} key={`bank-dollar-${index}`}>
                    <StatCard
                      theme="green"
                      period={selectedPeriod as string}
                      title={item.bankName}
                      value={formatCurrencyDollar(item.balanceDollar || 0)}
                      icon={<Icon d={I.bank} size={13} />}
                      onDetail={() => navigate('/?tab=4')}
                    />
                  </Col>
                ) : (
                  ''
                )}
              </>
            )
          )}

          {akuntansiData?.expenseSummary?.map(
            (item: { accountCode: string; category: string; value: number }, index: number) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`expense-${index}`}>
                <StatCard
                  theme="green"
                  period={selectedPeriod as string}
                  title={item.category}
                  value={formatCurrency(item.value)}
                  note={`Kode: ${item.accountCode}`}
                  icon={<Icon d={I.wallet} size={13} />}
                  onDetail={() => navigate('/?tab=4')}
                />
              </Col>
            )
          )}
        </Row>
      </div>

      {/* ── WAREHOUSE ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel
          label="Warehouse (Gudang)"
          subtitle="Stok & Pergerakan"
          theme="amber"
          icon={<Icon d={I.warehouse} size={13} />}
        />

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <StatCard
              theme="amber"
              period={selectedPeriod as string}
              title="SKU Finished Good"
              value={warehouseData?.sku?.finishedGood || 0}
              note="Produk aktif"
              icon={<Icon d={I.box} size={13} />}
              onDetail={() => navigate('/?tab=7')}
            />
          </Col>

          {warehouseData?.sku?.rawMaterial?.map(
            (item: { unitName: string; count: number }, index: number) => (
              <Col xs={24} sm={12} md={12} lg={12} key={`raw-material-${index}`}>
                <StatCard
                  theme="amber"
                  period={selectedPeriod as string}
                  title={`SKU Raw Material (${item.unitName})`}
                  value={item.count}
                  note={`Bahan baku (Produk Aktif)`}
                  icon={<Icon d={I.stack} size={13} />}
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}

          {warehouseData?.stockMovementToday?.finishedGood?.byUnit?.map(
            (item: { unitName: string; in: number; out: number }, index: number) => (
              <Col xs={24} sm={12} md={12} lg={12} key={`stock-in-${index}`}>
                <StatCard
                  theme="amber"
                  period={selectedPeriod as string}
                  title={`Stock In (Finished)-(${item.unitName})`}
                  value={item.in}
                  note={`Unit masuk (${item.unitName})`}
                  icon={<Icon d={I.arrowDown} size={13} />}
                  isInOut="in"
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}

          {warehouseData?.stockMovementToday?.finishedGood?.byUnit?.map(
            (item: { unitName: string; in: number; out: number }, index: number) => (
              <Col xs={24} sm={12} md={12} lg={12} key={`stock-out-${index}`}>
                <StatCard
                  theme="amber"
                  period={selectedPeriod as string}
                  title="Stock Out (Finished)"
                  value={item.out}
                  note={`Unit keluar (${item.unitName})`}
                  icon={<Icon d={I.arrowUp} size={13} />}
                  isInOut="out"
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}

          {warehouseData?.stockMovementToday?.rawMaterial?.byUnit?.map(
            (item: { unitName: string; in: number; out: number }, index: number) => (
              <Col xs={24} sm={12} md={12} lg={12} key={`stock-in-${index}`}>
                <StatCard
                  theme="amber"
                  period={selectedPeriod as string}
                  title={`Stock In (Raw)-(${item.unitName})`}
                  value={item.in}
                  note={`Kg masuk (${item.unitName})`}
                  icon={<Icon d={I.arrowDown} size={13} />}
                  isInOut="in"
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}

          {warehouseData?.stockMovementToday?.rawMaterial?.byUnit?.map(
            (item: { unitName: string; in: number; out: number }, index: number) => (
              <Col xs={24} sm={12} md={12} lg={12} key={`stock-in-${index}`}>
                <StatCard
                  theme="amber"
                  period={selectedPeriod as string}
                  title={`Stock In (Raw)-(${item.unitName})`}
                  value={item.out}
                  note={`Kg keluar (${item.unitName})`}
                  icon={<Icon d={I.arrowUp} size={13} />}
                  isInOut="out"
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}

          {warehouseData?.deliveryOrder?.byUnit.map(
            (item: { unitName: string; selected: number; total: number }, index: number) => (
              <Col xs={24} sm={24} md={12} lg={12} key={`delivery-order-${index}`}>
                <DashboardCard
                  theme="amber"
                  period={selectedPeriod}
                  title={`Delivery Order - ${item.unitName} (Dikirim / Total)`}
                  icon={<Icon d={I.truckDelivery} size={13} />}
                  value={
                    <Tooltip title="Dikirim / Total">
                      {item.selected} / {item.total}
                    </Tooltip>
                  }
                  subValue="DO terkirim bulan ini"
                  percent={safePercentage(item.selected, item.total)}
                  onDetail={() => navigate('/?tab=7')}
                />
              </Col>
            )
          )}
        </Row>
      </div>
    </div>
  );
};

export default ManagementDashboard;
