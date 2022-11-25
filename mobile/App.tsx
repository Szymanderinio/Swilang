import { useState } from 'react';

import LoginScreen from './screens/LoginScreen';
import SwipeScreen from './screens/SwipeScreen';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  if (isLogin) {
    return <SwipeScreen />;
  }

  return <LoginScreen setIsLogin={setIsLogin} />;
}
