import { Component, StrictMode, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { AccessProvider } from '@/contexts/AccessContext.tsx';
import { NotificationProvider } from './contexts/Provider/NotificationProvider.tsx';
import ReactQueryProvider from './contexts/Provider/ReactQueryProvider.tsx';
import { initGlobalErrorReporting, logClientError } from '@/api/axiosInstance';
import { Button, List, Modal, Typography } from 'antd';
import { CheckCircleFilled, ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logClientError({
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
      metadata: {
        kind: 'react-error-boundary',
      },
    });
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

initGlobalErrorReporting();

type ReleaseInfo = {
  release: string;
  notes?: string[];
  updatedAt?: string;
};

const CURRENT_RELEASE = import.meta.env.VITE_RELEASE;
const CURRENT_RELEASE_LABEL = CURRENT_RELEASE || import.meta.env.MODE;
const RELEASE_ACK_KEY = 'ikn-fe.release.ack';

const fetchLatestReleaseInfo = async (): Promise<ReleaseInfo | null> => {
  try {
    const res = await fetch(`/release.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as ReleaseInfo;
    if (!data?.release) return null;
    return data;
  } catch {
    return null;
  }
};

const tryClearCaches = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {
    return;
  }

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    return;
  }
};

const UpdateGate = ({ children }: { children: ReactNode }) => {
  const [latest, setLatest] = useState<ReleaseInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const acknowledged =
    !!latest?.release && window.localStorage.getItem(RELEASE_ACK_KEY) === latest.release;

  const updateRequired =
    !!CURRENT_RELEASE && !!latest?.release && latest.release !== CURRENT_RELEASE && !acknowledged;

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const info = await fetchLatestReleaseInfo();
      if (!mounted) return;
      if (!info) return;
      setLatest(info);
    };

    void check();
    const intervalId = window.setInterval(() => void check(), 60_000);

    const onVisibility = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (updateRequired) setOpen(true);
  }, [updateRequired]);

  const handleUpdate = async () => {
    setUpdating(true);
    setOpen(false);
    if (latest?.release) {
      window.localStorage.setItem(RELEASE_ACK_KEY, latest.release);
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await tryClearCaches();
    const next = latest?.release || 'latest';
    const url = `${window.location.origin}${window.location.pathname}?v=${encodeURIComponent(
      next
    )}&t=${Date.now()}`;
    window.location.replace(url);
  };

  return (
    <>
      {children}
      <Modal
        centered
        title={null}
        open={open}
        closable={false}
        closeIcon={null}
        maskClosable={false}
        keyboard={false}
        footer={null}
        width={560}
      >
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: 'rgba(82, 196, 26, 0.12)',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleFilled style={{ fontSize: 34, color: '#52c41a' }} />
          </div>

          <Typography.Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
            Versi terbaru tersedia
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Silakan update terlebih dahulu untuk melanjutkan, termasuk login.
          </Typography.Paragraph>

          <div style={{ textAlign: 'left' }}>
            <Typography.Paragraph style={{ marginBottom: 6 }}>
              Versi saat ini: <Typography.Text strong>{CURRENT_RELEASE_LABEL}</Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 6 }}>
              Versi terbaru: <Typography.Text strong>{latest?.release}</Typography.Text>
            </Typography.Paragraph>
            {latest?.updatedAt ? (
              <Typography.Paragraph style={{ marginBottom: 12 }}>
                Tanggal rilis: <Typography.Text strong>{latest.updatedAt}</Typography.Text>
              </Typography.Paragraph>
            ) : (
              <div style={{ height: 6 }} />
            )}

            <Typography.Text strong>Perubahan</Typography.Text>
            <List
              style={{ marginTop: 8 }}
              size="small"
              dataSource={latest?.notes?.length ? latest.notes : ['Tidak ada catatan rilis']}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              size="large"
              block
              icon={<ReloadOutlined />}
              onClick={handleUpdate}
              disabled={updating}
              loading={updating}
            >
              Update Sekarang
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AccessProvider>
          <ReactQueryProvider>
            <ErrorBoundary>
              <UpdateGate>
                <App />
              </UpdateGate>
            </ErrorBoundary>
          </ReactQueryProvider>
        </AccessProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
