export default function SecuritySettingsPage() {
  return (
    <div>
      <h2>Security Settings</h2>
      <input placeholder="Current password" type="password" />
      <input placeholder="New password" type="password" style={{ marginTop: 10 }} />
      <button style={{ marginTop: 10 }}>Update credentials</button>
    </div>
  );
}
