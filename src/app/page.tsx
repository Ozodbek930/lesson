"use client"; 

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to Ticket System</h1>
      <button className="btn btn-primary mt-3" onClick={() => router.push("/admin")}>
        Go to Admin Panel
      </button>
    </div>
  );
}
