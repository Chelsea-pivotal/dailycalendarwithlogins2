import React from 'react';
import UserProfile from './Auth/UserProfile';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-morandi-stone">Daily Planner</h1>
        <p className="text-morandi-stone/70">Organize your day, achieve your goals</p>
      </div>
      <UserProfile />
    </header>
  );
};

export default Header;
