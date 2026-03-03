interface AuthLogoProps {
  onClick?: () => void;
}

export default function AuthLogo({ onClick }: AuthLogoProps) {
  return (
    <div className="auth-logo" onClick={onClick} role="button" tabIndex={0}>
      <span className="auth-logo-icon">✓</span>
      <span className="auth-logo-text">VeriFact</span>
    </div>
  );
}
