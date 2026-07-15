const UsersTab = ({ users }) => {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">All Users ({users.length})</h2>
      {users.map((u, i) => (
        <div
          key={u._id}
          className="border rounded-xl p-4 dark:border-gray-800 flex items-center justify-between hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {u.fullname?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-medium text-sm">{u.fullname}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              u.role === "admin"
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                : "bg-gray-100 text-gray-600 dark:bg-dark-800 dark:text-gray-400"
            }`}
          >
            {u.role}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UsersTab;
