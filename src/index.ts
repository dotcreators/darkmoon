import { Elysia } from "elysia";

export const app: Elysia = new Elysia().listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
