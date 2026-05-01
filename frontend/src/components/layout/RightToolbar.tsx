import { useModal } from "../../context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faEnvelope, faBell, faMessage } from "@fortawesome/free-solid-svg-icons";

export default function RightToolbar() {
  const { openModal } = useModal();

  return (
    <aside className="right-toolbar">
      <button className="tool-btn" onClick={() => openModal("settings")}>
        <FontAwesomeIcon icon={faGear} /> 
      </button>
      <button className="tool-btn" onClick={() => openModal("messages")}>
        <FontAwesomeIcon icon={faMessage} />
      </button>
      <button className="tool-btn" onClick={() => openModal("notifications")}>
      <FontAwesomeIcon icon={faBell} />
      </button>
      <button className="tool-btn">EN</button>
    </aside>
  );
}
