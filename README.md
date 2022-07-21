# Monorepo for DAO-strategies by DAOStack

## Develop and test the contracts

The packages in this monorepo have cross-depencies among them (The code in `core` is used in `contracts` and `frontend`). This `core` package is not yet even published. For this reason we need to use yarn workspaces to install the dependencies of all packages.

On the root folder run

```
yarn install
```

Now, we need to build the `@dao-strategies/core` library so that it can be used in the tests and in the frontend:

```
cd core
yarn build
```

This will create the `./dist` folder into the `core` package that other packages will use for now (instead of the npm public repository).

Then cd into `packages/contracts` and run

```
yarn compile
yarn chain
```

If you want to run tests, open another terminal and run

```
yarn test
```

The `.vscode` folder has a launch configuration to run the tests and debug them (the JS part). You can, thus, run the tests from the VSCode Run & Debug view and add breakpoints in the `main.test.ts` file.

If you want to develop the `core` folder, adding new features, you migh want to run `yarn watch` instead of `yarn build` to re-build it at every change.

## Runing the subgraph and the frontend

After having installed all the workspaces with `yarn install` from the root folder and having ran the chain using `yarn chain` as explained above, we then need to run a subgraph node (and it's ipfs and postgress companion processes).

This is done with docker (which needs to be intalled) and then

```
cd packages/services/graph-node
sudo docker-compose up
```

Once the docker processes are running we need to create and deploy the subgraph.

```
cd packages/subgraph
```

And then, we once need to build the subgraph with:

```
yarn codegen
yarn build
```

The rest of the times we just need to deploy it (not build it) everytime we run the graph node (TBC!).

To deploy the subgraph we need to run (in `packages/subgraph`)

```
yarn create-local
yarn deploy-local
```

(Check the logs to see if everything went well).

Then we can run the app from the root folder with

```
yarn start
```

## Runing the oracle node

The oracle-node is a NodeJS express app in `packages/oracle-node`. It uses postgress as the DB and Prisma as the ORM.

You need to codegen the prisma files that will then be stored on `node_modules/@prisma/client`

```
yarn prisma-generate
```

Then start postgres (and pgAdmin)

```
sudo docker-compose up
```

Then migrate (create the DB tables) using prisma

```
yarn prisma-migrate
```

Then run the NodeJS app

```
yarn start
```

## Runing the frontend

The frontend is a React app in `packages/frontend`.

```
yarn start
```
