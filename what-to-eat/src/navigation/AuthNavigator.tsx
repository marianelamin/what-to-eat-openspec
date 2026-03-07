import React, { useState } from 'react';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

export function AuthNavigator() {
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignUp) {
    return <SignUpScreen onNavigateToSignIn={() => setIsSignUp(false)} />;
  }

  return <SignInScreen onNavigateToSignUp={() => setIsSignUp(true)} />;
}
