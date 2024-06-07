import { useState } from "react";
import { ToastContext } from "../context/ToastContext";
import CustomToast from "../components/CustomToast/CustomToast";
import PropTypes from "prop-types";

/**
 * @param {{children: React.FC | Array<React.FC>}} props
 * @returns {React.FC}
 */
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

ToastProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
