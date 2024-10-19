import { t } from 'elysia';

export const ErrorResponseModel = {
  BadRequest: t.Object(
    {
      status: t.Number(),
      response: t.Object({
        error: t.String(),
        message: t.String(),
        stack: t.Optional(t.String()),
      }),
    },
    {
      description: 'Bad Request',
    }
  ),
  InternalServerError: t.Object(
    {
      status: t.Number(),
      response: t.Object({
        error: t.String(),
        message: t.String(),
        stack: t.Optional(t.String()),
      }),
    },
    {
      description: 'Internal Server Error',
    }
  ),
};
