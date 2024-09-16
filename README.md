# Klontong, the Backend Project

A small convenience store wants to enter the 21st century by selling their products online.

### Details

**Basic Overview:**

> As the child of the convenience store owner, I need to manage the products we sell in a table format.

From an engineer's perspective, consider this as just a CRUD application.

Here is the backend stack you **_must_** use for this project:

- Nest.js
- TypeScript
- PostgreSQL
- Docker
- Upload files
- audit logs (a table to record update and delete operations in the database)
- Typeorm


### Other Things the Project Needs to Have

- Built using a docker file. (And docker-compose)
- Any changes to the data needs to be recorded on the database level.
- File uploading.

### More Technical Details

The entire team has agreed on some specifications and technical limitations:

- All request and response payloads are in JSON format.
- There is a data schema.
- There are about 100 products that need to be managed, so use pagination techniques.
- The designated pages:
  - List all products with **_search_** and pagination features
  - Product details
  - Add a product
  - **_Checkout flow_** (We would love to see your creativity!)

Example schema:

```json
{
  "id": 86,
  "CategoryId": 14,
  "categoryName": "Cemilan",
  "sku": "MHZVTK",
  "name": "Ciki ciki",
  "description": "Ciki ciki yang super enak, hanya di toko klontong kami",
  "weight": 500,
  "width": 5,
  "length": 5,
  "height": 5,
  "image": "https://cf.shopee.co.id/file/7cb930d1bd183a435f4fb3e5cc4a896b",
  "harga": 30000
}
```

Don't forget, your team is international, so do your best to work in English.

### Extra features

Your team doesn’t expect these, but it would be nice to see:

- Deployment on the cloud.
- TDD (Test-Driven Development), to give you confidence that all the code you write is well-tested.
- Applying SOLID principles.

KISS (Keep It Stupid Simple) - Don’t forget, your target audience might not be tech-savvy.

### What we care about

Use whatever libraries you are familiar with as if this were a real production app. Code design and cleanliness are more important than choosing the "right" library. Always strive to use best practices!

### Important!!
If you use environment variables, don’t forget to share them with us along with any credentials we might need.

### Closing
 
Make sure the project is built using docker, we will test by running your docker image.
Don’t forget to set your GitHub repo to public and share it with us.

Happy coding!

Please submit your finished test to [bit.ly/4cWYsiX](https://bit.ly/4cWYsiX)

## Project URL

  `SWAGGER_URL=*http://20.5.110.156:8010/api/docs*`

## Installation

  - Clone GITHUB Repository
    ```
      git clone <URL-REPOSITORY>
    ```
  
  - Install Dependencies
    ```
      npm install
    ```
  
  - Create .env file <br>
    fill all the variables
    ```
    PORT=
    NODE_ENV=

    SECRET_KEY=

    POSTGRES_HOST=
    POSTGRES_PORT=
    POSTGRES_USERNAME=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    POSTGRES_LOGGING=

    POSTGRES_HOST_MIGRATION=
    POSTGRES_PORT_MIGRATION=

    ADMIN_EMAIL=
    ADMIN_PASSWORD=

    AZURE_STORAGE_CONNECTION_STRING=
    ```

    - `POSTGRES_HOST_MIGRATION` is use for migration, you can use -    `localhost` if the database running on same server
    - `POSTGRES_PORT_MIGRATION` s use for migration, you can use -    `5432 (based on db container)` if the database running on same server
    - `ADMIN_EMAIL` is use for generate first admin user email
    - `ADMIN_PASSWORD` is use for generate first admin user password
    - `AZURE_STORAGE_CONNECTION_STRING` for upload email to azure u can use `"DefaultEndpointsProtocol=https;AccountName=testblobs38219032;AccountKey=7UBSFOR4IYwFPAtv87GDFXKMOerigFkrN7Qeq1zQcb6pQ8VXk+vTxHZmlqwOx+R1wfLGaR6wuZY++AStN/RYtw==;EndpointSuffix=core.windows.net"` for testing purpose


  - Run PostgreSQL Container
    ```
    docker pull postgres:13

    docker run -p 5433:5432 --env-file ./.env -v pgdata:/var/lib/postgresql/data -d --name db postgres:13
    ```
  
  - Create Database and run migrations
    ```
    npm run typeorm:db:create
    npm run typeorm:run-migration
    npm run typeorm:run-seed
    ```
  
  - Run the APPS
    ```
    docker build -t klontong-app-image .
    docker run -d -p 8010:8010 --link db:db --name klontong-app-container klontong-app-image
    ```  

Notes: 
```
Recheck Container name if error when deploying using Docker
```