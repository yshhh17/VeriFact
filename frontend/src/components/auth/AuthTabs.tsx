export type AuthMode = 'login' | 'signup';

interface AuthTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export default function AuthTabs({ mode, onChange }: AuthTabsProps) {
  return (
    <div className="auth-tabs">
      <button
        type="button"
        className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
        onClick={() => onChange('login')}
      >
        Log In
      </button>
      <button
        type="button"
        className={`auth-tab ${mode === 'signup' ? 'auth-tab-active' : ''}`}
        onClick={() => onChange('signup')}
      >
        Sign Up
      </button>
    </div>
  );
}
