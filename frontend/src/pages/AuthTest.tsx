import { useState } from 'react';
import { signUp, signIn, signOut, getCurrentUser } from '../lib/supabase';
import { getUserProfile, detectText } from '../lib/api';
import type { User } from '@supabase/supabase-js';

export default function AuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [testText, setTestText] = useState('Breaking news: Scientists discovered dinosaurs in Antarctica yesterday.');
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const handleRegister = async () => {
    setMessage('Registering...');
    const { data, error } = await signUp(email, password, name);
    
    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Registration successful!');
      setUser(data.user);
      setToken(data.session?.access_token || '');
      console.log('Session:', data.session);
    }
  };

  const handleLogin = async () => {
    setMessage('Logging in...');
    const { data, error } = await signIn(email, password);
    
    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Login successful!');
      setUser(data.user);
      setToken(data.session?.access_token || '');
      console.log('Session:', data.session);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Logged out successfully');
      setUser(null);
      setToken('');
    }
  };

  const handleGetCurrentUser = async () => {
    const { user: currentUser, error } = await getCurrentUser();
    
    if (error || !currentUser) {
      setMessage('❌ Not logged in');
    } else {
      setMessage('✅ User retrieved from Supabase');
      setUser(currentUser);
      console.log('Current user:', currentUser);
    }
  };

  const handleGetProfile = async () => {
    try {
      const response = await getUserProfile();
      setMessage('✅ Profile retrieved from backend');
      console.log('Profile from backend:', response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMessage}`);
    }
  };

  const handleTestDetection = async () => {
    try {
      setMessage('Testing detection...');
      const response = await detectText(testText);
      setDetectionResult(response.data);
      setMessage('✅ Detection completed!');
      console.log('Detection result:', response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Detection Error: ${errorMessage}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🧪 Supabase Auth & API Test</h1>
      
      {/* Status Message */}
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px', 
        background: message.includes('❌') ? '#ffebee' : '#e8f5e9',
        border: '1px solid',
        borderColor: message.includes('❌') ? '#ef5350' : '#66bb6a',
        borderRadius: '4px'
      }}>
        {message || 'Ready to test...'}
      </div>

      {/* Current User Status */}
      {user && (
        <div style={{ padding: '10px', marginBottom: '20px', background: '#e3f2fd', borderRadius: '4px' }}>
          <strong>👤 Logged in as:</strong> {user.email}
          <br />
          <small>User ID: {user.id}</small>
        </div>
      )}

      {/* Registration Form */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>📝 Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleRegister} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Register
        </button>
      </div>

      {/* Login Form */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>🔐 Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Login
        </button>
      </div>

      {/* Auth Actions */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>🎯 Auth Actions</h2>
        <button onClick={handleGetCurrentUser} style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}>
          Get Current User (Supabase)
        </button>
        <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Backend API Test */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
        <h2>🚀 Backend API Test</h2>
        <button onClick={handleGetProfile} style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: '15px' }}>
          Get Profile from Backend
        </button>
        
        <h3>Text Detection Test</h3>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '80px' }}
          placeholder="Enter text to detect"
        />
        <button onClick={handleTestDetection} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Test Detection API
        </button>

        {detectionResult && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h4>Detection Result:</h4>
            <pre style={{ overflow: 'auto' }}>{JSON.stringify(detectionResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Token Display */}
      {token && (
        <div style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h2>🔑 JWT Token</h2>
          <div style={{ 
            padding: '10px', 
            background: '#fff', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            wordBreak: 'break-all',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {token}
          </div>
          <small style={{ color: '#666' }}>
            Copy this token to test backend API with Postman/cURL
          </small>
        </div>
      )}

      {/* Instructions */}
      <div style={{ padding: '15px', background: '#e8eaf6', borderRadius: '8px' }}>
        <h3>📖 Instructions</h3>
        <ol>
          <li>Make sure backend is running on port 5000</li>
          <li>Register a new user or login with existing credentials</li>
          <li>Once logged in, the JWT token appears below</li>
          <li>Test backend APIs (Get Profile, Text Detection)</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}
