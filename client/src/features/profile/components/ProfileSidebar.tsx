import React from 'react';
import { User, MapPin, Package } from 'lucide-react';
import type { UserData } from '../types/profile.types';
import { useLanguage } from '../../../shared/context/LanguageContext';

interface ProfileSidebarProps {
  userData: UserData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  picture?: string | null;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userData, activeTab, setActiveTab, picture }) => {
  const { t } = useLanguage();
  const navItems = [
    { id: 'info', icon: User, label: t('personalInfo') },
    { id: 'addresses', icon: MapPin, label: t('addresses') },
    { id: 'orders', icon: Package, label: t('orders') }
  ];

  return (
    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28">
      <div className="flex flex-col items-center mb-8 relative">
        <div className="w-24 h-24 bg-gradient-to-br from-[#2E0505] to-[#000000] border-2 border-[#990000] rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 overflow-hidden shadow-[0_0_20px_rgba(153,0,0,0.4)]">
          {picture ? (
            <img src={picture} alt={userData.name || 'Profile'} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="font-['Orbitron'] font-bold text-[#FF0000] text-3xl drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]">
              {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-[#F2F4F6]">{userData.name}</h2>
        <p className="text-sm text-[#F2F4F6]/50 font-['Orbitron']">{userData.email}</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-[#990000] to-[#2E0505] text-white border border-[#FF0000]/30'
                : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000]'
            }`}
          >
            <item.icon className="w-5 h-5" /> <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
