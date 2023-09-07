import toast from "react-hot-toast";

import Toast from "~/components/Toast";

import type { ToastType } from "~/components/Toast";

export const pushToast = (
  title: string,
  description: string,
  type?: ToastType
) => {
  toast.custom((t) => (
    <Toast t={t} title={title} description={description} type={type} />
  ));
};

export const noop = () => {
  // no-op
};
