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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css"
          crossorigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""
        ></script>
        <script
          src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"
          crossorigin=""
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/toastify-js"
        ></script>
        <script
          type="text/javascript"
          src="/public/js/util/flowbite.min.js"
        ></script>

        <link rel="stylesheet" href={cssFile} />
        <title>Eoffice Auto</title>
      </head>
      <body class="bg-gray-50">{children}</body>

      {typeof js === 'object' && js
        ? js.map((path) => <script src={path}></script>)
        : js && <script src={js}></script>}
    </html>
  );
}
