export default ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <script src="https://unpkg.com/htmx.org@1.9.12"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
)
