import { JSX } from 'hono/jsx';
import { string } from 'zod';

export default function Layout({
  children,
  js,
}: {
  children: JSX.HTMLAttributes;
  js?: string | string[];
}) {
  const isDev = Bun.env.ENV == 'DEV' ? true : false;
  const cssFile = isDev
    ? '/public/css/output.css'
    : '/public/css/final-min.css';
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
        />
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/toastify-js"
        ></script>
        <script
          type="text/javascript"
          src="/public/js/util/flowbite.min.js"
        ></script>

        <link rel="stylesheet" href={cssFile} />
      </head>
      <body class="bg-gray-50">{children}</body>

      {typeof js === 'object' && js
        ? js.map((path) => <script src={path}></script>)
        : js && <script src={js}></script>}
    </html>
  );
}
