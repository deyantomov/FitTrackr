import { useState } from "react";
import { ToastContext } from "../context/ToastContext";
import CustomToast from "../components/CustomToast/CustomToast";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const onClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ setToast }}>
      {toast && <CustomToast type={toast.type} message={toast.message} onClose={onClose} />}
      {children}
    </ToastContext.Provider>
  );
}