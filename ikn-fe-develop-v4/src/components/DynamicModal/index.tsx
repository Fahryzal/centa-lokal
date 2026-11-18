import { useState } from 'react';
import { Modal, Button, Typography } from 'antd';
import {
  CheckCircleFilled,
  InfoCircleFilled,
  WarningFilled,
  CloseCircleFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type ModalType = 'danger' | 'info' | 'success' | 'warning';

interface DynamicModalConfig {
  type: ModalType;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// ─────────────────────────────────────────
// CONFIG PER TYPE
// ─────────────────────────────────────────
const modalTypeConfig: Record<
  ModalType,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    confirmBtnType: 'primary' | 'default';
    confirmBtnDanger: boolean;
    confirmBtnStyle?: React.CSSProperties;
  }
> = {
  danger: {
    icon: <CloseCircleFilled style={{ fontSize: 40, color: '#ff4d4f' }} />,
    color: '#ff4d4f',
    bg: '#fff2f0',
    border: '#ffccc7',
    confirmBtnType: 'primary',
    confirmBtnDanger: true,
  },
  warning: {
    icon: <WarningFilled style={{ fontSize: 40, color: '#faad14' }} />,
    color: '#faad14',
    bg: '#fffbe6',
    border: '#ffe58f',
    confirmBtnType: 'primary',
    confirmBtnDanger: false,
    confirmBtnStyle: { backgroundColor: '#faad14', borderColor: '#faad14' },
  },
  info: {
    icon: <InfoCircleFilled style={{ fontSize: 40, color: '#1677ff' }} />,
    color: '#1677ff',
    bg: '#e6f4ff',
    border: '#91caff',
    confirmBtnType: 'primary',
    confirmBtnDanger: false,
  },
  success: {
    icon: <CheckCircleFilled style={{ fontSize: 40, color: '#52c41a' }} />,
    color: '#52c41a',
    bg: '#f6ffed',
    border: '#b7eb8f',
    confirmBtnType: 'primary',
    confirmBtnDanger: false,
    confirmBtnStyle: { backgroundColor: '#52c41a', borderColor: '#52c41a' },
  },
};

// ─────────────────────────────────────────
// HOOK — useDynamicModal
// ─────────────────────────────────────────
export function useDynamicModal() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<DynamicModalConfig>({
    type: 'info',
    title: '',
    description: '',
  });

  const showModal = (cfg: DynamicModalConfig) => {
    setConfig(cfg);
    setOpen(true);
  };

  const hideModal = () => setOpen(false);

  const handleConfirm = () => {
    config.onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    config.onCancel?.();
    hideModal();
  };

  return { open, config, showModal, hideModal, handleConfirm, handleCancel };
}

// ─────────────────────────────────────────
// COMPONENT — DynamicModal
// ─────────────────────────────────────────
interface DynamicModalProps {
  open: boolean;
  config: DynamicModalConfig;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DynamicModal({ open, config, onConfirm, onCancel }: DynamicModalProps) {
  const typeConfig = modalTypeConfig[config.type];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={440}
      styles={{
        content: { padding: 0, overflow: 'hidden', borderRadius: 12 },
      }}
    >
      {/* Header strip */}
      <div
        style={{
          height: 6,
          background: typeConfig.color,
          borderRadius: '12px 12px 0 0',
        }}
      />

      {/* Body */}
      <div style={{ padding: '32px 32px 24px' }}>
        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div
            style={{
              flexShrink: 0,
              width: 56,
              height: 56,
              borderRadius: 12,
              background: typeConfig.bg,
              border: `1px solid ${typeConfig.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeConfig.icon}
          </div>

          <div style={{ flex: 1, paddingTop: 4 }}>
            <Title level={5} style={{ margin: 0, marginBottom: 6, fontSize: 16 }}>
              {config.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>
              {config.description}
            </Text>
          </div>
        </div>

        {/* Footer buttons */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <Button onClick={onCancel}>{config.cancelText ?? 'Batal'}</Button>

          {config.onConfirm && (
            <Button
              type={typeConfig.confirmBtnType}
              danger={typeConfig.confirmBtnDanger}
              style={typeConfig.confirmBtnStyle}
              onClick={onConfirm}
            >
              {config.confirmText ?? 'Konfirmasi'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
