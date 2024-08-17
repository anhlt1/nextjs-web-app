// tạo ra nhằm mục đích tạo API ở Next Server --> nhiệm vụ set cookie sessionToken vào trong client
export async function POST(request: Request) {
  const res = await request.json();
  // bên login-form chỉ gửi lên sessionToken
  const sessionToken = res.sessionToken as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Cannot get sessionToken" },
      {
        status: 400,
      }
    );
  }
  return Response.json(res, {
    status: 200,
    // để js ko thể truy cập vào cookie sử dụng httpOnly
    headers: {
      "Set-cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly;`,
    },
  });
}
