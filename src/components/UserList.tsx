import React from "react";
import { User, Crown } from "lucide-react";

interface UserListProps {
  users: { id: string; name: string; estimate: string | null }[];
  currentUser: string;
  isScrumMaster: boolean;
  scrumMasterId: string | null;
  onChangeScrumMaster: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser, isScrumMaster, onChangeScrumMaster, scrumMasterId }) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Participants</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <div className="flex gap-2">
                <span>
                  {user.name}{" "}
                  <span>
                    {scrumMasterId === user.id ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Scrum Master</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Dev/QA</span>
                    )}
                  </span>{" "}
                  {user.id === currentUser && "(You)"}
                </span>
                {isScrumMaster && user.id !== currentUser && (
                  <button onClick={() => onChangeScrumMaster(user.id)} className="text-blue-500 hover:text-blue-600" title="Make Scrum Master">
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
