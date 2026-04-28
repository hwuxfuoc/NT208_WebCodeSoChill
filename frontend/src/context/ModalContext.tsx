import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ModalType = "messages" | "notifications" | "settings" | null;

type ModalContextValue = {
  activeModal: ModalType;
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const value = useMemo(
    () => ({ activeModal, openModal: setActiveModal, closeModal }),
    [activeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}
