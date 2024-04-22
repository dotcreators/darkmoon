import { PrismaClient, artists } from "@prisma/client";
import { ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";
import { error } from "elysia";

const prisma = new PrismaClient()

export async function getArtistsPaginated(query: ArtistsSearchQuery) {
    try {
        const orderFilter: any = {};
        if (query.sortBy == 'username') orderFilter.username = 'asc';
        else if (query.sortBy == 'followers') orderFilter.followersCount = 'desc';
        else if (query.sortBy == 'posts') orderFilter.tweetsCount = 'desc';
        else orderFilter.followersCount = 'desc';

        const whereFilter: any = {};
        if (query.username) whereFilter.username = { contains: query.username };
        if (query.country) whereFilter.country = { equals: query.country };
        if (query.tags && query.tags.length > 0) whereFilter.tags = { hasEvery: query.tags };

        const data = await prisma
            .artists
            .findMany({
                take: query.limit,
                skip: (query.page - 1) * query.limit,
                where: Object.keys(whereFilter).length > 0 ? whereFilter : undefined,
                orderBy: orderFilter,
            });

        if (data.length == 0) return error('Not Found', 'Artists with these filters not found, try another filters!')
        return data;
    } catch (e) {
        console.error("Error fetching artists:", e);
        throw e;
    }
}

