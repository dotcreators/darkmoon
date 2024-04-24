import { Elysia } from "elysia";
import artistsRoutes from "./controllers/artists/artists.controller";

export const app: Elysia = new Elysia();

app.onError(({ error }) => {
  return new Response(error.toString());
});
app.group("/api/v1/", (app) => app.use(artistsRoutes));
app.listen(8989);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
