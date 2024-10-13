import React from 'react';
import { User, Crown } from 'lucide-react';

interface UserListProps {
  users: { id: string; name: string; estimate: string | null }[];
  currentUser: string;
  isScrumMaster: boolean;
  onChangeScrumMaster: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser, isScrumMaster, onChangeScrumMaster }) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Participants</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <div className='flex gap-2'>
              <span>{user.name} {user.id === currentUser && '(You)'}</span>
              {isScrumMaster && user.id !== currentUser && (
              <button
                onClick={() => onChangeScrumMaster(user.id)}
                className="text-blue-500 hover:text-blue-600"
                title="Make Scrum Master"
              >
                <Crown className="w-5 h-5" />
              </button>
            )}
              </div>
              
            </div>
            {user.estimate && <span className="text-green-500">✓</span>}
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;