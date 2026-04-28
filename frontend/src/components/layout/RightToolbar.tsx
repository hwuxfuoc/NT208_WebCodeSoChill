import { useModal } from "../../context/ModalContext";

export default function RightToolbar() {
  const { openModal } = useModal();

  return (
    <aside className="right-toolbar">
      <button className="tool-btn" onClick={() => openModal("settings")}>?</button>
      <button className="tool-btn" onClick={() => openModal("messages")}>?</button>
      <button className="tool-btn" onClick={() => openModal("notifications")}>??</button>
      <button className="tool-btn">EN</button>
    </aside>
  );
}
