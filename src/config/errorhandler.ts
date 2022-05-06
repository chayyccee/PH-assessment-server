import { Request, Response, NextFunction } from 'express';

// handle global error in the server

module.exports = (err: any, _req: Request, res:Response, _next: NextFunction) => {
    console.log(err);
    let response = { success: false, message: "", error:{}, statusCode: 500 };

    if (
      err instanceof ReferenceError ||
      err instanceof RangeError ||
      err instanceof SyntaxError ||
      err instanceof TypeError ||
      err instanceof URIError ||
      err instanceof EvalError 
    ) {
      response = {
        success: false,
        message: "oooops, something went horribly wrong",
        error: {
            message: err.message,
            stack: err.stack
        },
        statusCode: 500,
      };
    } else {
      response = {
        success: false,
        message: err.message,
        error: {err},
        statusCode: 400,
      };
    }
  
    return res.status(response.statusCode).json({ ...response, statusCode: undefined });
  };
  