import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";

const TOKEN_KEY = "limpio_peru_token";
const LEGACY_TOKEN_KEY = "eco_token";

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  return token;
}

async function fetchDashboard(activeToken) {
  const user = await apiRequest("/api/auth/me", {}, activeToken);
  const [reports, users] = await Promise.all([
    apiRequest("/api/reports", {}, activeToken),
    user.role === "Administrador"
      ? apiRequest("/api/users", {}, activeToken)
      : Promise.resolve([]),
  ]);
  return { user, reports, users };
}

export function useSession() {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setReports([]);
    setUsers([]);
  }, []);

  const refresh = useCallback(async (activeToken = token) => {
    if (!activeToken) return;
    try {
      const dashboard = await fetchDashboard(activeToken);
      setUser(dashboard.user);
      setReports(dashboard.reports);
      setUsers(dashboard.users);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    fetchDashboard(token)
      .then((dashboard) => {
        if (cancelled) return;
        setUser(dashboard.user);
        setReports(dashboard.reports);
        setUsers(dashboard.users);
        setError("");
      })
      .catch((requestError) => {
        if (cancelled) return;
        setError(requestError.message);
        logout();
      });

    return () => { cancelled = true; };
  }, [logout, token]);

  const login = useCallback((nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }, []);

  return { token, user, reports, users, error, login, logout, refresh };
}
