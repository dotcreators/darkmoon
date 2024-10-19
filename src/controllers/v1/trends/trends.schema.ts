import { t } from 'elysia';

const TrendsGetSchema = t.Object({
  range: t.String({ enum: [7, 14, 31, 93, 186, 372] }),
});

export default TrendsGetSchema;
