import { createTableSchema } from './create-table-schema'

export const createRedocHTML = () => {
  const docs = createTableSchema()
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Redoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>

    <div id="redoc-container"></div>
    <script>
    Redoc.init(${JSON.stringify(docs)}, {
      scrollYOffset: 50
    }, document.getElementById('redoc-container'))
    </script>
  </body>
</html>
	`
}
