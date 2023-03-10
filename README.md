# rsCloneServer
rsCloneServer

- deploy: https://rscloneserver-production.up.railway.app

## Stack and libraries
- NodeJS
- ExpressJS
- Mysql2
- Nodemailer
- CookieParser
- Cors
- Bcryptjs
- JWT
- Express-validator


## Setup and run

Use node 16.x or higher.

Clone this repo: $ git clone https://github.com/Exelery/rsCloneServer.git.

Go to downloaded folder: $ cd rsCloneServer.

Install dependencies: $ npm install.
set your environment variables in env file for mysql connection and nodemailer
Start server: $ npm run dev.

Now you can send requests to the address: http://localhost:5000.

#### Requests

#### Registration

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>auth/registration</code></summary>

##### Headers:
Content-Type: application/json

##### Body: 
{ name: string, email: string, password: string }

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { text: `Registration is successful`, token: tokens.accessToken }, set 'refreshToken' in cookie   
> | `400`         | value: { error: "Baq request", errors: errors }                            
> | `403`         | value: `User with name - ${email} already exist`  
> | `500`         | value: {error}
</details>

#### Login

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>auth/login</code></summary>

##### Headers:
> Content-Type: application/json

##### Body: 
{ email: string, password: string }

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { text: `Registration is successful`, token: tokens.accessToken }, set 'refreshToken' in cookie   
> | `400`         | value: { error: "Baq request", errors: errors }                            
> | `404`         | value: { message: `Пользователь с email - ${email} не найден. Пройдите регистрацию.` }` 
> | `402`         | value: { message: `Пароль не верный.` }`
> | `500`         | value: {error}
</details>

#### Logout

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>auth/logout</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         |  
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>

#### Refresh access token

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>auth/refresh</code></summary>

##### Headers:
> Content-Type: application/json

##### Body: 
none

##### Cookie:
refreshToken : [refreshToken]

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: accessToken  
> | `400`         | value: "No refresh Token"                            
> | `400`         | value: "Unauthorisation Error" 
> | `402`         | value: { message: `Пользователь с id - ${userData.userId} не найден. Пройдите регистрацию.` }`
> | `500`         | value: {error}
</details>

#### Verify email
<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>auth/activate/:link</code></summary>

##### Headers:
none

##### Body: 
none


##### Responses

redirect or 500
</details>


### User requests

#### Get all users

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>users</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { all users
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>

#### Get user

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>user</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { user }
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>

#### Update user

<details>
 <summary><code>PUT</code> <code><b>/api/</b></code><code>user</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
{ name: string, email: string, oldPassword: string, newPassword: string }

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { user }
> | `401`         | value: { 'Unauthorized access' } 
> | `404`         | value: { message: `Пользователь с id - ${userData.userId} не найден. Пройдите регистрацию.` }`
> | `402`         | value: { message: `Пароль не верный.` }`
> | `500`         | value: {error}
</details>

#### Reset Password

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>user/resetpass</code></summary>

##### Headers:
> Content-Type: application/json


##### Body: 
{ email: string }

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: "New password was sent"
> | `404`         | value: "User with this email doesn't exist"
> | `402`         | value: { message: `Пароль не верный.` }`
> | `500`         | value: {error}
</details>

#### Actiate user Email

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>user/activate</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: "Mail was sent"
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>



### Data
#### Get all user projects

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>data</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { projects[] }
> | `401`         | value: { 'Unauthorized access' } 
> | `400`         | value: "User doesn't exist"
> | `500`         | value: {error}
</details>

#### Create project

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>data</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
{projectName: string, data: string}

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: { projectId: number }
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>

#### Delete project

<details>
 <summary><code>DELETE</code> <code><b>/api/</b></code><code>data</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
{projectId: number}

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: `Project {projectId} deleted`
> | `404`         | value: `Project {projectId} doesn't exist`
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>


#### Update project

<details>
 <summary><code>PUT</code> <code><b>/api/</b></code><code>data</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
{projectId: number, projectName: string, data: string}

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: `Project {projectId} updated`
> | `404`         | value: `Project {projectId} doesn't exist`
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>


#### Create link for project

<details>
 <summary><code>POST</code> <code><b>/api/</b></code><code>data/bind</code></summary>

##### Headers:
> Content-Type: application/json
> Authorization: 'Bearer [accessToken]'

##### Body: 
{projectId: number}

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: `url`
> | `404`         | value: `Project {projectId} doesn't exist`
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>

#### Show Saved project by url

<details>
 <summary><code>GET</code> <code><b>/api/</b></code><code>/page/:hash/:file</code></summary>

##### Headers:
> Content-Type: application/json

##### Body: 
none

##### Responses

> | http code     | response                                                            
> |---------------|---------------------------------------------------------------------
> | `200`         | value: `url`
> | `404`         | value: 'no such file'
> | `401`         | value: { 'Unauthorized access' } 
> | `500`         | value: {error}
</details>




