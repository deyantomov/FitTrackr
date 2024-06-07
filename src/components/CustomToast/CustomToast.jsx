import { useEffect, useState } from "react";
import {
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

/**
 * @param {{type: string, message: string, onClose: () => void}}
 */
export default function CustomToast({ type, message, onClose }) {
  const [opacityLevel, setOpacityLevel] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacityLevel(prev => (prev > 0 ? prev - 1 : 0));
    }, 60);

    const timeout = setTimeout(onClose, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="flex flex-col fixed top-5 right-5 z-50 text-xl justify-center align-center items-center shadow-xl rounded-lg p-8 bg-white text-black"
      style={{ minWidth: "180px", maxHeight: "96px", opacity: opacityLevel / 100 }}
    >
      <div className="flex flex-row justify-start gap-4">
        {type === "error" ? (
          <ExclamationTriangleIcon
            style={{ maxWidth: "24px" }}
            className="text-red-500"
          />
        ) : (
          <CheckIcon style={{ maxWidth: "24px" }} />
        )}
        <p className="w-full">{message}</p>
      </div>
    </div>
  );
}

CustomToast.propTypes = {
  type: PropTypes.oneOf(["error", "success"]).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
