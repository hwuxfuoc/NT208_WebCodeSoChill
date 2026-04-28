import { useModal } from "../../context/ModalContext";

export default function MessagesModal() {
  const { closeModal } = useModal();
  return (
    <div className="modal-panel" style={{ width: "min(760px,95vw)", height: 520, padding: 16, display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
      <div className="card" style={{ margin: 0 }}><b>Messages</b><p>Sarah Chen</p><p>Marcus Low</p></div>
      <div className="card" style={{ margin: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><b>Sarah Chen</b><button onClick={closeModal}>X</button></div>
        <p style={{ background: "#f1f5f9", padding: 10, borderRadius: 10 }}>Hey! Did you review the PR?</p>
        <p style={{ background: "#9a3f24", color: "white", padding: 10, borderRadius: 10, marginLeft: 60 }}>On it! Looks clean.</p>
      </div>
    </div>
  );
}
