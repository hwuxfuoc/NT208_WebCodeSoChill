import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { useModal } from "./context/ModalContext";
import MessagesModal from "./modals/MessagesModal";
import NotificationsModal from "./modals/NotificationsModal";
import SettingsModal from "./modals/SettingsModal";

function App() {
  const element = useRoutes(routes);
  const { activeModal, closeModal } = useModal();

  return (
    <>
      {element}
      {activeModal && (
        <>
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-host">
            {activeModal === "messages" && <MessagesModal />}
            {activeModal === "notifications" && <NotificationsModal />}
            {activeModal === "settings" && <SettingsModal />}
          </div>
        </>
      )}
    </>
  );
}

export default App;
