import { useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginSuccess } from '@/utils/helper';
import * as AuthtenticationAxios from '@/modules/authentication/service/AuthtenticationAxios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import * as LoginInterFaces from '@/modules/authentication/interfaces/LoginInterFaces';
import { showNotification } from '@/contexts/services/notificationService';
const RUBIN_BLUE = '#2B3A8F';

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Barlow', sans-serif",
    overflow: 'hidden',
    background: '#f0f2fa',
  },
  leftPanel: {
    position: 'relative',
    width: '42%',
    background: RUBIN_BLUE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem',
    overflow: 'hidden',
  },
  deco1: {
    position: 'absolute',
    top: '-70px',
    right: '-70px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
  deco2: {
    position: 'absolute',
    bottom: '-50px',
    left: '-50px',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
  deco3: {
    position: 'absolute',
    bottom: '90px',
    right: '24px',
    width: 0,
    height: 0,
    borderLeft: '22px solid transparent',
    borderRight: '22px solid transparent',
    borderBottom: '38px solid rgba(255,255,255,0.07)',
  },
  deco4: {
    position: 'absolute',
    top: '70px',
    left: '24px',
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderBottom: '26px solid rgba(255,255,255,0.07)',
  },
  tagline: {
    marginTop: '20px',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: '50px',
    letterSpacing: '2.5px',
    textAlign: 'center',
    fontFamily: "'Barlow', sans-serif",
    textDecoration: 'italic',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#f0f2fa',
  },
  formBox: {
    width: '100%',
    maxWidth: '380px',
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 40px rgba(43, 58, 143, 0.12)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a2460',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 20px',
  },
  divider: {
    width: '40px',
    height: '3px',
    background: RUBIN_BLUE,
    borderRadius: '2px',
    marginBottom: '24px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#555',
    letterSpacing: '0.8px',
  },
  input: {
    height: '44px',
    borderRadius: '8px',
    border: '1.5px solid #D0D8F0',
    background: '#F8F9FE',
    fontSize: '14px',
    fontFamily: "'Barlow', sans-serif",
  },
  button: {
    height: '46px',
    borderRadius: '8px',
    background: RUBIN_BLUE,
    border: 'none',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    fontFamily: "'Barlow', sans-serif",
    boxShadow: `0 4px 18px rgba(43,58,143,0.3)`,
  },
};

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const onFinish = async (values: LoginInterFaces.PayloadLoginInterfaces) => {
    try {
      if (!recaptchaToken)
        return showNotification('warning', 'Perhatian', 'Captcha Belum Terceklis');
      setLoading(true);
      const response = await AuthtenticationAxios.posLogin({
        ...values,
        recaptchaToken,
      });
      loginSuccess(response);
      showNotification('success', 'Berhasil', 'Login Berhasil');
      setLoading(false);
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (e: any) {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      showNotification('warning', 'Gagal', e?.customMessage || 'Gagal Login');
    }
  };

  return (
    <div style={styles.root}>
      {/* Panel Kiri — Branding RUBIN */}
      <div style={styles.leftPanel}>
        <div style={styles.deco1} />
        <div style={styles.deco2} />
        <div style={styles.deco3} />
        <div style={styles.deco4} />

        {/* Logo Segitiga RUBIN (SVG replika logo) */}
        <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
          {/* Segitiga luar */}
          <polygon points="80,5 155,135 5,135" fill="#3D52B8" />
          {/* Segitiga dalam (lubang) */}
          <polygon points="80,38 120,108 40,108" fill="#2B3A8F" />
          {/* Kotak wordmark */}
          <rect
            x="18"
            y="118"
            width="124"
            height="28"
            fill="none"
            stroke="#5B72D6"
            strokeWidth="2"
          />
          <text
            x="80"
            y="137"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontFamily="Barlow, sans-serif"
            fontWeight="700"
            letterSpacing="5"
          >
            RUBIN
          </text>
        </svg>

        <p style={styles.tagline}>CENTA</p>
      </div>

      {/* Panel Kanan — Form Login */}
      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Selamat Datang</h2>
          <p style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan</p>
          <div style={styles.divider} />

          <Form name="login-form" onFinish={onFinish} layout="vertical">
            <Form.Item
              label={<span style={styles.label}>USERNAME</span>}
              name="username"
              rules={[
                { required: true, message: 'Username wajib diisi!' },
                { message: 'Masukkan username yang valid!' },
              ]}
              style={{ marginBottom: '18px' }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#3D52B8' }} />}
                placeholder="Masukkan username"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.label}>PASSWORD</span>}
              name="password"
              rules={[{ required: true, message: 'Password wajib diisi!' }]}
              style={{ marginBottom: '20px' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#3D52B8' }} />}
                placeholder="Masukkan password"
                style={styles.input}
              />
            </Form.Item>

            <div style={{ marginBottom: '22px', textAlign: 'center', width: '100%' }}>
              <center>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_SITE_KEY_CAPTCHA}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </center>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={styles.button}
              >
                {!loading && 'MASUK'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
