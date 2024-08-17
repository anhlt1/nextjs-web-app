import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type customOption = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

// throw ra lỗi nên throw ra 1 object kế thừa Error object để có được các thông tin lỗi 1 cách chi tiết
class HttpError extends Error {
  status: number;
  payload: any;
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

// class chỉ sử dụng ở client
// tạo ra sessionToken type là SessionToken để lưu trữ sessionToken
class SessionToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set sessionToken on server side");
    }
    this.token = token;
  }
}
// sessionToken chỉ truy cập được ở client bởi 1 Next Server có nhiều Next Client
export const ClientSessionToken = new SessionToken();

// tạo request trả về kiểu dữ liệu Response, truyền vào method, url, options với
// options là Request được lược bỏ đi method và có thêm baseUrl
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: customOption | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-type": "application/json",
    Authorization: ClientSessionToken.value
      ? `Bearer ${ClientSessionToken.value}`
      : "",
  };
  // Nếu ko truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào "" thì đồng nghĩa với việc chúng ta gọi API đến NextJS Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options?.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

    // Thực hiện request
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  // Xử lý response nhận được từ server
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Nếu có lỗi, throw ra chi tiết lỗi
  if (!res.ok) {
    throw new HttpError(data);
  }

  // Nếu url là /auth/login hoặc /auth/register thì lưu sessionToken vào ClientSessionToken
  if (["/auth/login", "/auth/register"].includes(url)) {
    ClientSessionToken.value = (payload as LoginResType)?.data?.token;
  } else if ("/auth/logout" === url) {
    ClientSessionToken.value = "";
  }
  return data;
};

// Là 1 wrapper cho request đã định nghĩa ở trên với đủ 4 method HTTPs phổ biến
const http = {
  // Method GET không cần truyền body nên omit body trong options
  get<Response>(url: string, options?: Omit<customOption, "body"> | undefined) {
    return request<Response>("GET", url, options);
  },
  // body chứa values được JSON.stringify() do react hook form truyền vào onSubmit
  // Các method POST, PUT, DELETE có tham số body riêng biệt, kết hợp với options khi gọi request : { ...options, body }
  // Việc Omit "body" trong options giúp tránh xung đột, gây nhầm lẫn khi người dùng vô tình truyền body vào options
//  VD: 
//  http.post(
//  '/login',
//  { username: 'user1', password: 'pass1' },
//  { body: { username: 'user2', password: 'pass2' } } // Xung đột!
//  );
//  Ko rõ liệu body nào sẽ được sử dụng, body của options hay body của request
  post<Response>(
    url: string,
    body: any,
    options?: Omit<customOption, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(
    url: string,
    body: any,
    options?: Omit<customOption, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },

  delete<Response>(
    url: string,
    body: any,
    options?: Omit<customOption, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
