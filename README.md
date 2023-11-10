# repos-api

Node.js Express.js mongoose.js API with role-based access control

-   [repos-api](#repos-api)
    -   [Description](#description)
    -   [API Routes Structure](#api-routes-structure)
        -   [See this **Doc** for a more in depth look into each route](#see-this-doc-for-a-more-in-depth-look-into-each-route)
    -   [Database Structure](#database-structure)
    -   [Permissions/Role Description](#permissionsrole-description)
    -   [Database Setup](#database-setup)
        -   [Installed `mongodb`, `mongo shell`, `mongo tools` and `mongo compass`](#installed-mongodb-mongo-shell-mongo-tools-and-mongo-compass)
        -   [Added aliases to `.bashrc` and created `Data/` and `Log/` folders for ease of use/cleaning](#added-aliases-to-bashrc-and-created-data-and-log-folders-for-ease-of-usecleaning)
        -   [Created `database`, `collections`.](#created-database-collections)
        -   [Setup an API mongoDB user with role to use authenticated connections](#setup-an-api-mongodb-user-with-role-to-use-authenticated-connections)
    -   [API/Project Setup](#apiproject-setup)
        -   [Initial requirements](#initial-requirements)
        -   [Steps](#steps)
        -   [Environment variables](#environment-variables)
    -   [Dependencies Used](#dependencies-used)
    -   [Testing This API/Project](#testing-this-apiproject)

## Description

Let's start with the name and say don't pay much attention to it, it's unrelated to the current scope of this project but it will serve as a **reminder** of what I wanted to build it will happen once I have have a little more skills and a better understanding of the technologies and workflow involved in creating a framework.

As it stands now **repos-api** is a small API build with Node.js and Express.js uses mongoose.js to communicate with it's mongoDB database this contains one collection of users witch each one as it's own document.

Each user has a role, (_user by default_ mod or admin) depending on their role the user can interact differently with the API, this also means that authentication is required for most of the possible interactions between users and the API.

---

## API Routes Structure

| Method   | Path         | Request              | Requirements                       |
| :------- | :----------- | :------------------- | :--------------------------------- |
| - get    | /            | - home               | - none                             |
| - post   | /auth/login  | - login              | - json body                        |
| - post   | /auth/logout | - logout             | - active session                   |
| - get    | /users       | - users list         | - none                             |
| - post   | /users       | - create new users   | - json body                        |
| - get    | /users/:id   | - users by id        | - url parameter                    |
| - patch  | /users/:id   | - edit users by id   | - url parameter and json body      |
| - delete | /users/:id   | - delete users by id | - url parameter optional json body |

### [See this **Doc** for a more in depth look into each route](./docs/ROUTES.md)

---

## Database Structure

```jsonc
"reposDB": {
    "users" : {                             // collection
        "user" : {                          // document structure
            "_id" :         "object",       // not null     | unique | primary key
            "username" :    "string",       // not null     | unique | short ( <=15 chars )
            "password" :    "string",       // not null     | hashed bcrypt
            "created" :     "date",         // not null     | creation date
            "role" :        "string",       // not null     | default is *user*
            "edited" : {
                "at" :      "date",         // can be null  | edition date
                "by" :      "int",          // can be null  | foreign key ( user )
            },
            "deleted" : {
                "at" :      "date",         // can be null  | deletion date
                "by" :      "int",          // can be null  | foreign key ( user )
            }
        }
    },
}
```

---

## Permissions/Role Description

| Role Name | Disambiguation | Permissions | Read | Read + | Write | Write + |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **user** | regular user | acts only on it self | all | not deleted | self | soft delete |
| **mod** | user moderator | acts on users with **user** **mod** | all | not deleted | user mod | soft delete |
| **admin** | user administrator | acts on every user | all | all | all | soft + hard delete |

---

## Database Setup

### Installed `mongodb`, `mongo shell`, `mongo tools` and `mongo compass`

| mongoDB Software | Version | Why |
| :-- | --: | :-- |
| [mongodb community](https://www.mongodb.com/try/download/community) | ^6.0.1 | DB - Community version of MongoDB distributed database |
| [mongosh shell](https://www.mongodb.com/try/download/shell) | ^1.5.4 | CLI - The quickest way to connect to and work with MongoDB |
| [mongodb tools](https://www.mongodb.com/try/download/database-tools) | ^100.6.0 | CLI ext - collection of command-line utilities for working with MongoDB |
| [mongo compass](https://www.mongodb.com/try/download/compass) | ^1.32.6 | GUI - Easily explore and manipulate MongoDB databases _and I'm lazy_ |

### Added aliases to `.bashrc` and created `Data/` and `Log/` folders for ease of use/cleaning

I know this is a very personalised setup, but I like to know where everything is.

```bash
# custom port - add '--port 27017'
# log session - add '--logpath /home/user/Mongo/Log/session.log'
alias mongo-start='mongod --auth --dbpath /home/user/Mongo/Data/'
```

### Created `database`, `collections`.

```mongosh
use reposDB
db.createCollection("users")
```

### Setup an API mongoDB user with role to use authenticated connections

```mongosh
use admin
db.createUser({
    user: "repoUser",
    pwd: "repoPass",
    roles: [
        { role: "readWrite", db: "reposDB" }
    ]
})
```

Final connection string:

```txt
mongodb://repoUser:repoPass@127.0.0.1:27017/reposDB?authMechanism=DEFAULT&authSource=admin
```

---

## API/Project Setup

### Initial requirements

| Software                       | Version  | Why                                                                      |
| :----------------------------- | :------- | :----------------------------------------------------------------------- |
| [Node.js](https://nodejs.org/) | ^16.17.1 | JavaScript runtime environment - Required to run the project             |
| npm                            | ^8.15.0  | Include with Node.js - Required to install libraries used by the project |

### Steps

1. Clone this repository
2. In your terminal flavor `cd` into the root folder of this projects
3. run `npm install` to install the dependencies used by this project
4. Duplicate the _.env.example_ rename the duplicated file to _.env_ see the next section for more information about the environment variables
5. If you already went thru the process of setting up the database you can seed it using the command `npm run seed-user`
6. Running this project can be done by running:
    1. `npm run start-dev` to run the project using the developer friendly **nodemon**
    2. `npm run start-pro` to run directly using Node.js

**NOTE**: **nodemon** is not declared in the _package.json_ file, I installed it globally by running `npm install -g nodemon`, if you want to use it locally instead run `npm install nodemon` instead

### Environment variables

The variables values present in the `.env` file should represent the setup the project is going to be running

| Variable Name | Description | Usage |
| :-- | :-- | :-- |
| SERVER_URL | url the server is running on | used by the API to display information |
| SERVER_PORT | port the server is listening for requests | used by the API to display information |
| DATABASE_NAME | database name | used by the server to connect to the database |
| DATABASE_HOST | database host url | used by the server to connect to the database |
| DATABASE_PORT | database host port | used by the server to connect to the database |
| DATABASE_USER | username with access to the database | used by the server to connect to the database |
| DATABASE_PASS | password for the user with access to the database | used by the server to connect to the database |
| DATABASE_CONNECTION | full connection string to the database | used early in development to test connections quickly, kept for similar reasons |
| SECRET_KEY | session key | used to encode and decode the user session |
| ENVIRONMENT | current environment the server is running | dev enables the logger, useful for debugging |
| HARD_KEY | admin key | enables the admin user to hard delete users |

---

## Dependencies Used

| Dependency      | Version | Why                                                                |
| :-------------- | :------ | :----------------------------------------------------------------- |
| express         | ^5.0.1  | web framework used to serve the API                                |
| mongoose        | ^1.4.6  | simplifying communication with the database                        |
| dotenv          | ^16.0.1 | separate sensible information from the code, people say it's safer |
| bcrypt          | ^4.18.1 | encrypt and compare user passwords                                 |
| express-session | ^1.17.3 | to create user sessions and authentication tokens                  |
| cookie-parser   | ^6.5.3  | encode and decode and edit the cookie tokens                       |
| serve-favicon   | ^2.5.0  | express way to serve that little neat icon                         |
| nodemon         | ^2.0.20 | ensure the sanity of the developer                                 |

**Known Issue**: On Firefox due to their neat json renderer functionality and stricter security the favicon serving will trow an `Cross-Origin Error` and block the favicon from loading except in the API root more [Info](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

---

## Testing This API/Project

To test this project a few things were created:

-   Thunder Client collection [file](./_api_testing/repos-testing-thunder/thunder-collection_thunder-repos-api.json)
-   Insomnia document [file](./_api_testing/repos-testing-insomnia/Insomnia-All_2022-10-04.json)
-   Exported database collection [file](./_api_testing/_db_export/users_collection_export.json)

---

[Back to the top](#repos-api)
