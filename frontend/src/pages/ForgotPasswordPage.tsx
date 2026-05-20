import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

type Step = 'request' | 'verify';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('request');

  // Step 1
  const [email, setEmail] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [requestMsg, setRequestMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Step 2
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown để resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ─── Step 1: Gửi mã ───────────────────────────────────────────────────────
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setRequestMsg({ text: 'Vui lòng nhập email của bạn', isError: true });
      return;
    }
    setLoadingRequest(true);
    setRequestMsg(null);
    try {
      await api.post('/api/auth/forgotpassword', { email });
      setRequestMsg({ text: 'Mã xác nhận đã được gửi tới email của bạn!', isError: false });
      setResendCooldown(60);
      setStep('verify');
    } catch (err: any) {
      setRequestMsg({ text: err.response?.data?.message || 'Gửi mã thất bại', isError: true });
    } finally {
      setLoadingRequest(false);
    }
  };

  // ─── Step 2: OTP input ────────────────────────────────────────────────────
  const handleCodeChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[idx] = digit;
    setCode(newCode);
    if (digit && idx < 5) codeRefs.current[idx + 1]?.focus();
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
    setCode(newCode);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ─── Step 2: Đổi mật khẩu ────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setResetMsg({ text: 'Vui lòng nhập đủ mã 6 số', isError: true });
      return;
    }
    if (!newPassword) {
      setResetMsg({ text: 'Vui lòng nhập mật khẩu mới', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setResetMsg({ text: 'Mật khẩu phải ít nhất 6 ký tự', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMsg({ text: 'Mật khẩu xác nhận không khớp', isError: true });
      return;
    }
    setLoadingReset(true);
    setResetMsg(null);
    try {
      await api.post('/api/auth/resetpassword', { email, code: fullCode, newPassword });
      setResetMsg({ text: 'Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...', isError: false });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setResetMsg({ text: err.response?.data?.message || 'Đặt lại mật khẩu thất bại', isError: true });
    } finally {
      setLoadingReset(false);
    }
  };

  // ─── Resend ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0 || loadingRequest) return;
    setLoadingRequest(true);
    setResetMsg(null);
    try {
      await api.post('/api/auth/forgotpassword', { email });
      setResetMsg({ text: 'Mã mới đã được gửi!', isError: false });
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      codeRefs.current[0]?.focus();
    } catch {
      setResetMsg({ text: 'Gửi lại thất bại, vui lòng thử lại', isError: true });
    } finally {
      setLoadingRequest(false);
    }
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '1rem',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  };

  const headingStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.55)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.75)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    fontSize: '1rem',
    color: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.875rem',
    background: disabled
      ? 'rgba(99,102,241,0.4)'
      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
  });

  const alertStyle = (isError: boolean): React.CSSProperties => ({
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
    background: isError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
    border: `1px solid ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
    color: isError ? '#fca5a5' : '#86efac',
  });

  const iconLock = (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1rem', display: 'block' }}>
      <circle cx="12" cy="12" r="12" fill="rgba(99,102,241,0.2)" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5" y="11" width="14" height="9" rx="2" fill="rgba(99,102,241,0.4)" stroke="#818cf8" strokeWidth="1.5" />
      <circle cx="12" cy="15.5" r="1.5" fill="#818cf8" />
    </svg>
  );

  const iconEmail = (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1rem', display: 'block' }}>
      <circle cx="12" cy="12" r="12" fill="rgba(139,92,246,0.2)" />
      <rect x="4" y="7" width="16" height="11" rx="2" fill="rgba(139,92,246,0.3)" stroke="#a78bfa" strokeWidth="1.5" />
      <path d="M4 9l8 5 8-5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {step === 'request' ? (
          <>
            {iconLock}
            <h1 style={headingStyle}>Quên Mật Khẩu</h1>
            <p style={subtitleStyle}>
              Nhập email tài khoản của bạn, chúng tôi sẽ gửi mã xác nhận 6 số.
            </p>

            {requestMsg && <div style={alertStyle(requestMsg.isError)}>{requestMsg.text}</div>}

            <form onSubmit={handleRequestCode}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="fp-email" style={labelStyle}>Địa chỉ Email</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setRequestMsg(null); }}
                  placeholder="you@example.com"
                  style={inputStyle}
                  autoFocus
                />
              </div>
              <button type="submit" disabled={loadingRequest} style={btnStyle(loadingRequest)}>
                {loadingRequest ? 'Đang gửi mã...' : 'Nhận mã xác nhận'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ color: '#818cf8', fontSize: '0.875rem', textDecoration: 'none' }}>
                ← Quay lại đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <>
            {iconEmail}
            <h1 style={headingStyle}>Nhập Mã Xác Nhận</h1>
            <p style={subtitleStyle}>
              Mã 6 số đã được gửi tới <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong>
            </p>

            {resetMsg && <div style={alertStyle(resetMsg.isError)}>{resetMsg.text}</div>}

            <form onSubmit={handleResetPassword}>
              {/* OTP Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Mã xác nhận</label>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { codeRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleCodePaste : undefined}
                      style={{
                        width: '48px',
                        height: '56px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        background: digit ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${digit ? '#6366f1' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: '10px',
                        color: '#fff',
                        outline: 'none',
                        transition: 'all 0.15s',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="fp-newpass" style={labelStyle}>Mật khẩu mới</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="fp-newpass"
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.8rem', padding: 0,
                    }}
                  >
                    {showPass ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="fp-confirm" style={labelStyle}>Xác nhận mật khẩu mới</label>
                <input
                  id="fp-confirm"
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  style={{
                    ...inputStyle,
                    borderColor: confirmPassword && confirmPassword !== newPassword
                      ? 'rgba(239,68,68,0.6)'
                      : 'rgba(255,255,255,0.15)',
                  }}
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p style={{ color: '#fca5a5', fontSize: '0.78rem', margin: '0.35rem 0 0' }}>
                    Mật khẩu không khớp
                  </p>
                )}
              </div>

              <button type="submit" disabled={loadingReset} style={btnStyle(loadingReset)}>
                {loadingReset ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
              </button>
            </form>

            {/* Resend + Back */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              Không nhận được mã?{' '}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loadingRequest}
                style={{
                  background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
                  color: resendCooldown > 0 ? 'rgba(255,255,255,0.3)' : '#818cf8',
                  fontWeight: 600, fontSize: '0.85rem', padding: 0,
                }}
              >
                {resendCooldown > 0 ? `Gửi lại (${resendCooldown}s)` : 'Gửi lại'}
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <button
                onClick={() => { setStep('request'); setResetMsg(null); setCode(['', '', '', '', '', '']); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818cf8', fontSize: '0.85rem' }}
              >
                ← Đổi email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
