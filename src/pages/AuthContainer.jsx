import React from 'react';
import AuthPage from './AuthPage';

export default function AuthContainer({ onLogin }) {
  return <AuthPage onLogin={onLogin} />;
}