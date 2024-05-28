import { t } from 'elysia';

const TrendsGetSchema = t.Object({ range: t.Number({ enum: [7, 14, 30] }) });

export default TrendsGetSchema;
