import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

/* ── Icons (inline SVG to avoid extra imports) ───────────────── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="auth-spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const FlowDeskLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="10" fill="url(#logo-grad)" />
    <path d="M8 10h10M8 16h6M8 22h8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="22" cy="22" r="4" fill="white" fillOpacity="0.9" />
    <path d="M20.5 22l1 1 2-2" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Floating Label Input ─────────────────────────────────────── */
interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightSlot?: React.ReactNode;
}

function FloatingInput({ id, label, type = 'text', value, onChange, autoComplete, rightSlot }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="auth-floating-wrapper">
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`auth-floating-input ${focused ? 'auth-floating-input--focused' : ''}`}
        placeholder=" "
        aria-label={label}
      />
      <label htmlFor={id} className={`auth-floating-label ${lifted ? 'auth-floating-label--lifted' : ''} ${focused ? 'auth-floating-label--active' : ''}`}>
        {label}
      </label>
      {rightSlot && (
        <div className="auth-input-right-slot">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

/* ── Main AuthPage Component ──────────────────────────────────── */
interface AuthPageProps {
  onAuthenticated: () => void;
}

export default function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotShake, setForgotShake] = useState(false);

  const forgotRef = useRef<HTMLButtonElement>(null);

  /* ── Mouse parallax tracking on card ── */
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 80, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 4);
    rotateY.set(dx * 4);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  /* ── Toggle mode ── */
  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  /* ── Mock submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }
    setError('');
    setLoading(true);
    // Mock async auth
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    onAuthenticated();
  };

  /* ── Forgot password shake ── */
  const handleForgotClick = () => {
    setForgotShake(true);
    forgotRef.current?.blur();
    setTimeout(() => setForgotShake(false), 600);
  };

  /* ── Animation variants ── */
  const cardVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 48, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22, mass: 0.8 } },
  };

  const fieldVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 }
    }),
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  return (
    <div className="auth-root">
      {/* ── Animated Background Blobs ── */}
      <div className="auth-blobs" aria-hidden="true">
        <div className="auth-blob auth-blob--indigo" />
        <div className="auth-blob auth-blob--teal" />
        <div className="auth-blob auth-blob--purple" />
      </div>

      {/* ── Noise Overlay ── */}
      <div className="auth-noise" aria-hidden="true" />

      {/* ── Card ── */}
      <motion.div
        ref={cardRef}
        className="auth-card-outer"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="auth-card">
          {/* Logo + Title */}
          <div className="auth-header">
            <motion.div
              className="auth-logo"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
            >
              <FlowDeskLogo />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
            >
              <h1 className="auth-title">FlowDesk</h1>
              <p className="auth-subtitle">
                {mode === 'login' ? 'Welcome back — sign in to continue' : 'Create your account to get started'}
              </p>
            </motion.div>
          </div>

          {/* Mode Toggle Pill */}
          <div className="auth-mode-pill" role="tablist" aria-label="Auth mode">
            <button
              id="auth-tab-login"
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-mode-btn ${mode === 'login' ? 'auth-mode-btn--active' : ''}`}
              onClick={() => { if (mode !== 'login') toggleMode(); }}
            >
              Sign In
            </button>
            <button
              id="auth-tab-signup"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-mode-btn ${mode === 'signup' ? 'auth-mode-btn--active' : ''}`}
              onClick={() => { if (mode !== 'signup') toggleMode(); }}
            >
              Sign Up
            </button>
            <motion.div
              className="auth-mode-indicator"
              animate={{ x: mode === 'login' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            />
          </div>

          {/* Social Buttons */}
          <div className="auth-social-row">
            <button id="auth-google-btn" className="auth-social-btn" type="button" aria-label="Continue with Google">
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button id="auth-github-btn" className="auth-social-btn" type="button" aria-label="Continue with GitHub">
              <GithubIcon />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or continue with email</span>
            <span className="auth-divider-line" />
          </div>

          {/* Form */}
          <form id="auth-form" onSubmit={handleSubmit} noValidate className="auth-form">
            <AnimatePresence mode="popLayout">
              {/* Name field — signup only */}
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={0}
                >
                  <FloatingInput
                    id="auth-name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                  />
                </motion.div>
              )}

              {/* Email */}
              <motion.div key="email-field" variants={fieldVariants} initial="hidden" animate="visible" exit="exit" custom={mode === 'signup' ? 1 : 0}>
                <FloatingInput
                  id="auth-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
              </motion.div>

              {/* Password */}
              <motion.div key="password-field" variants={fieldVariants} initial="hidden" animate="visible" exit="exit" custom={mode === 'signup' ? 2 : 1}>
                <FloatingInput
                  id="auth-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  rightSlot={
                    <button
                      id="auth-pw-toggle"
                      type="button"
                      className="auth-pw-toggle"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </motion.div>

              {/* Confirm Password — signup only */}
              {mode === 'signup' && (
                <motion.div
                  key="confirm-field"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={3}
                >
                  <FloatingInput
                    id="auth-confirm"
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    rightSlot={
                      <button
                        id="auth-confirm-toggle"
                        type="button"
                        className="auth-pw-toggle"
                        onClick={() => setShowConfirm(s => !s)}
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password */}
            {mode === 'login' && (
              <div className="auth-forgot-row">
                <button
                  ref={forgotRef}
                  id="auth-forgot-btn"
                  type="button"
                  className={`auth-forgot-link ${forgotShake ? 'auth-shake' : ''}`}
                  onClick={handleForgotClick}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  className="auth-error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 4 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  role="alert"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              id="auth-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    className="auth-btn-content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SpinnerIcon />
                    <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="auth-btn-content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer toggle */}
          <p className="auth-footer-text">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              id="auth-switch-mode-btn"
              type="button"
              className="auth-footer-link"
              onClick={toggleMode}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
