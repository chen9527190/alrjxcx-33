// @ts-ignore;
import React, { useState } from 'react';

// @ts-ignore;
import Home from './home.jsx';
// @ts-ignore;
import Profile from './profile.jsx';
// @ts-ignore;
import Admin from './admin.jsx';
// @ts-ignore;
import TabBar from '@/components/TabBar.jsx';
export default function App(props) {
  const [activeTab, setActiveTab] = useState('home');
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home {...props} />;
      case 'profile':
        return <Profile {...props} />;
      case 'admin':
        return <Admin {...props} />;
      default:
        return <Home {...props} />;
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-16">
      {renderContent()}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>;
}