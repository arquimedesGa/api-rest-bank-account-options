# This Api Rest was created for some types of transaction bank models for test.

##for public test this is a version 1.0.

![](https://imgur.com/gallery/YzBWw)

# LIST OF ENDPOINTS

THE TYPE IS APIrest Full:

-   Create bank account
-   List bank accounts
-   Update data of the customers bank
-   delete bank account
-   Deposit at bank account
-   Withdraw a bank account
-   Transfer values between bank account
-   consult balance.
-   emit to extract of account balance.

**Important: if a validation os the request fail, a adecuated response is sending**

**example:**

```javascript
// when is informed a number of account that doesn't exist:
// HTTP Status 404
{
    "menssage": "bank account it doesn't exist!"
}
```

## data persistence

the data will be save in a data base type `postgres SQL`. **all the data structure will be save in order**

### Estructure `postgres SQL`

```postgres SQL
{
    bank: {
        id serial primary key not null,
        name text not null,
        agency integer not null,
        password text not null
    },
    accounts: [
        id serial primary key not null,
        name text not null,
        cpf varchar(11),
        birth_date date,
        cellphone integer,
        email text not null unique,
        password text not null
    ],
    withdraw: [
        id serial primary key,
        account_origin integer references bankuser(id),
        value integer not null
    ],
    deposit: [
        deposit_date date,
        account_number integer references bankuser(id),
        value integer not null
    ],
    transfer: [
        account_destination integer references bankuser(id),
        account_origin integer references bankuser(id),
        value integer not null
    ],
}
```


## Status Code


Obs.: A list of code taken as example, **not** meens that all of ***status codes*** is going to be used.

```javascript
// 200 (OK) = request sucess
// 201 (Created) = rquest sucess some it's created.
// 204 (No Content) = request sucess non content.
// 400 (Bad Request) = the server don't understand the request.
// 401 (Unauthorized) = not login user forbidden of entry
// 403 (Forbidden) = user is not authorized for some resourses
// 404 (Not Found) = the server is cannot find the resources.
// 500 (Internal Server Error) = fail caused by server.
```

## Endpoints

### Lists bank accounts.

#### `GET` `/accounts?bank_password=`

this endpoint must list all accounts list of the bank Agency, the user must inform the password management on the url.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se a senha do banco foi informada (passado como query params na url)
    -   Validar se a senha do banco está correta

-   **Request** - query params (whith this name)

    -   bank_password

-   **Response**
    -   list of all banks accounts of the agency.

#### Example of response

```javascript
// HTTP Status 200 / 201 / 204
// 2 accounts found
[
    {
        "number": "1",
        "balance": 0,
        "user": {
            "name": "Foo Bar",
            "id": "00011122233",
            "birth_date": "2021-03-15",
            "cellphone": "71999998888",
            "email": "foo@bar.com",
            "password": "1234"
        }
    },
    {
        "number": "1",
        "balance": 1000,
        "user": {
            "name": "Foo Bar",
            "id": "00011122233",
            "birth_date": "2021-03-15",
            "cellphone": "71999998888",
            "email": "foo@bar.com",
            "password": "1234"
        }
    }
]

// no one account is found
[]
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "the password is invalid"
}
```

### Create bank account

#### `POST` `/account`

this endpoint create a bank account pasing the next data parameters as JSON data.

-   **Request** - the body (body) must add an object with the next format (respecting the format):

    -   name
    -   id
    -   birth_date
    -   cellphone
    -   email
    -   password

-   **Response**

    IN case of **sucess**, is not send response at the  (body).  
    IN case of **fail**, the response must be ***status code*** appropriate.

#### Exemplo de Requisição

```javascript
// POST /account
{
        "name": "Foo Bar",
        "id": "00011122233",
        "birth_date": "2021-03-15",
        "cellphone": "71999998888",
        "email": "foo@bar.com",
        "password": "1234"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// without content (body).
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "already exist an accounts whith this id or email."
}
```

### update user of bank

#### `PUT` `/accounts/:numberofaccount/user`

this endpoint modify the data of user bank.



-  **Request** - the body (body) must add an object with the next format (respecting the format):

    -   name
    -   id
    -   birth_date
    -   cellphone
    -   email
    -   password

-   **Response**

    IN case of **sucess**, is not send response at the  (body).  
    IN case of **fail**, the response must be ***status code*** appropriate.


#### Exemplo de Requisição
```javascript
// PUT /account/:accountnumber/user
{
        "name": "Foo Bar",
        "id": "00011122233",
        "birth_date": "2021-03-15",
        "cellphone": "71999998888",
        "email": "foo@bar.com",
        "password": "1234"
}
```


#### example of response

```javascript
// HTTP Status 200 / 201 / 204
// no content
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "the id informed is alredy registered!"
}
```


### Deposit

#### `POST` `/transaction/deposit`

this endpoint must plus the values of deposit with the balance.


-   **Request** - the body (body) must add an object with the next format (respecting the format):

    -   account_number
    -   value

-   **Response**
-   IN case of **sucess**, is not send response at the  (body).  
    IN case of **fail**, the response must be ***status code*** appropriate.

#### Example of request
```javascript
// POST /transaction/deposit
{
	"account_number": "1",
	"value": 1900
}
```

#### Example of response

```javascript
// HTTP Status 200 / 201 / 204
// no content
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "account number is mandatory!"
}
```

#### example of register

```javascript
{
    "date": "2021-08-10 23:40:35",
    "account_number": "1",
    "value": 10000
}
```

### withdraw

#### `POST` `/transaction/withdraw`

this endpoint make a withdraw of the account of customer


-   **Request** - (body) must possess a objet with the next properties (respecting this names):

    -   account_number
    -   value
    -   password

-   **Response**

-   IN case of **sucess**, is not send response at the  (body).  
    IN case of **fail**, the response must be ***status code*** appropriate.

#### Example os request
```javascript
// POST /transaction/withdraw
{
	"account_number": "1",
	"value": 1900,
    "password": "123456"
}
```
#### Example os response
```javascript
// HTTP Status 200 / 201 / 204
// without content
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "the values not must be zero!"
}
```

#### Example of withdraw register

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Tranfer

#### `POST` `/transaction/transfer`



-   IN case of **sucess**, is not send response at the  (body).  
    IN case of **fail**, the response must be ***status code*** appropriate.

    - account_destination: "2",
    - account_origin: "1",
    -   value
    -   password

-   **Response**


#### example of request
```javascript
// POST /transaction/transfer
{
    "account_destination": "2",
    "account_origin": "1",
	"value": 200,
	"password": "123456"
}
```
#### Example of response

```javascript
// HTTP Status 200 / 201 / 204
// no content
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "insufficient balance!"
}
```

#### example of register transfer

```javascript
  {
      "date": "2021-08-18 20:47:24",
      "account_destination": "2",
      "account_origin": "1",
      "valor": 200  
    }
```

### balance

#### `GET` `/account/balance?account_number=123&passwaord=123`


-   **Request** - query params

    -   account_number
    -   password

-   **Response**

    -   account balance

#### Example of response

```javascript
// HTTP Status 200 / 201 / 204
{
    "balanc": 13000
}
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "account is not found or not exist"
}
```

### Extract account balance

#### `GET` `/account/extract?account_number=123&password=123`


-   **Request** - query params

    -   account_number
    -   password

-   **Response**
    -   account report

#### Example os response

```javascript
// HTTP Status 200 / 201 / 204
{
  "deposit": [
    {
      "date": "2021-08-18 20:46:03",
      "account_number": "1",
      "value": 10000
    },
    {
      "date": "2021-08-18 20:46:03",
      "account_number": "1",
      "value": 10000
    }
  ],
  "withdraw": [
    {
      "date": "2021-08-18 20:46:03",
      "account_number": "1",
      "value": 10000
    }
  ],
  "transfersend": [
    {
      "date": "2021-08-18 20:47:24",
      "account_destination": "2",
      "account_origin": "1",
      "valor": 200  
    }
  ],
  "transferreceive": [
    {
      "date": "2021-08-18 20:47:24",
      "account_destination": "2",
      "account_origin": "1",
      "valor": 2000
    },
    {
      "date": "2021-08-18 20:47:26",
      "account_destination": "2",
      "account_origin": "1",
      "valor": 2000
    }
  ]
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "message": "account is not found!"
}
```


###### tags: `back-end`  `nodeJS` `API REST` 
