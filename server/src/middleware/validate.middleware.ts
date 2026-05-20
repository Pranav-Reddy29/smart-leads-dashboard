import type {
  NextFunction,
  Request,
  Response,
} from "express";
import type { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as {
      body: Request["body"];
      query: Request["query"];
      params: Request["params"];
    };

    req.body = parsed.body;
    Object.assign(req.query, parsed.query);
    Object.assign(req.params, parsed.params);

    next();
  };
