import { ArtistSuggestion, PrismaClient } from "@prisma/client";
import { SuggestionRequest } from "../../models/query/suggestions/SuggestionRequest";
import { SuggestionCreateRequest } from "../../models/query/suggestions/SuggestionCreateRequest";

export class SuggestionsServices {
	private readonly prisma = new PrismaClient();

	async getSuggestionsPaginated(
		request: SuggestionRequest,
	): Promise<{ data: ArtistSuggestion[]; has_next: boolean }> {
		try {
			const requestStatus: any = {};
			if (request.requestStatus !== "all")
				requestStatus.requestStatus = request.requestStatus;

			const data = await this.prisma.artistSuggestion.findMany({
				take: request.limit,
				skip: (request.page - 1) * request.limit,
				where: requestStatus,
				orderBy: {
					createdAt: "desc",
				},
			});

			return {
				data: data,
				has_next: data.length === request.limit,
			};
		} catch (e) {
			console.error("Error while fetching artist suggestions:", e);
			throw e;
		}
	}

	async checkUser(username: string): Promise<boolean> {
		try {
			const data = await this.prisma.artist.findFirst({
				where: {
					username: username,
				},
			});

			if (!data) {
				return false;
			}
			return true;
		} catch (e) {
			console.error("Error while fetching artist suggestions:", e);
			throw e;
		}
	}

	async createSuggestion(request: SuggestionCreateRequest) {
		try {
			const data = await this.prisma.artistSuggestion.create({
				data: {
					username: request.username,
					avatarUrl: request.avatarUrl,
					tags: request.tags,
					country: request.country,
					createdAt: new Date().toISOString(),
					requestStatus: "suggested",
				},
			});
		} catch (e) {
			console.error("Error while creating artist suggestion:", e);
			throw e;
		}
	}

	async updateStatusSuggestion(
		suggestionId: string,
		requestStatus: string,
		country?: string,
		tags?: string[],
	) {
		try {
			const data = await this.prisma.artistSuggestion.update({
				where: {
					requestId: suggestionId,
				},
				data: {
					requestStatus: requestStatus,
					tags: tags,
					country: country,
				},
			});

			return data;
		} catch (e) {
			console.error("Error while editing status of suggested artist:", e);
			throw e;
		}
	}
}
