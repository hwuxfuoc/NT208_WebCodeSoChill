import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayname: '',
    phone: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.displayname) {
      setLocalError('Vui lòng nhập tất cả thông tin bắt buộc');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayname: formData.displayname,
        phone: formData.phone || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="card w-full max-w-lg p-8 relative overflow-hidden border border-white/40">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fc6b57] to-[#49bb98]"></div>
        
        <div className="text-center mb-8 mt-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký</h2>
          <p className="text-gray-500 text-sm font-medium">Tạo tài khoản CodeSoChill mới của bạn</p>
        </div>

        {(localError || error) && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3.5 rounded-md mb-6 text-sm flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block mb-1.5 text-sm font-bold text-gray-700">Tên Đăng Nhập <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
              />
            </div>

            <div>
              <label htmlFor="displayname" className="block mb-1.5 text-sm font-bold text-gray-700">Tên Hiển Thị <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="displayname"
                name="displayname"
                value={formData.displayname}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-bold text-gray-700">Mật Khẩu <span className="text-red-500">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-bold text-gray-700">Xác Nhận Mật Khẩu <span className="text-red-500">*</span></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1.5 text-sm font-bold text-gray-700">Số Điện Thoại <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+84 1234567890"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#fc6b57]/20 focus:border-[#fc6b57] outline-none transition-all duration-200 font-medium text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-4 rounded-xl text-white font-bold text-[15px] tracking-wide transition-all duration-300 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#fc6b57] to-[#e85a46] shadow-md shadow-[#fc6b57]/30 hover:shadow-lg hover:shadow-[#fc6b57]/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm font-medium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#49bb98] font-bold hover:underline transition-all">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
