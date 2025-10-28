import { toast as sonnerToast } from "sonner";

export const toast = ({ title, description, variant }) => {
  const style =
    variant === "destructive"
      ? { style: { background: "#FEE2E2", color: "#991B1B" } }
      : variant === "success"
      ? { style: { background: "#DCFCE7", color: "#166534" } }
      : {};

  sonnerToast(title, {
    description,
    ...style,
  });
};
