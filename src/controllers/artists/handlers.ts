import { PrismaClient } from "@prisma/client";
import { ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";
import { error } from "elysia";
import { ArtistEditQuery } from "../../models/query/ArtistEditQuery";

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

        if (data.length == 0) return error('Not Found', 'Artist with this ID not found!')
        return data;
    } catch (e) {
        console.error("Error fetching artists:", e);
        throw e;
    }
}

export async function editArtist(artistId: string, query: ArtistEditQuery) {
    try {
        const editFileds: any = {};
        if (query.username) editFileds.username = query.username;
        if (query.name) editFileds.name = query.name;
        if (query.tags) editFileds.tags = query.tags;
        if (query.country) editFileds.country = query.country;
        if (query.images) editFileds.images = query.images;
        if (query.bio) editFileds.bio = query.bio;
        if (query.url) editFileds.url = query.url;

        const data = await prisma
            .artists
            .update({
                where: { id: artistId },
                data: editFileds
            });

        return data;
    } catch (e) {
        console.error("Error edit artist:", e);
        throw e;
    }
}