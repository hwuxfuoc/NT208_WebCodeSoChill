import { useModal } from "../../context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faEnvelope, faBell, faMessage } from "@fortawesome/free-solid-svg-icons";


export default function RightToolbar() {
  const { openModal } = useModal();
  const user = null;
  const avatarUrl = user?.avatarUrl;
  const displayName = user?.displayname ?? "User";

  return (
    <aside className="right-toolbar">
      <div className="avt-container overflow-hidden">
        <img src="https://2sao.vietnamnetjsc.vn/2016/07/18/10/04/7041969500357457.jpg" alt="avt" className="object-cover w-full h-full"/>
      </div>
      <button className="tool-btn" onClick={() => openModal("settings")}>
        <FontAwesomeIcon icon={faGear} /> 
      </button>
      <button className="tool-btn" onClick={() => openModal("messages")}>
        <FontAwesomeIcon icon={faMessage} />
      </button>
      <button className="tool-btn" onClick={() => openModal("notifications")}>
      <FontAwesomeIcon icon={faBell} />
      </button>
    </aside>
  );
}
