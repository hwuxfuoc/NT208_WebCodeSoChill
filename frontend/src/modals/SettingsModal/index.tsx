import { useState, useRef } from "react";
import { useModal } from "../../context/ModalContext";

const TABS = [
  { id: "account", label: "Account", },
  { id: "security", label: "Security", },
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
  const [avatarUrl, setAvatarUrl] = useState("https://ss-images.saostar.vn/wp700/pc/1659428921809/saostar-8eqrvdlmozut8ndc.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { closeModal } = useModal();

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
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
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors ${active === t.id ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            style={active === t.id ? { backgroundColor: "var(--main-orange-color)" } : {}}
          >
            <span className="text-base"></span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        {active === "account" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-[#1A1D2B]">Account</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <img src={avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-[#1A1D2B] text-sm">Alex Rivera</p>
                <p className="text-xs text-gray-400">@alex_rivera · Grandmaster</p>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <button onClick={handleImageClick} className="ml-auto text-xs font-bold px-4 py-2 rounded-xl text-white hover:opacity-90" style={{ backgroundColor: "var(--main-orange-color)" }}>Change Photo</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Username"><input type="text" defaultValue="alex_rivera" className={inputCls} /></Field>
              <Field label="Full Name"><input type="text" defaultValue="Alex Rivera" className={inputCls} /></Field>
            </div>
            <Field label="Email"><input type="email" defaultValue="alex@codesochill.dev" className={inputCls} /></Field>
            <Field label="Bio"><textarea rows={3} defaultValue="Senior engineer passionate about algorithms and distributed systems." className={`${inputCls} resize-none`} /></Field>
            <div className="flex justify-end pt-2">
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--main-orange-color)" }}>Save Changes</button>
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
            <Field label="Current Password"><input type="password" placeholder="••••••••" className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New Password"><input type="password" placeholder="••••••••" className={inputCls} /></Field>
              <Field label="Confirm Password"><input type="password" placeholder="••••••••" className={inputCls} /></Field>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#1A1D2B]">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400 mt-0.5">Secure your account with 2FA</p>
              </div>
              <button className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">Enable</button>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--main-orange-color)" }}>Update Credentials</button>
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
                <button className={`text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${g.connected ? "border-green-200 text-green-600 bg-green-50 hover:bg-green-100" : "border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}>{g.connected ? "✓ Connected" : "Connect"}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
