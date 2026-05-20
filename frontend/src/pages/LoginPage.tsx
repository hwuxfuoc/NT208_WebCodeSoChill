import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email || !formData.password) {
      setLocalError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 relative overflow-hidden border border-white/40">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#49bb98] to-[#fc6b57]"></div>
        
        <div className="text-center mb-8 mt-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
          <p className="text-gray-500 text-sm font-medium">Chào mừng bạn quay trở lại CodeSoChill</p>
        </div>

        {(localError || error) && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3.5 rounded-md mb-6 text-sm flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-bold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#49bb98]/20 focus:border-[#49bb98] outline-none transition-all duration-200 font-medium text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-bold text-gray-700">Mật Khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#49bb98]/20 focus:border-[#49bb98] outline-none transition-all duration-200 font-medium text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-[15px] tracking-wide transition-all duration-300 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#49bb98] to-[#3ea786] shadow-md shadow-[#49bb98]/30 hover:shadow-lg hover:shadow-[#49bb98]/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-gray-600 text-sm font-medium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#fc6b57] font-bold hover:underline transition-all">
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-gray-600 text-sm font-medium">
            Bạn quên mật khẩu?{' '}
            <Link to="/forgotpassword" className="text-[#49bb98] font-bold hover:underline transition-all">
              Lấy lại mật khẩu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
