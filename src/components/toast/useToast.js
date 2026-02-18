import { useToastContext } from "./ToastProvider";

export function useToast() {
  const { addToast } = useToastContext();

  return {
    success: (msg, opts) => addToast(msg, { ...opts, type: "success" }),
    error: (msg, opts) => addToast(msg, { ...opts, type: "error" }),
    warning: (msg, opts) => addToast(msg, { ...opts, type: "warning" }),
    info: (msg, opts) => addToast(msg, { ...opts, type: "info" }),
  };
}
