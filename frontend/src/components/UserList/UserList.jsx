/**
 * UserList Component
 * Displays online users in the sidebar
 * Props: users, currentUser
 */

import "./UserList.css";

const UserList = ({ users, currentUser }) => {
  const sortedUsers = [...users].sort((a, b) => {
    // Current user first
    if (a === currentUser) return -1;
    if (b === currentUser) return 1;
    // Then alphabetically
    return a.localeCompare(b);
  });

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h3>Online Users</h3>
        <span className="user-count">{users.length}</span>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users online</p>
        </div>
      ) : (
        <ul className="user-list">
          {sortedUsers.map((user, index) => (
            <li
              key={index}
              className={`user-item ${user === currentUser ? "current-user" : ""}`}
            >
              <span className="user-status-dot"></span>
              <span className="user-name">{user}</span>
              {user === currentUser && <span className="you-badge">You</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
