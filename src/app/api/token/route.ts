import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { token } = await auth.api.getToken({ headers: request.headers });

  return Response.json({ token });
}