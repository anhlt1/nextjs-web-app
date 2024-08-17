"use client";
import { ClientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  initialSessionToken = "",
  children,
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  // chạy 1 lần duy nhất khi component được render
  useState(() => {
    if (typeof window !== undefined) {
      ClientSessionToken.value = initialSessionToken;
    }
  });
  return <>{children}</>;
}
