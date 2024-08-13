"use client";

import { useAppContext } from "@/app/AppProvider";
import envConfig from "@/config";
import { useEffect } from "react";

export default function Profile() {
  const { sessionToken } = useAppContext();
  useEffect(() => {
    const fetchRequest = async () => {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }
        return data;
      });
      console.log("🚀 ~ fetchRequest ~ result", result);
    };
    fetchRequest();
  }, [sessionToken]);
  return <div>ProfilePage</div>;
}
