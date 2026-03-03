type AlertVariant = 'error' | 'success';

interface AlertProps {
  variant: AlertVariant;
  message: string;
}

const icons: Record<AlertVariant, string> = {
  error: '⚠️',
  success: '✅',
};

export default function Alert({ variant, message }: AlertProps) {
  if (!message) return null;
  return (
    <div className={`auth-alert auth-alert-${variant}`}>
      <span className="auth-alert-icon">{icons[variant]}</span>
      {message}
    </div>
  );
}
