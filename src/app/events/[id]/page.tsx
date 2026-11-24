import { Suspense } from "react";
import JoinButton from "./join-button";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  thumbnail: string;
  eventDate: string;
  createdBy: string;
};

async function getEvent(id: string): Promise<EventItem | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function EventDetails({ id }: { id: string }) {
  const event = await getEvent(id);

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <article className="grid gap-6 md:grid-cols-2">
      <img src={event.thumbnail} alt={event.title} className="h-80 w-full rounded-box object-cover" />

      <div className="flex flex-col gap-3">
        <span className="badge badge-outline w-fit">{event.eventType}</span>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p>{event.location}</p>
        <p>{new Date(event.eventDate).toLocaleDateString()}</p>
        <p className="whitespace-pre-line">{event.description}</p>
        <p className="text-sm opacity-70">Organized by {event.createdBy}</p>

        <JoinButton eventId={event._id} />
      </div>
    </article>
  );
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Suspense fallback={<p>Loading event...</p>}>
        <EventDetails id={id} />
      </Suspense>
    </main>
  );
}