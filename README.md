# Monorepo for DAO-strategies by DAOStack

## Develop

TL;DR;

You need to:

- work with Node v14 (for now).
- install all yarn workspaces
- compile the core library
- compile the contracts and run a local instance of hardhat testnet.
- run a postgres DB to support the oracle instance
- build the Prisma DB schema and migrate it to the DB
- run the oracle instance (after having created an .env file)
- run the frontend

### Yarn workspace

The packages in this monorepo have cross-depencies among them (The code in `core` is used in `contracts` and `frontend`). This `core` package is not yet even published. For this reason we **need** to use yarn workspaces to install the dependencies of all packages.

In the **root** folder `/` run

```
yarn install
```

### Build core package

Now, we need to build the `@dao-strategies/core` library so that it can be used in the tests and in the frontend:

In `/packages/core`:

```
yarn build
```

This will create the `./dist` folder into the `core` package that other packages will use for now (instead of the npm public repository).

If you want to develop the `core` folder, adding new features, you migh want to run `yarn watch` instead of `yarn build` to re-build it at every change.

### Compile the contracts

In `packages/contracts`:

```
yarn compile
yarn chain
```

If you see an error related to typechain, try removing the generated `./typechain` folder. This is done by the `yarn compile` script anyway.

### Export the contracts compile and built data

Once the chain is running and the contracts have been deployed (it might take a minute or two after running `yarn chain`), you need to export the Typechain and deploy data by running (inside the contracts package)

In `packages/contracts`:

```
yarn export
```

Once export you **must** recompile the `packages/core` package, which is the one holding all of the contracts generated data.

## Runing the oracle node

The oracle-node is a NodeJS express app in `packages/oracle-node`. It uses postgress as the DB and Prisma as the ORM.

You need to codegen the prisma files that will then be stored on `node_modules/@prisma/client`

In `packages/oracle-node`:

```
yarn prisma-generate
```

Then start postgres (and pgAdmin)

In `packages/oracle-node`:

```
sudo docker-compose up
```

Then migrate (create the DB tables) using prisma

In `packages/oracle-node`:

```
yarn prisma-migrate
```

Then you must prepare the .env file by copying the copy.env file to .env, and filling the github token. You need a Github API token which you can create [from here](https://github.com/settings/tokens). No need for any special permissions.

Once the .env file is ready run the NodeJS app.

In `packages/oracle-node`:

```
yarn start
```

If you want to **reset the DB** (delete all tables and regenerate them), you can use

```
yarn prisma-reset
```

## Runing the frontend

The frontend is a React app in `packages/frontend`. Just run (in that folder)

In `packages/frontend`:

```
yarn start
```

A tab pointing to http://localhost:3000 should be automatically openned.

You then need to have Metamask connected the the Localhost testnet (enable testnets from Metamask -> Settings -> Advanced -> Show Test Networks).

Remember to reset the metamask accounts (Settings -> Advanced -> Reset Account) every time you run `yarn chain` since Metamask assumes chains are always up.

You should then be able to create and deploy a test campaign.
