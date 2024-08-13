# Có những cách nào để kiểm tra xem môi trường hiện tại của NextJs là client hay server, liệt kê tất cả cho tôi

***Lưu ý***: </br>

- ***Quá trình render HTML của Client component trên Server của NextJs chỉ render JSX thôi, các hook thì nó không chạy trên server nhé***</br>
- ***Server sẽ bỏ qua (skip) tất cả các hooks `của client` (nói `của client` tức là server cũng có hook nhé, useRouter from "next/router", headers(), cookies(),...) và chỉ render phần HTML tĩnh của component***</br>
- ***Khi code JavaScript được tải về client, quá trình hydration bắt đầu***</br>
- ***Lúc này, các hooks mới thực sự được khởi tạo và chạy***

Ví dụ vài hook `trên client`:

- useRouter from "next/navigation";
- { useState, useEffect,...} from "react"
...


## 1.Kiểm tra 'window' object

```js
const isClient = typeof window !== 'undefined';
```

## 2. Sử dụng 'process.browser'

```js
const isClient = process.browser;
```

## 3. Kiểm tra 'document' object

```js
const isClient = typeof document !== 'undefined';
```

## 4. Sử dụng 'useEffect' hook

```js
import { useEffect, useState } from 'react';

function Component() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  // isClient sẽ là true chỉ khi component được mount ở client
}
```

## 5. Sử dụng 'useLayoutEffect' hook

```js
import { useLayoutEffect, useState } from 'react';

function Component() {
  const [isClient, setIsClient] = useState(false);
  useLayoutEffect(() => setIsClient(true), []);
}
``` 

## 6. Kiểm tra 'navigator' object

```js
const isClient = typeof navigator !== 'undefined';
```

## 7. Kiểm tra 'globalThis'

```js
const isClient = typeof globalThis.window !== 'undefined';
```
