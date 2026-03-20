"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Redirect to home if already logged in
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
