"use client";

import accountApiRequest from "@/apiRequests/account";
import { ClientSessionToken } from "@/lib/http";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      const result = await accountApiRequest.me(ClientSessionToken.value);
      console.log("🚀 ~ fetchRequest ~ result:", result);
    };
    fetchRequest();
  }, []);
  return <div>ProfilePage</div>;
}
