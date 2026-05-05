//frontend/src/pages/SettingsPage/AccountPage/index.tsx
export default function AccountSettingsPage() {
  return (
    <div>
      <h2>Account</h2>
      <div className="page-grid-2">
        <input placeholder="Username" />
        <input placeholder="Full name" />
      </div>
      <input placeholder="Email" style={{ width: "100%", marginTop: 10 }} />
      <textarea placeholder="Bio" style={{ width: "100%", marginTop: 10, minHeight: 70 }} />
    </div>
  );
}
