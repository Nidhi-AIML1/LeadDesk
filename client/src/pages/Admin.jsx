import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

const statusStyles = {
  New: "border-blue-200 bg-blue-50 text-blue-700",
  Contacted: "border-amber-200 bg-amber-50 text-amber-700",
  Closed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function Admin() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const getLeads = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await API.get(`/leads?search=${encodeURIComponent(search)}`);
      setLeads(res.data.leads);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load leads. Please sign in again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(getLeads, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const stats = useMemo(
    () => [
      { label: "Total leads", value: leads.length, icon: "◌", accent: "bg-slate-900" },
      { label: "New", value: leads.filter((lead) => lead.status === "New").length, icon: "✦", accent: "bg-blue-600" },
      { label: "Contacted", value: leads.filter((lead) => lead.status === "Contacted").length, icon: "↗", accent: "bg-amber-500" },
      { label: "Closed", value: leads.filter((lead) => lead.status === "Closed").length, icon: "✓", accent: "bg-emerald-600" },
    ],
    [leads],
  );

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  const updateStatus = async (leadId, status) => {
    setUpdatingId(leadId);
    setError("");

    try {
      await API.put(`/leads/${leadId}`, { status });
      await getLeads();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update this lead.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm("Delete this lead permanently?")) return;

    setUpdatingId(leadId);
    setError("");

    try {
      await API.delete(`/leads/${leadId}`);
      await getLeads();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this lead.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-lg shadow-slate-900/15">L</div>
            <div>
              <p className="text-base font-bold tracking-tight">LeadDesk</p>
              <p className="text-xs font-medium text-slate-500">Sales workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-slate-500">Workspace owner</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Overview</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Lead pipeline</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Track every opportunity, follow up with confidence, and keep your pipeline moving.</p>
          </div>
          <a href="/" className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">
            View public site
          </a>
        </section>

        <section className="mb-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-7 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white ${stat.accent}`}>{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">Current pipeline total</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">All leads</h2>
              <p className="mt-1 text-sm text-slate-500">Manage incoming enquiries and their progress.</p>
            </div>
            <div className="relative w-full sm:w-80">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">⌕</span>
              <input
                type="search"
                placeholder="Search leads"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {error && <p role="alert" className="m-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="5" className="px-6 py-14 text-center text-slate-500">Loading leads…</td></tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <p className="text-base font-semibold text-slate-700">No leads found</p>
                      <p className="mt-1 text-sm text-slate-500">New enquiries from the public form will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="transition hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{lead.name?.slice(0, 1).toUpperCase()}</div>
                          <div>
                            <p className="font-semibold text-slate-800">{lead.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lead.company || "—"}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{lead.budget}</td>
                      <td className="px-6 py-4">
                        <select
                          aria-label={`Status for ${lead.name}`}
                          value={lead.status}
                          disabled={updatingId === lead._id}
                          onChange={(event) => updateStatus(lead._id, event.target.value)}
                          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold outline-none disabled:cursor-wait disabled:opacity-60 ${statusStyles[lead.status] || statusStyles.New}`}
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteLead(lead._id)}
                          disabled={updatingId === lead._id}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
