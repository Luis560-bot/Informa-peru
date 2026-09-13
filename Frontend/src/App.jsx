import "./App.css";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { useSession } from "./hooks/useSession";

function App() {
  const session = useSession();

  if (!session.token) {
    return <AuthScreen onLogin={session.login} />;
  }

  if (!session.user) {
    return <div className="loading">{session.error || "Cargando Limpio Perú…"}</div>;
  }

  return <Dashboard {...session} />;
}

export default App;
