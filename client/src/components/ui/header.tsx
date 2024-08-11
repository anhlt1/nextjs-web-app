import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="flex justify-end items-center gap-5">
      <Link href={"/login"}>Login</Link>
      <Link href={"/register"}>Register</Link>
      <ModeToggle />
    </div>
  );
}
