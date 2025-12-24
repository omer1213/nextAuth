interface AlertMessageProps {
  type: "error" | "success" | "info" | "warning";
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const styles = {
    error: "bg-red-50 border-red-500 text-red-800",
    success: "bg-green-50 border-green-500 text-green-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
    warning: "bg-amber-50 border-amber-500 text-amber-800",
  };

  const icons = {
    error: "❌",
    success: "✅",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-r-lg ${styles[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2 text-lg">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
