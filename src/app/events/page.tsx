import { Suspense } from "react";
import Link from "next/link";

type EventItem = {
  _id: string;
  title: string;
  eventType: string;
  location: string;
  thumbnail: string;
  eventDate: string;
};

async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Events fetch failed:", res.status);
    return [];
  }

  return res.json();
}

async function EventList() {
  const events = await getEvents();

  if (events.length === 0) {
    return <p>No upcoming events yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div key={event._id} className="card bg-base-100 shadow">
          <figure>
            <img src={event.thumbnail} alt={event.title} className="h-48 w-full object-cover" />
          </figure>
          <div className="card-body">
            <span className="badge badge-outline">{event.eventType}</span>
            <h2 className="card-title">{event.title}</h2>
            <p>{event.location}</p>
            <p>{new Date(event.eventDate).toLocaleDateString()}</p>
            <div className="card-actions justify-end">
              <Link href={`/events/${event._id}`} className="btn btn-primary">
                View event
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Upcoming events</h1>

      <Suspense fallback={<p>Loading events...</p>}>
        <EventList />
      </Suspense>
    </main>
  );
}