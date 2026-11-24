"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function JoinButton({ eventId }: { eventId: string }) {
  const { data: session, isPending } = authClient.useSession();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    setMessage("");
    setLoading(true);

    try {
      const tokenRes = await fetch("/api/token");
      if (!tokenRes.ok) {
        setMessage("Please log in to join.");
        return;
      }
      const { token } = await tokenRes.json();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Could not join event.");
        return;
      }

      setMessage("You joined this event.");
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) return null;

  if (!session) {
    return <p className="text-sm">Log in to join this event.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleJoin} disabled={loading} className="btn btn-primary w-fit">
        {loading ? "Joining..." : "Join event"}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}