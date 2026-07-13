"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui";

interface User {
  id: string;
  name: string;
  email: string;
}

export function MarkAttendance() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("present");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setUsers(data.filter((u: any) => u.role !== "owner"));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      setMessage("Please select a user");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          date,
          status,
          checkInTime: checkInTime ? new Date(`${date}T${checkInTime}`).toISOString() : null,
          checkOutTime: checkOutTime ? new Date(`${date}T${checkOutTime}`).toISOString() : null,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to mark attendance");

      setMessage("✓ Attendance marked successfully");
      setSelectedUser("");
      setStatus("present");
      setCheckInTime("");
      setCheckOutTime("");
      setNotes("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("✗ Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Employee</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select employee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="grid grid-cols-3 gap-2">
            {["present", "absent", "leave", "half-day", "late"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  status === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {status === "present" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Check-in Time</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check-out Time</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.startsWith("✓")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Mark Attendance"}
        </button>
      </form>
    </Card>
  );
}
