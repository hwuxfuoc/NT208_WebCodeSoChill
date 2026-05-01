import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import AccountSettingsPage from "../../pages/SettingsPage/AccountPage";
import AppearanceSettingsPage from "../../pages/SettingsPage/AppearancePage";
import SecuritySettingsPage from "../../pages/SettingsPage/SecurityPage";
import IntegrationsSettingsPage from "../../pages/SettingsPage/IntegrationsPage";

const tabs = ["account", "appearance", "security", "integrations"] as const;

export default function SettingsModal() {
  const [active, setActive] = useState<(typeof tabs)[number]>("account");
  const { closeModal } = useModal();

  return (
    <div className="modal-panel" style={{ width: "min(900px,95vw)", maxHeight: "90vh", overflow: "auto", padding: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12 }}>
        <div className="card" style={{ margin: 0, height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b>Settings</b><button onClick={closeModal}>X</button></div>
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} style={{ display: "block", marginTop: 8, width: "100%", textAlign: "left", padding: 8, borderRadius: 8, border: 0, background: active===tab?"var(--main-orange-color)":"#f5f7fa", color: active===tab?"#fff":"#111" }}>{tab}</button>)}
        </div>
        <div className="card" style={{ margin: 0 }}>
          {active === "account" && <AccountSettingsPage />}
          {active === "appearance" && <AppearanceSettingsPage />}
          {active === "security" && <SecuritySettingsPage />}
          {active === "integrations" && <IntegrationsSettingsPage />}
        </div>
      </div>
    </div>
  );
}
