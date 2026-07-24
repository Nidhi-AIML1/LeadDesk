import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function Admin() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const getLeads = async () => {
    try {
      const res = await API.get(`/leads?search=${search}`);
      setLeads(res.data.leads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeads();
  }, [search]);

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-lg">Total Leads</p>
          <h2 className="text-4xl font-bold mt-2">{leads.length}</h2>
        </div>

        <div className="bg-yellow-500 text-white rounded-xl shadow-lg p-6">
          <p className="text-lg">New Leads</p>
          <h2 className="text-4xl font-bold mt-2">
            {leads.filter((lead) => lead.status === "New").length}
          </h2>
        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-lg">Contacted</p>
          <h2 className="text-4xl font-bold mt-2">
            {leads.filter((lead) => lead.status === "Contacted").length}
          </h2>
        </div>

        <div className="bg-red-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-lg">Closed</p>
          <h2 className="text-4xl font-bold mt-2">
            {leads.filter((lead) => lead.status === "Closed").length}
          </h2>
        </div>
      </div>

      {/* Search */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leads List</h2>

        <input
          type="text"
          placeholder="Search by name, email or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="w-[15%] px-6 py-4 text-left">Name</th>
              <th className="w-[28%] px-6 py-4 text-left">Email</th>
              <th className="w-[18%] px-6 py-4 text-left">Company</th>
              <th className="w-[17%] px-6 py-4 text-left">Budget</th>
              <th className="w-[12%] px-6 py-4 text-center">Status</th>
              <th className="w-[10%] px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No Leads Found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 align-middle">{lead.name}</td>

                  <td className="px-6 py-4">{lead.email}</td>

                  <td className="px-6 py-4">{lead.company}</td>

                  <td className="px-6 py-4 align-middle">{lead.budget}</td>

                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={async (e) => {
                        await API.put(`/leads/${lead._id}`, {
                          status: e.target.value,
                        });

                        alert("Status Updated Successfully");

                        getLeads();
                      }}
                      className={`px-3 py-2 rounded-lg border font-semibold
                        ${
                          lead.status === "New"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "Contacted"
                              ? "bg-blue-100 text-blue-700"
                              : lead.status === "Qualified"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Closed</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this lead?",
                        );

                        if (!confirmDelete) return;

                        try {
                          await API.delete(`/leads/${lead._id}`);
                          alert("Lead Deleted Successfully");
                          getLeads();
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
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
    </div>
  );
}

export default Admin;
