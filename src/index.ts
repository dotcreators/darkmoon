import { Elysia } from "elysia";
import artistsRoutes from "./controllers/artists";

export const app: Elysia = new Elysia();

app
  .onError(({ code, error }) => {
    return new Response(error.toString());
  })
  .group('/api', (app) => app.use(artistsRoutes))
  .listen(8989);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
