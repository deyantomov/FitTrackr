import { useEffect } from "react";
import {
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function CustomToast({ type, message, onClose }) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="flex flex-col fixed top-5 right-5 z-50 text-xl justify-center align-center items-center shadow-xl rounded-lg p-8"
      style={{ backgroundColor: "rgba(230, 230, 230, 0.9)", maxHeight: "96px" }}
    >
      <div className="flex flex-row justify-start gap-4">
        {type === "error" ? (
          <ExclamationTriangleIcon style={{ maxWidth: "24px" }} />
        ) : (
          <CheckIcon style={{ maxWidth: "24px" }} />
        )}
        <p className="w-full">{message}</p>
      </div>
    </div>
  );
}
