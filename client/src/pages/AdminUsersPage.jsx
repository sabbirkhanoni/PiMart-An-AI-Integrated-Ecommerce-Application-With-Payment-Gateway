import { useState, useEffect, useCallback } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Loading from "../components/Mini/Loading";

const AdminUsersPage = () => {
  const currentUser = useSelector((state) => state?.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalActive: 0,
    totalSuspended: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllUsersAdmin,
        params: {
          page,
          limit: 12,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalCount(response.data.pagination.totalCount || 0);
        }
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";
    if (
      nextStatus === "Suspended" &&
      !window.confirm(`Are you sure you want to suspend member "${user.name}"?`)
    ) {
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.updateUserStatusAdmin,
        data: {
          targetUserId: user._id,
          status: nextStatus,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg =
      nextRole === "ADMIN"
        ? `Grant ADMIN privileges to "${user.name}"? They will have full administrative access.`
        : `Demote "${user.name}" from ADMIN to regular Customer?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await Axios({
        ...SummaryApi.updateUserRoleAdmin,
        data: {
          targetUserId: user._id,
          role: nextRole,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Users size={20} />
            </div>
            <span>Customer & User Management</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            View registered store members, assign administrator roles, and manage access status
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Members</p>
            <p className="text-xl font-extrabold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-100 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Store Admins</p>
            <p className="text-xl font-extrabold text-gray-900">{stats.totalAdmins}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Status</p>
            <p className="text-xl font-extrabold text-gray-900">{stats.totalActive}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50/50 border border-rose-100 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suspended</p>
            <p className="text-xl font-extrabold text-gray-900">{stats.totalSuspended}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-gray-50/70 p-3 md:p-4 rounded-2xl border border-gray-200/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 text-xs font-semibold">
            {["ALL", "USER", "ADMIN"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  roleFilter === r
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {r === "ALL" ? "All Roles" : r === "USER" ? "Customers" : "Admins"}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 text-xs font-semibold">
            {["ALL", "Active", "Suspended"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-gray-900 text-white shadow-2xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {s === "ALL" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table / Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto">
          <Users size={32} className="mx-auto text-gray-400 mb-2" />
          <h3 className="font-bold text-gray-800 text-sm">No Users Found</h3>
          <p className="text-xs text-gray-500 mt-1">Try clearing your search terms or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {users.map((user) => {
                  const isCurrentAuthUser = String(user._id) === String(currentUser?._id);

                  return (
                    <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-blue-200 shadow-2xs">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              (user.name || "U")[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                              <span>{user.name}</span>
                              {isCurrentAuthUser && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-400" />
                          <span>{user.mobile || "Not Provided"}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                            <Shield size={11} /> ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            CUSTOMER
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {user.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <ShieldAlert size={11} /> Suspended
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Role Button */}
                          <button
                            type="button"
                            disabled={isCurrentAuthUser && user.role === "ADMIN"}
                            onClick={() => handleToggleRole(user)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
                            title={user.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                          >
                            {user.role === "ADMIN" ? "Demote" : "Make Admin"}
                          </button>

                          {/* Toggle Status Button */}
                          <button
                            type="button"
                            disabled={isCurrentAuthUser}
                            onClick={() => handleToggleStatus(user)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 ${
                              user.status === "Active"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {user.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {users.map((user) => {
              const isCurrentAuthUser = String(user._id) === String(currentUser?._id);

              return (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {(user.name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                          <span>{user.name}</span>
                          {isCurrentAuthUser && (
                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {user.role === "ADMIN" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          USER
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>Phone: {user.mobile || "N/A"}</span>
                    <span>Status: <strong className={user.status === "Active" ? "text-emerald-600" : "text-rose-600"}>{user.status}</strong></span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={isCurrentAuthUser && user.role === "ADMIN"}
                      onClick={() => handleToggleRole(user)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 disabled:opacity-40"
                    >
                      {user.role === "ADMIN" ? "Demote" : "Make Admin"}
                    </button>

                    <button
                      type="button"
                      disabled={isCurrentAuthUser}
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 ${
                        user.status === "Active"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>
                Showing page <strong className="text-gray-900">{page}</strong> of <strong className="text-gray-900">{totalPages}</strong> ({totalCount} total members)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
