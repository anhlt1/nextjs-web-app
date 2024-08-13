# CLIENT COMPONENT TRONG NEXT JS VẪN CÓ CÁC LIFE CYCLE GIỐNG CLIENT COMPONENT TRONG REACT JS THUẦN TUÝ, NHƯNG

# SẼ CÓ SỰ KHÁC BIỆT

- Như đã biết, đối với render client component `full page load` của NextJS thì:
  - Nó sẽ render trước giao diện trên server trước (đọc kết luận)
  - Sau đó trả về client HTML + RSC Payload để tiến hành quá trình hydration

###################################################################

# [KẾT LUẬN QUAN TRỌNG NÈ]: ĐỌC KỸ, TỨC LÀ Ở LẦN REQUEST ĐẦU TIÊN (FULL PAGE LOAD), CLIENT COMPONENT SẼ Ở MÔI TRƯỜNG SERVER ĐỂ RENDER HTML, SAU ĐÓ NÓ MỚI QUAY VỀ MÔI TRƯỜNG CLIENT/BROWSER ĐỂ HIỂN THỊ + HYDRATION, CÒN TỪ LẦN ĐIỀU HƯỚNG THỨ 2 TRỞ ĐI THÌ CLIENT COMPONENT SẼ HOÀN TOÀN Ở MÔI TRƯỜNG CLIENT/BROWSER

## ISSUE NÀY CHỈ XẢY RA ĐỐI VỚI CLIENT COMPONENT Ở LẦN REQUEST ĐẦU TIÊN (FULL PAGE LOAD) THÔI NHÁ, VÌ TỪ LẦN ĐIỀU HƯỚNG THỨ 2 TRỞ ĐI THÌ CLIENT COMPONENT SẼ HOÀN TOÀN Ở MÔI TRƯỜNG CLIENT/BROWSER

docs: <https://nextjs.org/docs/messages/react-hydration-error>

Vậy nếu ở 1 client component mà khai báo như sau:

```js
"use client";
import React from "react";

export default function RegisterPage() {
  if (typeof window === "undefined") return "IN SERVER RENDER";
  return <p>IN CLIENT COMPONENT RENDER</p>;
}
```

(typeof window === "undefined": `True` nếu ở `môi trường server` và `false` nếu ở `môi trường client`)

### LỖI VÀ NGUYÊN NHÂN

1. Thì trên khai báo `use client` nên là 1 client COMPONENT

2. NextJs sẽ render giao diện trước phía server và kiểm tra thấy `if (typeof window === "undefined")` sẽ là `true` do đang ở `môi trường server` và `HTML trả về cho client` sẽ là `IN SERVER RENDER`

3. Ở client hiển thị `IN SERVER RENDER` do server trả về, nhưng ở client lúc này nó thực hiện quá trình hydration và kiểm tra thấy `if (typeof window === "undefined")` sẽ là `false` do đang ở `môi trường client - browser`. nên lúc này giao diện sẽ chớp nháy từ `IN SERVER RENDER` sang `<p>IN CLIENT COMPONENT RENDER</p>`, lúc này sẽ có 1 lỗi từ NextJS:

 > Error: Hydration failed because the initial UI does not match what was rendered on the server.

 > See more info here: <https://nextjs.org/docs/messages/react-hydration-error>

- Nôm na lỗi là do UI trên server và lúc ở client khác nhau (trên server là `IN SERVER RENDER`, còn client là `<p>IN CLIENT COMPONENT RENDER</p>`, đâm ra lỗi:

### CÁCH GIẢI QUYẾT

- Đọc docs: <https://nextjs.org/docs/messages/react-hydration-error>
- Hoặc đọc bài này cũng được =))))

#### `Solution 1`: Using useEffect to run on the client only

- Nôm na là NextJS bảo nên cho cái check `if (typeof window === "undefined")` vào `useEffect` do ở server thì không chạy useEffect, nên nội dung lúc render phía server và render ở client GIỐNG NHAU --> OK
- Kết hợp với state để setState và hiển thị nội dung mới lúc hydration

```js
"use client";
import React, { useEffect, useState } from "react";

export default function RegisterPage() {
  const [content, setContent] = useState<string>();

  useEffect(() => {
    if (typeof window === "undefined") setContent("IN SERVER RENDER");
    else setContent("IN CLIENT COMPONENT RENDER");
  }, []);

  return content;
}
```

#### `Solution 2`: Disabling SSR on specific components

- Nôm na là disable cái client component đó KHÔNG FETCH TRƯỚC TRÊN SERVER NỮA =)))
- Lúc này phải tách nó ra làm component khác và import theo dạng:
`const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false })`

```js
//register-content.tsx:
"use client";
import React from "react";

export default function RegisterPageContent() {
  if (typeof window === "undefined") return "IN SERVER RENDER";
  return <p>IN CLIENT COMPONENT RENDER</p>;
}

//tại component gốc:
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const RegisterPageContent = dynamic(
  () => import("./_component/register-content"),
  { ssr: false }
);

export default function RegisterPage() {
  return (
    <div>
      <RegisterPageContent />
    </div>
  );
}

```

#### Các Solution khác thì đọc docs nhé =))))
