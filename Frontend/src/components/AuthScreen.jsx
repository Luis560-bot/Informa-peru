import { useState } from "react";
import { Leaf, Recycle } from "lucide-react";
import { apiRequest } from "../api/client";
import { DEMO_PASSWORD, DEMO_USERS } from "../config/demoUsers";

export function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(DEMO_USERS.Ciudadano);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "register") {
        await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
      }
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.access_token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function toggleMode() {
    setMode((current) => current === "login" ? "register" : "login");
    setError("");
  }

  return (
    <main className="login-shell">
      <section className="brand-panel">
        <div className="brand"><Leaf aria-hidden="true" /> LIMPIO PERÚ</div>
        <div>
          <p className="kicker">Limpio Perú</p>
          <h1>Tu barrio habla.<br />Nosotros actuamos.</h1>
          <p className="lead">Reporta residuos, acompaña su atención y ayuda a recuperar los espacios que compartimos.</p>
        </div>
        <div className="impact">
          <Recycle aria-hidden="true" />
          <span><strong>Una plataforma, tres equipos</strong>Ciudadanía, operadores y administración trabajando con la misma información.</span>
        </div>
      </section>
      <section className="login-panel">
        <form onSubmit={submit}>
          <p className="kicker">Acceso seguro</p>
          <h2>{mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta ciudadana"}</h2>
          {mode === "register" && <label>Nombre completo<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength="2" /></label>}
          <label>Correo electrónico<input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Contraseña<input autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "register" ? 8 : 1} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primary" disabled={busy}>{busy ? "Procesando…" : mode === "login" ? "Ingresar" : "Crear cuenta"}</button>
          <button className="mode-link" type="button" onClick={toggleMode}>{mode === "login" ? "Crear una cuenta ciudadana" : "Ya tengo una cuenta"}</button>
          {mode === "login" && <div className="demo"><span>Entrar como</span>{Object.entries(DEMO_USERS).map(([role, mail]) => <button type="button" key={role} onClick={() => { setEmail(mail); setPassword(DEMO_PASSWORD); }}>{role}</button>)}<small>Contraseña de prueba: {DEMO_PASSWORD}</small></div>}
        </form>
      </section>
    </main>
  );
}
