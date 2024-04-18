import { ExecutionContext } from "hono/dist/types/context"
import { Enviroment } from "./env.config";
import app from "./hono"

export default {
    fetch(request: Request, env: Enviroment, ctx: ExecutionContext) {
      return app.fetch(request, env, ctx)
    }
}