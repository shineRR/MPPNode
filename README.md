# MPPNode
# 1. Client - Server
Develop a simple server-rendered application. For example, a list of tasks with the status of their completion, filtering by status and setting the expected completion date, as well as the ability to attach files to each task. The server must provide the client with the ready-made markup, and the data must be sent to the server through the form submission. It is mandatory to use NodeJS, specific libraries may differ. For example, Express + EJS will do.
# 2. Rest API + SPA
A simple application as in Lab 1, but with a different architecture. REST API must be implemented on the server, Single Page Application on the client. Data exchange should be done by sending / accepting http requests with JSON data or multipart / form-data files. Refreshing data on the client should not result in page reloading. The server-side REST API must support the expected semantics: use the http methods correctly (GET for reading data, POST / PUT for changing, DELETE for deleting, etc.) and return correct response codes (200 if the data is read / changed successfully, 404 if the resource will not find, etc.). It is mandatory to use NodeJS on the server. You can use anything on the client, React / Angular / Vue or no library at all.
# 3. JWT
The token must be passed through the httponly cookie to the client and also sent to the server. When trying to read / change data on the server without a valid token, the client returns a 401 code. Upon receiving a 401, the client requires entering the username / password code. The jsonwebtoken and bcrypt packages are used to generate a jwt token.
# 4. Web Sockets
REST API for data exchange via Websockets. SockeIO library.
# 5. GraphQL
On the server, create an API in GraphQL.
