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

  const iconLock = (
    <div className="mx-auto w-16 h-16 bg-[#49bb98]/10 rounded-full flex items-center justify-center mb-6">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#49bb98" strokeWidth="2" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2" fill="#49bb98" fillOpacity="0.2" stroke="#49bb98" strokeWidth="2" />
        <circle cx="12" cy="15.5" r="1.5" fill="#49bb98" />
      </svg>
    </div>
  );

  const iconEmail = (
    <div className="mx-auto w-16 h-16 bg-[#fc6b57]/10 rounded-full flex items-center justify-center mb-6">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="7" width="16" height="11" rx="2" fill="#fc6b57" fillOpacity="0.2" stroke="#fc6b57" strokeWidth="2" />
        <path d="M4 9l8 5 8-5" stroke="#fc6b57" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="card w-full max-w-md p-8 relative overflow-hidden border border-white/40">
        {/* Decorative top border */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step === 'request' ? 'from-[#49bb98] to-[#fc6b57]' : 'from-[#fc6b57] to-[#49bb98]'}`}></div>

        {step === 'request' ? (
          <>
            {iconLock}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Quên Mật Khẩu</h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Nhập email tài khoản của bạn, chúng tôi sẽ gửi mã xác nhận 6 số.
            </p>

            {requestMsg && (
              <div className={`p-3.5 rounded-md mb-6 text-sm flex items-center shadow-sm border-l-4 ${requestMsg.isError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                <span>{requestMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-5">
              <div>
                <label htmlFor="fp-email" className="block mb-1.5 text-sm font-bold text-gray-700">Địa chỉ Email</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setRequestMsg(null); }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#49bb98]/20 focus:border-[#49bb98] outline-none transition-all duration-200 font-medium text-sm"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={loadingRequest} 
                className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-[15px] tracking-wide transition-all duration-300 ${
                  loadingRequest 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#49bb98] to-[#3ea786] shadow-md shadow-[#49bb98]/30 hover:shadow-lg hover:shadow-[#49bb98]/40 hover:-translate-y-0.5'
                }`}
              >
                {loadingRequest ? 'Đang gửi mã...' : 'Nhận mã xác nhận'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link to="/login" className="text-gray-500 font-medium hover:text-[#49bb98] text-sm transition-all flex items-center justify-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <>
            {iconEmail}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Nhập Mã Xác Nhận</h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Mã 6 số đã được gửi tới <strong className="text-gray-800">{email}</strong>
            </p>

            {resetMsg && (
              <div className={`p-3.5 rounded-md mb-6 text-sm flex items-center shadow-sm border-l-4 ${resetMsg.isError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                <span>{resetMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP Input */}
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700 text-center">Mã xác nhận</label>
                <div className="flex gap-2 justify-center">
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
                      className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 outline-none transition-all ${digit ? 'bg-[#fc6b57]/5 border-[#fc6b57] text-[#fc6b57]' : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-[#fc6b57]/50 focus:bg-white'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label htmlFor="fp-newpass" className="block mb-1.5 text-sm font-bold text-gray-700">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    id="fp-newpass"
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-medium text-sm px-2"
                  >
                    {showPass ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div>
                <label htmlFor="fp-confirm" className="block mb-1.5 text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                <input
                  id="fp-confirm"
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none transition-all duration-200 font-medium text-sm ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57]'
                  }`}
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    Mật khẩu không khớp
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loadingReset} 
                className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-[15px] tracking-wide transition-all duration-300 ${
                  loadingReset 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#fc6b57] to-[#e85a46] shadow-md shadow-[#fc6b57]/30 hover:shadow-lg hover:shadow-[#fc6b57]/40 hover:-translate-y-0.5'
                }`}
              >
                {loadingReset ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
              </button>
            </form>

            {/* Resend + Back */}
            <div className="mt-8 pt-5 border-t border-gray-100 text-center space-y-3">
              <div className="text-sm text-gray-500 font-medium">
                Không nhận được mã?{' '}
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loadingRequest}
                  className={`font-bold transition-all ${resendCooldown > 0 ? 'text-gray-400 cursor-default' : 'text-[#fc6b57] hover:underline'}`}
                >
                  {resendCooldown > 0 ? `Gửi lại (${resendCooldown}s)` : 'Gửi lại'}
                </button>
              </div>
              <div>
                <button
                  onClick={() => { setStep('request'); setResetMsg(null); setCode(['', '', '', '', '', '']); }}
                  className="text-gray-500 font-medium hover:text-[#49bb98] text-sm transition-all flex items-center justify-center gap-1.5 mx-auto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Đổi email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
