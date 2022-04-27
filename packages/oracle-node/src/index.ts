import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import { Request, Response } from "express";

import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { port } from "./config";

function handleError(err, req, res, next) {
  res.status(err.statusCode || 500).send({ message: err.message });
}

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();

    app.use(morgan("tiny"));
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            res.json(result);
          } catch (error) {
            next(error);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.use(handleError);
    app.listen(port);

    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
