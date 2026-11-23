"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const eventTypes = ["Cleanup", "Plantation", "Donation", "Winter Relief", "Food Drive", "Health Camp", "Education"];

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "Cleanup",
    thumbnail: "",
    location: "",
    eventDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const [today, setToday] = useState("");

useEffect(() => {
  setToday(new Date().toLocaleDateString("en-CA"));
}, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokenRes = await fetch("/api/token");
      if (!tokenRes.ok) {
        setError("Please log in again.");
        return;
      }
      const { token } = await tokenRes.json();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not create event.");
        return;
      }

      router.push("/events");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return <p className="p-6">Loading...</p>;
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-md p-6">
        <p>You need to log in to create an event.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Create an event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="title" placeholder="Event title" value={form.title} onChange={handleChange} required className="input input-bordered w-full" />

        <select name="eventType" value={form.eventType} onChange={handleChange} className="select select-bordered w-full">
          {eventTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input name="thumbnail" type="url" placeholder="Thumbnail image URL" value={form.thumbnail} onChange={handleChange} required className="input input-bordered w-full" />

        <input name="location" placeholder="Location, e.g. Mirpur 10, Dhaka" value={form.location} onChange={handleChange} required className="input input-bordered w-full" />

        <input name="eventDate" type="date" min={today} value={form.eventDate} onChange={handleChange} required className="input input-bordered w-full" />

        <textarea name="description" placeholder="What is the drive about?" value={form.description} onChange={handleChange} required rows={5} className="textarea textarea-bordered w-full" />

        {error && <p className="text-error text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Creating..." : "Create event"}
        </button>
      </form>
    </main>
  );
}