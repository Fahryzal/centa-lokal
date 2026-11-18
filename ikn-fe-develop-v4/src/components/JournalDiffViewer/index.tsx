import { Tag, Typography, Tooltip, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export interface JournalFieldChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
  tag?: 'MIRROR_CREATE' | 'MIRROR_DELETE' | 'MIRROR_UPDATE';
}

interface JournalDiffViewerProps {
  journalNumber?: string;
  changes: JournalFieldChange[];
  onApply?: () => void;
  onDismiss?: () => void;
  loading?: boolean;
  /** Tampilkan tombol apply/dismiss atau tidak */
  showActions?: boolean;
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function formatValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object' && 'debit' in val && 'credit' in val) {
    const parts = [];
    if (val.debit > 0) parts.push(`D: ${Number(val.debit).toLocaleString('id-ID')}`);
    if (val.credit > 0) parts.push(`K: ${Number(val.credit).toLocaleString('id-ID')}`);
    return parts.length ? parts.join(' | ') : '0';
  }
  if (typeof val === 'number') return Number(val).toLocaleString('id-ID');
  if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) return val.slice(0, 10);
  return String(val);
}

function getChangeType(change: JournalFieldChange): 'added' | 'removed' | 'modified' | 'mirror' {
  if (change.tag) return 'mirror';
  if (change.oldValue === null) return 'added';
  if (change.newValue === null) return 'removed';
  return 'modified';
}

function isNoChange(change: JournalFieldChange): boolean {
  return formatValue(change.oldValue) === formatValue(change.newValue);
}

// ─────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────
// function ChangeTypeBadge({ type }: { type: ReturnType<typeof getChangeType> }) {
//   const config = {
//     added: { color: '#52c41a', icon: <PlusCircleOutlined />, label: 'Baru' },
//     removed: { color: '#ff4d4f', icon: <MinusCircleOutlined />, label: 'Dihapus' },
//     modified: { color: '#faad14', icon: <EditOutlined />, label: 'Diubah' },
//     mirror: { color: '#1677ff', icon: <SwapOutlined />, label: 'Mirror' },
//   };
//   const c = config[type];
//   return (
//     <span
//       style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: c.color, fontSize: 12 }}
//     >
//       {c.icon} {c.label}
//     </span>
//   );
// }

function ValueCell({ value, highlight }: { value: any; highlight?: 'red' | 'green' | 'none' }) {
  const formatted = formatValue(value);
  if (formatted === '—') {
    return (
      <Text type="secondary" style={{ fontSize: 13 }}>
        —
      </Text>
    );
  }

  const colorMap = {
    red: { bg: '#fff2f0', border: '#ffccc7', text: '#cf1322' },
    green: { bg: '#f6ffed', border: '#b7eb8f', text: '#389e0d' },
    none: { bg: '#fafafa', border: '#d9d9d9', text: '#595959' },
  };
  const c = colorMap[highlight ?? 'none'];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 6,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: highlight !== 'none' ? 600 : 400,
      }}
    >
      {formatted}
    </span>
  );
}

function DiffRow({ change, index }: { change: JournalFieldChange; index: number }) {
  const noChange = isNoChange(change);

  // Jika nilai sama persis, tetap tampilkan tapi dengan styling netral
  const oldHighlight = noChange ? 'none' : ((change.oldValue !== null ? 'red' : 'none') as any);
  const newHighlight = noChange ? 'none' : ((change.newValue !== null ? 'green' : 'none') as any);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 160px 1fr 24px 1fr 100px',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: index % 2 === 0 ? '#ffffff' : '#fafafa',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fafafa')
      }
    >
      {/* No urut */}
      <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
        {index + 1}
      </Text>

      {/* Label field */}
      <Tooltip title={change.field}>
        <Text
          strong
          style={{
            fontSize: 13,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {change.label}
        </Text>
      </Tooltip>

      {/* Nilai lama */}
      <div>
        <ValueCell value={change.oldValue} highlight={oldHighlight} />
      </div>

      {/* Arrow */}
      <Text type="secondary" style={{ textAlign: 'center' }}>
        →
      </Text>

      {/* Nilai baru */}
      <div>
        <ValueCell value={change.newValue} highlight={newHighlight} />
      </div>

      {/* Badge tipe perubahan */}
      {/* <div style={{ textAlign: 'right' }}>
        <ChangeTypeBadge type={type} />
      </div> */}
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export function JournalDiffViewer({
  journalNumber,
  changes,
  onApply,
  onDismiss,
  loading = false,
  showActions = true,
}: JournalDiffViewerProps) {
  if (!changes || changes.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Tidak ada perubahan pada jurnal"
        style={{ padding: '24px 0' }}
      />
    );
  }

  const countModified =
    changes?.filter((c) => getChangeType(c) === 'modified' && !isNoChange(c))?.length || 0;
  const countAdded = changes?.filter((c) => getChangeType(c) === 'added').length || 0;
  const countRemoved = changes?.filter((c) => getChangeType(c) === 'removed').length || 0;
  const countMirror = changes?.filter((c) => getChangeType(c) === 'mirror').length || 0;

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden' }}>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: '#fffbe6',
          borderBottom: '1px solid #ffe58f',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileTextOutlined style={{ color: '#faad14', fontSize: 18 }} />
          <div>
            <Title level={5} style={{ margin: 0, fontSize: 14 }}>
              Perubahan Detail Jurnal
            </Title>
            {journalNumber && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {journalNumber}
              </Text>
            )}
          </div>
        </div>

        {/* Summary badge */}
        <div style={{ display: 'flex', gap: 6 }}>
          {countModified > 0 && <Tag color="warning">{countModified} diubah</Tag>}
          {countAdded > 0 && <Tag color="success">{countAdded} baru</Tag>}
          {countRemoved > 0 && <Tag color="error">{countRemoved} dihapus</Tag>}
          {countMirror > 0 && <Tag color="processing">{countMirror} mirror</Tag>}
        </div>
      </div>

      {/* ── Column header ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '28px 160px 1fr 24px 1fr 100px',
          gap: 12,
          padding: '8px 16px',
          background: '#f5f5f5',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        {['#', 'Field', 'Nilai Lama', '', 'Nilai Baru'].map((h, i) => (
          <Text
            key={i}
            type="secondary"
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: i === 3 ? 'center' : undefined,
            }}
          >
            {h}
          </Text>
        ))}
      </div>

      {/* ── Rows ── */}
      <div>
        {changes.map((change, i) => (
          <DiffRow key={change.field} change={change} index={i} />
        ))}
      </div>

      {/* ── Footer actions ── */}
      {showActions && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 16px',
            background: '#fafafa',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {onDismiss && (
            <button
              onClick={onDismiss}
              disabled={loading}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: '1px solid #d9d9d9',
                background: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                color: '#595959',
              }}
            >
              Abaikan
            </button>
          )}
          {onApply && (
            <button
              onClick={onApply}
              disabled={loading}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: 'none',
                background: loading ? '#d9d9d9' : '#1677ff',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {loading ? 'Menerapkan...' : 'Terapkan ke Jurnal'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
