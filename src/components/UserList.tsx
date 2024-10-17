import React from "react";
import { User, Crown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface UserListProps {
  users: { id: string; name: string; estimate: string | null }[];
  currentUser: string;
  isScrumMaster: boolean;
  scrumMasterId: string | null;
  onChangeScrumMaster: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser, isScrumMaster, onChangeScrumMaster, scrumMasterId }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 rounded-lg`}>
      <h3 className="text-lg font-semibold mb-2">Participants</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <User className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <div className="flex gap-2">
                <span>
                  {user.name}{" "}
                  <span>
                    {(scrumMasterId === user.id) ? (
                      <span className={`inline-flex items-center rounded-md ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-700'} px-2 py-1 text-xs font-medium ring-1 ring-inset ring-green-600/20`}>Scrum Master</span>
                    ) : (
                      <span className={`inline-flex items-center rounded-md ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-50 text-purple-700'} px-2 py-1 text-xs font-medium ring-1 ring-inset ring-purple-700/10`}>Dev</span>
                    )}
                  </span>{" "}
                  {user.id === currentUser && "(You)"}
                </span>
                {isScrumMaster && user.id !== currentUser && (
                  <button onClick={() => onChangeScrumMaster(user.id)} className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`} title="Make Scrum Master">
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