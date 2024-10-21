import { t } from 'elysia';

const ErrorModel = t.Object({
  error: t.String(),
  message: t.String(),
  stack: t.Optional(t.String()),
});

export const ErrorResponseModel = {
  BadRequest: t.Object(
    {
      status: t.Number(),
      response: ErrorModel,
    },
    {
      description: 'Bad Request',
    }
  ),
  NotFound: t.Object(
    {
      status: t.Number(),
      response: ErrorModel,
    },
    {
      description: 'Bad Request',
    }
  ),
  InternalServerError: t.Object(
    {
      status: t.Number(),
      response: ErrorModel,
    },
    {
      description: 'Internal Server Error',
    }
  ),
};
