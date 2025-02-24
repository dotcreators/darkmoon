import { t } from 'elysia';

const ErrorModel = t.Object({
  error: t.String(),
  message: t.String(),
  stack: t.Optional(t.String()),
});

const createErrorResponse = (description: string) =>
  t.Object(
    {
      status: t.Number(),
      response: ErrorModel,
    },
    { description }
  );

export const ErrorResponseModel = {
  BadRequest: createErrorResponse('Bad Request'),
  NotFound: createErrorResponse('Not Found'),
  InternalServerError: createErrorResponse('Internal Server Error'),
};
