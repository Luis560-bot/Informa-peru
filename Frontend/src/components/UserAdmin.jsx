import { Users } from "lucide-react";
import { apiRequest } from "../api/client";

export function UserAdmin({ users, token, refresh }) {
  async function changeRole(id, role) {
    await apiRequest(`/api/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }, token);
    await refresh();
  }

  return (
    <section className="users">
      <div className="list-head"><div><p className="kicker">Control de acceso</p><h2>Usuarios y roles</h2></div><Users aria-hidden="true" /></div>
      <div className="user-table">
        {users.map((user) => <div className="user-row" key={user.id}><div className="avatar">{user.name[0]}</div><div><strong>{user.name}</strong><small>{user.email}</small></div><select aria-label={`Rol de ${user.name}`} value={user.role} onChange={(event) => changeRole(user.id, event.target.value)}><option>Ciudadano</option><option>Operador</option><option>Administrador</option></select></div>)}
      </div>
    </section>
  );
}
