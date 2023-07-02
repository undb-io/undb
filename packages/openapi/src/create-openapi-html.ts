import type { Table } from '@undb/core'
import type { OpenAPIObject } from 'openapi3-ts/oas31'

export const createRedocHTML = (table: Table, spec: OpenAPIObject) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${table.name.value} open api</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />

    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #redoc-container{
        background-color:white
      }
    </style>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>

    <div id="redoc-container"></div>
    <script>
    Redoc.init(${JSON.stringify(spec)}, {

    }, document.getElementById('redoc-container'))
    </script>
  </body>
</html>
	`
}
