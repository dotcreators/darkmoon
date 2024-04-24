import { PrismaClient } from "@prisma/client";
import { ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";
import { error } from "elysia";
import { ArtistEditRequest } from "../../models/query/ArtistEditRequest";
import {
  ArtistUpdateRequest,
  BulkArtistUpdateRequest,
} from "../../models/query/ArtistsUpdateRequest";

export class ArtistsServices {
  private readonly prisma = new PrismaClient();

  async getArtistsPaginated(request: ArtistsSearchQuery) {
    try {
      const orderFilter: any = {};
      if (request.sortBy == "username") orderFilter.username = "asc";
      else if (request.sortBy == "followers")
        orderFilter.followersCount = "desc";
      else if (request.sortBy == "posts") orderFilter.tweetsCount = "desc";
      else orderFilter.followersCount = "desc";

      const whereFilter: any = {};
      if (request.username)
        whereFilter.username = { contains: request.username };
      if (request.country) whereFilter.country = { equals: request.country };
      if (request.tags && request.tags.length > 0)
        whereFilter.tags = { hasEvery: request.tags };

      const data = await this.prisma.artists.findMany({
        take: request.limit,
        skip: (request.page - 1) * request.limit,
        where: Object.keys(whereFilter).length > 0 ? whereFilter : undefined,
        orderBy: orderFilter,
      });

      if (data.length == 0)
        return error("Not Found", "Artist with this ID not found!");
      return data;
    } catch (e) {
      console.error("Error fetching artists:", e);
      throw e;
    }
  }

  async editArtist(artistId: string, request: ArtistEditRequest) {
    try {
      const editFileds: any = {};
      if (request.username) editFileds.username = request.username;
      if (request.name) editFileds.name = request.name;
      if (request.tags) editFileds.tags = request.tags;
      if (request.country) editFileds.country = request.country;
      if (request.images) editFileds.images = request.images;
      if (request.bio) editFileds.bio = request.bio;
      if (request.url) editFileds.url = request.url;

      const data = await this.prisma.artists.update({
        where: { id: artistId },
        data: editFileds,
      });

      return data;
    } catch (e) {
      console.error("Error edit artist:", e);
      throw e;
    }
  }

  async updateArtistStats(artistId: string, request: ArtistUpdateRequest) {
    try {
      const data = this.prisma.artists.update({
        where: {
          id: artistId,
        },
        data: {
          tweetsCount: request.tweetsCount,
          followersCount: request.followersCount,
        },
      });

      return data;
    } catch (e) {
      console.error("Error updating artist:", e);
      throw e;
    }
  }

  async bulkUpdateArtistsStats(request: BulkArtistUpdateRequest[]) {
    try {
      const updatePromises = request.map((request) => {
        return this.prisma.artists.updateMany({
          where: {
            id: request.artistId,
          },
          data: {
            tweetsCount: request.tweetsCount,
            followersCount: request.followersCount,
          },
        });
      });

      const results = await Promise.all(updatePromises);

      return results.length;
    } catch (e) {
      console.error("Error updating artists:", e);
      throw e;
    }
  }

  async deleteArtist(artistId: string) {
    try {
      const data = this.prisma.artists.delete({
        where: {
          id: artistId,
        },
      });

      return error("OK", "Gone");
    } catch (e) {
      console.error("Error delete artist:", e);
      throw e;
    }
  }

  async bulkDeleteArtists(artistsIds: string[]) {
    try {
      const deletePromises = artistsIds.map((id) => {
        return this.prisma.artists.delete({
          where: {
            id: id,
          },
        });
      });

      const results = await Promise.all(deletePromises);

      return results.length;
    } catch (e) {
      console.error("Error delete artist:", e);
      throw e;
    }
  }
}
