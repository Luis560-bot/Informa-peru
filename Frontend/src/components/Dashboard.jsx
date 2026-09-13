import { CircleUserRound, Leaf, ListFilter, LogOut, ShieldCheck } from "lucide-react";
import { ReportForm } from "./ReportForm";
import { ReportList } from "./ReportList";
import { UserAdmin } from "./UserAdmin";

const ROLE_NAVIGATION = {
  Ciudadano: { label: "Mis reportes", Icon: CircleUserRound },
  Operador: { label: "Operación", Icon: ListFilter },
  Administrador: { label: "Administración", Icon: ShieldCheck },
};

export function Dashboard({ user, reports, users, token, refresh, logout }) {
  const navigation = ROLE_NAVIGATION[user.role];
  const NavigationIcon = navigation.Icon;
  const inProgress = reports.filter((report) => report.status === "En proceso").length;
  const resolved = reports.filter((report) => report.status === "Resuelto").length;

  return (
    <div className="app">
      <aside>
        <div className="brand"><Leaf aria-hidden="true" /> LIMPIO PERÚ</div>
        <nav aria-label="Navegación principal"><button type="button" className="active"><NavigationIcon aria-hidden="true" /><span>{navigation.label}</span></button></nav>
        <div className="profile"><div className="avatar">{user.name[0]}</div><div><strong>{user.name}</strong><small>{user.role}</small></div><button type="button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}><LogOut size={18} /></button></div>
      </aside>
      <main className="workspace">
        <header><div><p className="kicker">Panel {user.role.toLowerCase()}</p><h1>Hola, {user.name.split(" ")[0]}</h1></div><span className="live"><i /> Sistema operativo</span></header>
        <div className="stats"><div><span>Total</span><strong>{reports.length}</strong></div><div><span>En proceso</span><strong>{inProgress}</strong></div><div><span>Resueltos</span><strong>{resolved}</strong></div></div>
        {user.role === "Ciudadano" && <ReportForm token={token} refresh={refresh} />}
        <ReportList reports={reports} role={user.role} token={token} refresh={refresh} />
        {user.role === "Administrador" && <UserAdmin users={users} token={token} refresh={refresh} />}
      </main>
    </div>
  );
}
