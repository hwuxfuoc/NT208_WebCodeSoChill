import { useRoutes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import routes from "./routes";
import { useModal } from "./context/ModalContext";
import MessagesModal from "./modals/MessagesModal";
import NotificationsModal from "./modals/NotificationsModal";
import SettingsModal from "./modals/SettingsModal";

function App() {
  const location = useLocation();
  const element = useRoutes(routes, location);
  const { activeModal, closeModal } = useModal();

  const getTopKey = (pathname: string) => {
    if (
      pathname === "/" ||
      pathname === "/problems" ||
      pathname === "/contest" ||
      pathname === "/community" ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/admin")
    ) {
      return "main-layout";
    }
    return pathname;
  };

  const topKey = getTopKey(location.pathname);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={topKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {element}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
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
      </AnimatePresence>
    </>
  );
}

export default App;
