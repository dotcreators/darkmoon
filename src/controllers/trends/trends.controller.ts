import Elysia, { t } from "elysia";
import { TrendsServices } from "./trends.services";
import { trendsResponses } from "../../models/responses/TrendsResponses";
import { errorResponses } from "../../models/responses/ErrorsResponses";
import TrendsGetSchema from "./trends.schema";

const trendsService: TrendsServices = new TrendsServices();

const trendsRoutes = new Elysia({
	prefix: "/trends",
	detail: {
		tags: ["Trends"],
	},
}).get(
	"/:artistId",
	async ({ params: { artistId }, query, set }) => {
		try {
			const data = await trendsService.getArtistTrend(
				artistId,
				Number.parseInt(query.range),
			);

			if (data) {
				return {
					status: "success",
					response: data,
				};
			}

			return {
				status: "success",
				response: "Trends data is not recorded for this artist",
			};
		} catch (e) {
			set.status = 500;
			return {
				status: "error",
				response: e,
			};
		}
	},
	{
		transform() {},
		query: TrendsGetSchema,
		response: {
			200: trendsResponses["trends.get"],
			400: errorResponses["api.badrequest"],
			500: errorResponses["api.error"],
		},
	},
);

export default trendsRoutes;
