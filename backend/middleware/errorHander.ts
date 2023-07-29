/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { AppError } from "./appErr";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => { 

  console.log('dasdaw')
  if (error.name === "ValidationError") {
    res.status(400).send({
      type: "ValidationError",
      details: error.message
    });
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      Error: error.message
    });
  }
  res.status(500).send("Something went wrong");
};

export { errorHandler };