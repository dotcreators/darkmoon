import { TwitterUserProfile } from '../models/Fetch/TwitterUserProfile';
import { FetchUpdatedStats } from '../models/Fetch/UpdateUserProfile';
import { ArtistProfile } from '../models/ArtistProfile';
import { Database } from '../models/Database';
import { createClient } from '@supabase/supabase-js';
import { ArtistsQuery } from '../models/ArtistsQuery';

export async function CreateArtists(_artists: TwitterUserProfile[], url: string, key: string): Promise<number> {
    const supabase = createClient<Database>(url, key);

    try {
        const changedArtists = _artists.map(artist => ({
            name: artist.name,
            username: artist.username,
            userId: artist.userId,
            images: artist.images,
            followersCount: artist.followersCount,
            tweetsCount: artist.tweetsCount,
            joinedAt: artist.joinedAt.toISOString(),
            url: artist.url,
            bio: artist.bio ?? null,
            website: artist.website ?? null,
        }));

        const { data, error } = await supabase
            .from('artists')
            .insert(changedArtists)
            .select();

        if (error) throw error;
        
        return data.length;
    } catch (e) {
        console.error('Failed to create artists:', e);
        return 0;
    }
}

export async function FetchArtist(url: string, key: string) {
    const supabase = createClient<Database>(url, key);
    const { data, error } = await supabase
        .from('artists')
        .select('*');
    console.log(error)
    return data;
}

// export async function UpdateArtists(_artists: FetchUpdatedStats[]): Promise<number> {
//     try {
//         const updatePromises = _artists.map(artist => {
//             return _prisma.artists.update({
//                 where: {
//                     userId: artist.userId
//                 },
//                 data: {
//                     followersCount: artist.followersCount,
//                     tweetsCount: artist.tweetsCount
//                 }
//             });
//         });

//         const results = await Promise.all(updatePromises);

//         return results.length;
//     } catch(e) {
//         console.error('Failed to update artists:', e);
//         return 0;
//     }
// }

// export async function EditArtist(_artist: ArtistProfile): Promise<string | undefined> {
//     try {
//         const updatedProfile = await _prisma.artists.update({
//             where: {
//                 userId: _artist.userId
//             },
//             data: {
//                 username: _artist.username,
//                 images: _artist.images,
//                 country: _artist.country,
//                 tags: _artist.tags,
//                 bio: _artist.bio,
//                 url: _artist.url
//             }
//         });

//         return updatedProfile.username;
//     } catch(e) {
//         console.error('Failed to edit artist:', e);
//         return undefined;
//     }
// }

// export async function DeleteArtist(_artistId: string): Promise<string | undefined> {
//     try {
//         const updatedProfile = await _prisma.artists.delete({
//             where: {
//                 userId: _artistId
//             },
//         });

//         return updatedProfile.username;
//     } catch(e) {
//         console.error('Failed to delete artist:', e);
//         return undefined;
//     }
// }

export async function GetArtistsPaginated(query: ArtistsQuery): Promise<ArtistProfile | undefined> {
    try {
        const supabase = createClient<Database>(query.apiUrl, query.apiKey);

        let filter: string[] = [];

        if (query.options?.country) filter.push(`country.eq.${query.options.country}`);
        if (query.options?.q) filter.push(`username.like.%${query.options.q}%`);
        if (query.options?.tags) {
            let tags = query.options.tags.split('-');
            let formattedTags = `{${tags.map(tag => `"${tag.toString()}"`).join(', ')}}`;
            filter.push(`tags.cs.${formattedTags}`);
        }

        const filteredString = 'and(' + filter.join(',') + ')';

        const baseQuery = supabase
            .from('artists')
            .select()
            .limit(query.count - 1)
            .range(query.count * (query.page - 1), query.count * query.page)
            .order(
                query.options?.sort == "followers" 
                ? "followersCount"
                : query.options?.sort == "username"
                ? "username"
                : query.options?.sort == "posts"
                ? "tweetsCount"
                : "followersCount", 
                { ascending: query.options?.sort == "username" ? true : false, nullsFirst: false });

        const finalQuery = filter.length > 0 ? baseQuery.or(filteredString) : baseQuery;

        const {data, error} = await finalQuery.returns<ArtistProfile>();
    
        if (error) {
            throw error;
        }
    
        return data;
    } catch(e) {
        console.error('Failed to get artists:', e);
        return undefined
    }
}