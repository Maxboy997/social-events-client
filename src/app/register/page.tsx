"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


function getPasswordProblems(password: string) {
  const problems: string[] = [];

  if (!/[A-Z]/.test(password)) {
    problems.push("Add at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    problems.push("Add at least one lowercase letter.");
  }
  if (password.length < 6) {
    problems.push("Use at least 6 characters.");
  }

  return problems;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const problems = getPasswordProblems(form.password);
    if (problems.length > 0) {
      setError(problems.join(" "));
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image || undefined,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Could not create your account.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-3xl font-bold">Create account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        <input
          name="image"
          type="url"
          placeholder="Photo URL (optional)"
          value={form.image}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="link">
          Login here
        </Link>
      </p>
    </main>
  );
}