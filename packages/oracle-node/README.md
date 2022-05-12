## Running the Postgres and PgAdmin

1. Run postgres and pgadmin 4 with

```
sudo docker-compose up
```

2. Migrate the Prisma schema (creates DB tables)

```
yarn migrate
```

3. Update Prima Client (needs to be done everytime the schema file changes)

```
yarn generate
```

#### Delete Data from the DB

Unmount the volumes

```
sudo docker-compose down --volumes
```

Remove them

```
sudo docker volume rm $(docker volume ls -q)
```

### Explore the DB with pgAdmin

Open http://localhost:5050/

Add a new server with

- Hostname: oracle-node_postgres_1
- Port: 5432
- Maintainance DB: postgres
- Username: postgres
- Password: postgres

If having issues: check the name of the postgres network connection with

```
sudo docker network inspect oracle-node_postgres
```

And noting the postgres container "Name" property.

The `oracle-node_postgres` above is obtained from

```
sudo docker network ls
```
