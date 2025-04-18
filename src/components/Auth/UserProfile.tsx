import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center">
      <div className="mr-4">
        <p className="text-sm text-morandi-stone">{user.email}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm bg-morandi-fog text-morandi-stone px-3 py-1 rounded-md hover:bg-morandi-fog/80 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;
