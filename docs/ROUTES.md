# Routes Description

Let's go one by one to see what each route does.

-   [Routes Description](#routes-description)
    -   [/ - home](#---home)
        -   [request](#request)
        -   [responses](#responses)
            -   [if current user is authenticated shows](#if-current-user-is-authenticated-shows)
            -   [if current user is not authenticated shows](#if-current-user-is-not-authenticated-shows)
    -   [/auth/login - login](#authlogin---login)
        -   [request](#request-1)
        -   [responses](#responses-1)
            -   [if authentication successful](#if-authentication-successful)
            -   [if authentication fails](#if-authentication-fails)
            -   [without json body request](#without-json-body-request)
            -   [on unknown error](#on-unknown-error)
    -   [/auth/logout - logout](#authlogout---logout)
        -   [request](#request-2)
        -   [responses](#responses-2)
            -   [if there is no active session](#if-there-is-no-active-session)
            -   [if there is an active session](#if-there-is-an-active-session)
    -   [/users - users list](#users---users-list)
        -   [request](#request-3)
        -   [responses](#responses-3)
            -   [if there is no active session](#if-there-is-no-active-session-1)
            -   [if user in session is an admin](#if-user-in-session-is-an-admin)
            -   [if user in session is not an admin](#if-user-in-session-is-not-an-admin)
            -   [on unknown error](#on-unknown-error-1)
    -   [/users - create new users](#users---create-new-users)
        -   [request](#request-4)
        -   [responses](#responses-4)
            -   [if creation successful](#if-creation-successful)
            -   [if creation fails](#if-creation-fails)
    -   [/users/:id - view users by id](#usersid---view-users-by-id)
        -   [request](#request-5)
        -   [responses](#responses-5)
            -   [if there is no active session](#if-there-is-no-active-session-2)
            -   [if fetch is successful](#if-fetch-is-successful)
            -   [if fetch fails](#if-fetch-fails)
    -   [/users/:id - edit users by id](#usersid---edit-users-by-id)
        -   [request](#request-6)
        -   [responses](#responses-6)
            -   [if there is no active session](#if-there-is-no-active-session-3)
            -   [if current session is an regular user](#if-current-session-is-an-regular-user)
                -   [if editing itself without role field](#if-editing-itself-without-role-field)
                -   [if editing others or with role field](#if-editing-others-or-with-role-field)
            -   [if current session is an moderator user](#if-current-session-is-an-moderator-user)
                -   [if editing any user except admin users without role field](#if-editing-any-user-except-admin-users-without-role-field)
                -   [if editing an admin user or with role field](#if-editing-an-admin-user-or-with-role-field)
            -   [if current session is an admin user](#if-current-session-is-an-admin-user)
                -   [if editing any user with or without role field](#if-editing-any-user-with-or-without-role-field)
            -   [if editing user error](#if-editing-user-error)
            -   [on unknown error](#on-unknown-error-2)
    -   [/users/:id - delete users by id](#usersid---delete-users-by-id)
        -   [request](#request-7)
        -   [responses](#responses-7)
            -   [if there is no active session](#if-there-is-no-active-session-4)
            -   [if current session is an regular user](#if-current-session-is-an-regular-user-1)
                -   [if an user is deleting itself](#if-an-user-is-deleting-itself)
                -   [if an user is deleting others](#if-an-user-is-deleting-others)
            -   [if current session is an moderator user](#if-current-session-is-an-moderator-user-1)
                -   [if an mod is deleting itself or any regular user](#if-an-mod-is-deleting-itself-or-any-regular-user)
                -   [if an mod is deleting admin users](#if-an-mod-is-deleting-admin-users)
            -   [if current session is an admin user](#if-current-session-is-an-admin-user-1)
                -   [if deleting any user](#if-deleting-any-user)
                -   [if deleting any user with key](#if-deleting-any-user-with-key)
            -   [if deleting user error](#if-deleting-user-error)
            -   [on unknown error](#on-unknown-error-3)

**All** requests and response bodies are in this API are json format

## / - home

### request

-   method: GET
-   url params: not required
-   json body: not required

### responses

#### if current user is authenticated shows

-   response: 200 code
-   message: authenticated user and next possible requests

#### if current user is not authenticated shows

-   response: 200 code
-   message: promotes user to authenticate

---

## /auth/login - login

### request

-   method: POST
-   url params: not required
-   json body: username and password

### responses

#### if authentication successful

-   response: 200 code
-   message: user is authenticated and next possible requests

#### if authentication fails

-   response: 404 code
-   message: user not found or invalid credentials

#### without json body request

-   response: 401 code
-   message: credentials required

#### on unknown error

-   response: 500 code
-   message: support contact

---

## /auth/logout - logout

### request

-   method: POST
-   url params: not required
-   json body: not required

### responses

#### if there is no active session

-   response: 400 code
-   message: no active session and promotes user to authenticate

#### if there is an active session

-   response: 200 code
-   message: user session destroyed

---

## /users - users list

### request

-   method: GET
-   url params: not required
-   json body: not required

### responses

#### if there is no active session

-   response: 401 code
-   message: authentication required and promotes user to authenticate

#### if user in session is an admin

-   response: 200 code
-   message: list of all users

#### if user in session is not an admin

-   response: 200 code
-   message: list of all users excluding soft deleted

#### on unknown error

-   response: 404 code
-   message: error fetching users

---

## /users - create new users

### request

-   method: POST
-   url params: not required
-   json body: username and password and/or role

**Note**: role field are ignored unless an active session exists and is admin

### responses

#### if creation successful

-   response: 201 code
-   message: create new user and promotes user to authenticate

#### if creation fails

-   response: 400 code
-   message: error on username or already exists

---

## /users/:id - view users by id

### request

-   method: GET
-   url params: user id
-   json body: not required

### responses

#### if there is no active session

-   response: 401 code
-   message: authentication required and promotes user to authenticate

#### if fetch is successful

-   response: 200 code
-   message: fetched user information and next possible actions on fetched user

#### if fetch fails

-   response: 404 code
-   message: user could not be fetched

**Note**: only admin can fetch soft deleted users

---

## /users/:id - edit users by id

### request

-   method: PATCH
-   url params: user id
-   json body: username and password and/or role

### responses

#### if there is no active session

-   response: 401 code
-   message: authentication required and promotes user to authenticate

#### if current session is an regular user

##### if editing itself without role field

-   response: 200 code
-   message: user updated successfully and link to view edited user information

##### if editing others or with role field

-   response: 403 code
-   message: can not edit others or change role fields

#### if current session is an moderator user

##### if editing any user except admin users without role field

-   response: 200 code
-   message: user updated successfully and link to view edited user information

##### if editing an admin user or with role field

-   response: 403 code
-   message: can not edit admin users or change role fields

#### if current session is an admin user

##### if editing any user with or without role field

-   response: 200 code
-   message: user updated successfully and link to view edited user information

#### if editing user error

-   response: 404 code
-   message: user could not be found

**Note**: this message will also be shown to non admins trying to edit soft deleted users

#### on unknown error

-   response: 500 code
-   message: support contact

---

## /users/:id - delete users by id

### request

-   method: DELETE
-   url params: user id
-   json body: optional hard key

**Note**: hard key is only checked for id user in session is an admin

### responses

#### if there is no active session

-   response: 401 code
-   message: authentication required and promotes user to authenticate

#### if current session is an regular user

##### if an user is deleting itself

-   response: 200 code
-   message: user deleted successfully

##### if an user is deleting others

-   response: 403 code
-   message: user can only delete it self

#### if current session is an moderator user

##### if an mod is deleting itself or any regular user

-   response: 200 code
-   message: user deleted successfully

##### if an mod is deleting admin users

-   response: 403 code
-   message: user can only delete it self

#### if current session is an admin user

##### if deleting any user

-   response: 200 code
-   message: user deleted successfully

##### if deleting any user with key

-   response: 200 code
-   message: user deleted successfully

**Note**: all deletes are soft and hide users from queries, using the hard key will permanently destroy a document

#### if deleting user error

-   response: 404 code
-   message: user could not be found

#### on unknown error

-   response: 500 code
-   message: support contact

---

[Back to the top](#routes-description)
