import React, { useEffect, useState } from "react";

const [users, setUsers] = useState(null);
const apiUrl = import.meta.env.VITE_API_URL;

useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch(`${apiUrl}/api/users`);
    const json = await response.json();

    if (response.ok) {
      setUsers(json);
      console.log(users);
    }
  };

  fetchUsers();
}, []);

export default function Users() {
  return (
    <div>
      {users &&
        users.map((user) => {
          <p key={user.email}>{user.name}</p>;
        })}
    </div>
  );
}
