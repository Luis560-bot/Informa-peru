import { useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search } from "lucide-react";
import { apiRequest } from "../api/client";

export function ReportList({ reports, role, token, refresh }) {
  const [query, setQuery] = useState("");
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return reports.filter((report) => `${report.title} ${report.district}`.toLowerCase().includes(normalizedQuery));
  }, [reports, query]);

  async function updateStatus(id, status) {
    await apiRequest(`/api/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
    await refresh();
  }

  return (
    <section className="reports">
      <div className="list-head">
        <div><p className="kicker">Seguimiento</p><h2>{role === "Ciudadano" ? "Mis reportes" : "Cola de reportes"}</h2></div>
        <div className="search"><Search size={17} aria-hidden="true" /><input aria-label="Buscar reportes" placeholder="Buscar por título o distrito" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      </div>
      <div className="report-list">
        {filteredReports.length === 0 ? <div className="empty"><CheckCircle2 aria-hidden="true" /><p>No hay reportes para mostrar.</p></div> : filteredReports.map((report) => (
          <article key={report.id}>
            <div className={`status ${report.status.replace(" ", "-").toLowerCase()}`}>{report.status}</div>
            <div className="report-copy">
              <div className="report-meta"><span>{report.category}</span><span><MapPin size={14} aria-hidden="true" />{report.district}</span></div>
              <h3>{report.title}</h3><p>{report.description}</p>
              <small>{report.address} · {new Date(report.created_at).toLocaleDateString("es-PE")}</small>
            </div>
            {role !== "Ciudadano" && <select className="status-select" aria-label={`Estado de ${report.title}`} value={report.status} onChange={(event) => updateStatus(report.id, event.target.value)}><option>Pendiente</option><option>En proceso</option><option>Resuelto</option></select>}
          </article>
        ))}
      </div>
    </section>
  );
}
