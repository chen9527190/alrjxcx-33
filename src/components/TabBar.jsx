// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, User, Settings } from 'lucide-react';

function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }, {
    id: 'admin',
    label: '管理',
    icon: Settings
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return <Button key={tab.id} variant="ghost" className={`flex flex-col items-center justify-center h-full w-full rounded-none ${isActive ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => onTabChange(tab.id)}>
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-red-600' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </Button>;
      })}
      </div>
    </div>;
}
export default TabBar;