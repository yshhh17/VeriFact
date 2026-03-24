import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendVerificationEmail, signIn, signUp } from '../lib/supabase';
import AuthLogo from '../components/auth/AuthLogo';
import AuthTabs, { type AuthMode } from '../components/auth/AuthTabs';
import FormField from '../components/auth/FormField';
import Alert from '../components/auth/Alert';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setName(''); setEmail(''); setPassword('');
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) { setError(error.message); return; }
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        if (!name.trim()) { setError('Name is required.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        const { error } = await signUp(email, password, name);
        if (error) { setError(error.message); return; }
        setSuccess('Account created! Check your email to confirm.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Enter your email address first to resend verification.');
      return;
    }

    setError('');
    setSuccess('');
    setResending(true);

    try {
      const { error } = await resendVerificationEmail(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Verification email sent. Please check your inbox and spam folder.');
    } catch {
      setError('Could not resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">
      <div className="auth-container">
        <AuthLogo onClick={() => navigate('/')} />

        <div className="auth-card">
          <AuthTabs mode={mode} onChange={switchMode} />

          <div className="auth-header">
            <h1 className="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to continue verifying content' : 'Join millions fighting misinformation'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <FormField id="name" label="Full Name" placeholder="John Doe"
                value={name} onChange={setName} autoComplete="name" required />
            )}

            <FormField id="email" label="Email Address" type="email"
              placeholder="you@example.com" value={email} onChange={setEmail}
              autoComplete="email" required />

            <FormField id="password" label="Password" type="password"
              placeholder={isLogin ? '••••••••' : 'At least 6 characters'}
              value={password} onChange={setPassword}
              autoComplete={isLogin ? 'current-password' : 'new-password'} required
              hint={isLogin ? <a href="#" className="auth-forgot">Forgot password?</a> : undefined}
            />

            <Alert variant="error" message={error} />
            <Alert variant="success" message={success} />

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? (isLogin ? 'Signing in...' : 'Creating account...')
                : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            {isLogin && (
              <button
                type="button"
                className="auth-submit"
                onClick={handleResendVerification}
                disabled={resending || loading}
              >
                {resending ? 'Sending verification email...' : 'Resend Verification Email'}
              </button>
            )}
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="auth-switch-btn"
              onClick={() => switchMode(isLogin ? 'signup' : 'login')}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
