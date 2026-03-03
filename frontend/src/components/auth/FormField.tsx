interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  hint?: React.ReactNode; // e.g. "Forgot password?" link
}

export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  hint,
}: FormFieldProps) {
  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id} className="auth-label">{label}</label>
        {hint}
      </div>
      <input
        id={id}
        type={type}
        className="auth-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}
