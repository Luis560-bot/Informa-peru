import { useState } from "react";
import { Plus } from "lucide-react";
import { apiRequest } from "../api/client";

const EMPTY_REPORT = { title: "", category: "Residuos", district: "", address: "", description: "" };

export function ReportForm({ token, refresh }) {
  const [form, setForm] = useState(EMPTY_REPORT);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await apiRequest("/api/reports", { method: "POST", body: JSON.stringify(form) }, token);
      setForm(EMPTY_REPORT);
      setMessage("Reporte enviado correctamente");
      await refresh();
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="report-form" onSubmit={submit}>
      <div className="section-title"><div><p className="kicker">Nuevo caso</p><h2>Reportar un problema</h2></div><Plus aria-hidden="true" /></div>
      <div className="form-grid">
        <label>Título<input name="title" value={form.title} onChange={updateField} placeholder="Ej. Residuos junto al parque" minLength="5" maxLength="120" required /></label>
        <label>Tipo<select name="category" value={form.category} onChange={updateField}><option>Residuos</option><option>Reciclaje</option><option>Desmonte</option><option>Areas verdes</option></select></label>
        <label>Distrito<input name="district" value={form.district} onChange={updateField} minLength="2" maxLength="100" required /></label>
        <label>Dirección<input name="address" value={form.address} onChange={updateField} minLength="5" maxLength="200" required /></label>
        <label className="wide">Descripción<textarea name="description" value={form.description} onChange={updateField} rows="4" minLength="10" maxLength="2000" required /></label>
      </div>
      {message && <p className="feedback" aria-live="polite">{message}</p>}
      <button className="primary" disabled={busy}>{busy ? "Enviando…" : "Enviar reporte"}</button>
    </form>
  );
}
