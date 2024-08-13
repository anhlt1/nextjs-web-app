import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function MeProfile() {
  const cookieStore = cookies();
  // Lấy ra sessionToken từ cookie trong next server được nhận từ login-form - client
  const sessionToken = cookieStore.get("sessionToken");

  // thực hiện gọi API từ Next Server
  const result = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
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
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <div className="w-full max-w-md p-8 flex flex-col items-center">
        <span className="text-xl ">Hello</span> {result?.payload?.data?.name}
      </div>
    </div>
  );
}
