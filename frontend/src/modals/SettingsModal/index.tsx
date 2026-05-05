//frontend/src/modals/SettingsModal/index.tsx
import { useState, useRef, useEffect } from "react";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import * as settingService from "../../services/settingService"; // ✅ fix tên import

const TABS = [
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
] as const;

type Tab = typeof TABS[number]["id"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 outline-none focus:border-orange-400 focus:bg-white transition-colors";

export default function SettingsModal() {
  const [active, setActive] = useState<Tab>("account");
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { closeModal } = useModal();

  const [formData, setFormData] = useState({
    username: "",
    displayname: "",
    email: "",
    bio: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        displayname: user.displayname || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "https://via.placeholder.com/80",
      });
    }
  }, [user]);

  const handleImageClick = () => fileInputRef.current?.click();

  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);

      setAvatarUploading(true);
      try {
        const res = await settingService.uploadAvatar(file);
        console.log("✅ Upload OK:", res.data.avatarUrl);
        setFormData(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      } catch (err: any) {
        console.error("❌ Upload error:", err.response?.status, err.response?.data);
        setError(err.response?.data?.message || "Failed to upload image");
      } finally {
        setAvatarUploading(false);
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await settingService.updateAccount({ 
        displayname: formData.displayname,
        bio: formData.bio,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    setError(null);
    setSuccess(null);
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (securityData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    setSaveLoading(true);
    try {
      await settingService.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      setSuccess("Password updated successfully!");
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="modal-panel bg-[#f8fafc] w-[860px] max-h-[88vh] p-4 flex gap-4 rounded-[32px] border-none shadow-2xl">
      <div className="w-[220px] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1 flex-shrink-0">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-extrabold text-[#1A1D2B]">Settings</h2>
          <button onClick={closeModal} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setActive(t.id); setError(null); setSuccess(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors ${active === t.id ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
            style={active === t.id ? { backgroundColor: "var(--main-orange-color)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        
        {/* Error/Success shared across tabs */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-semibold">{success}</div>
        )}

        {active === "account" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-[#1A1D2B]">Account</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <img src={formData.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-[#1A1D2B] text-sm">{formData.displayname}</p>
                <p className="text-xs text-gray-400">@{formData.username}</p>
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
              <button onClick={handleImageClick} disabled={avatarUploading} 
                className="ml-auto text-xs font-bold px-4 py-2 rounded-xl text-white hover:opacity-90 disabled:opacity-60" 
                style={{ backgroundColor: "var(--main-orange-color)" }}>
                {avatarUploading ? "Uploading..." : "Change Photo"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Username">
                <input type="text" name="username" value={formData.username} disabled className={`${inputCls} cursor-not-allowed opacity-60`} />
              </Field>
              <Field label="Full Name">
                <input type="text" name="displayname" value={formData.displayname} onChange={handleInputChange} className={inputCls} />
              </Field>
            </div>
            <Field label="Email">
              <input type="email" name="email" value={formData.email} disabled className={`${inputCls} cursor-not-allowed opacity-60`} />
            </Field>
            <Field label="Phone">
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls} />
            </Field>
            <Field label="Bio">
              <textarea rows={3} name="bio" value={formData.bio} onChange={handleInputChange} className={`${inputCls} resize-none`} />
            </Field>
            <div className="flex justify-end pt-2">
              <button onClick={handleSaveChanges} disabled={saveLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "var(--main-orange-color)" }}>
                {saveLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {active === "security" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-[#1A1D2B]">Security</h2>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-1">Last login</p>
              <p className="text-sm font-semibold text-[#1A1D2B]">Today at 16:41 · Chrome on Windows</p>
            </div>
            <Field label="Current Password">
              <input type="password" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} placeholder="••••••••" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New Password">
                <input type="password" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} placeholder="••••••••" className={inputCls} />
              </Field>
              <Field label="Confirm Password">
                <input type="password" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} placeholder="••••••••" className={inputCls} />
              </Field>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#1A1D2B]">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400 mt-0.5">Secure your account with 2FA</p>
              </div>
              <button className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">Enable</button>
            </div>
            <div className="flex justify-end">
              <button onClick={handleUpdatePassword} disabled={saveLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "var(--main-orange-color)" }}>
                {saveLoading ? "Saving..." : "Update Credentials"}
              </button>
            </div>
          </div>
        )}

        {active === "integrations" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-[#1A1D2B]">Integrations</h2>
            {[
              { name: "GitHub", desc: "Connect to import repos and showcase projects", connected: true },
              { name: "LinkedIn", desc: "Auto-share badge achievements to your network", connected: false },
              { name: "Discord", desc: "Get contest reminders on your Discord server", connected: false },
            ].map(g => (
              <div key={g.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1A1D2B]">{g.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{g.desc}</p>
                </div>
                <button className={`text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${g.connected ? "border-green-200 text-green-600 bg-green-50 hover:bg-green-100" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                  {g.connected ? "✓ Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}