import { useModal } from "../../context/ModalContext";

export default function NotificationsModal() {
  const { closeModal } = useModal();
  return (
    <div className="modal-panel" style={{ width: "min(400px,95vw)", maxHeight: "80vh", overflow: "auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><h3>Notifications</h3><button onClick={closeModal}>X</button></div>
      <div className="card"><b>Contest Reminder</b><p>Biweekly contest starts in 30 minutes.</p></div>
      <div className="card"><b>Submission Accepted</b><p>Your solution for Two Sum was accepted.</p></div>
      <div className="card"><b>Community Reply</b><p>Sarah Zen replied to your comment.</p></div>
    </div>
  );
}
