import { TwitterUserProfile } from '../models/Fetch/TwitterUserProfile';
import { FetchUpdatedStats } from '../models/Fetch/UpdateUserProfile';
import { ArtistProfile } from '../models/ArtistProfile';
import { Database } from '../models/Database';
import { createClient } from '@supabase/supabase-js';
import { ArtistsQuery } from '../models/ArtistsQuery';
import { ArtistEditQuery, ArtistEditableFields } from '../models/ArtistEditQuery';
import { ArtistUpdateQuery } from '../models/ArtistUpdateQuery';
import { ArtistCreateQuery } from '../models/ArtistsCreateQuery';

/**
 * Create artists profiles
 * @param {TwitterUserProfile[]} artists Scrapped artists information
 * @param {string} url Api url
 * @param {string} key Api key
 * @returns {number} Number of successfully created artists profiles
 */
export async function CreateArtists(query: ArtistCreateQuery): Promise<number> {
    const supabase = createClient<Database>(query.apiUrl, query.apiKey);

    try {
        const changedArtists = query.artists.map(artist => ({
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

/**
 * Get paginated artists profiles information
 * @param {ArtistsQuery} query Query
 * @returns {ArtistProfile[]} Artists profiles
 */
export async function GetArtistsPaginated(query: ArtistsQuery): Promise<ArtistProfile[] | undefined> {
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

        const {data, error} = await finalQuery.returns<ArtistProfile[]>();
    
        if (error) {
            throw error;
        }
    
        return data;
    } catch(e) {
        console.error('Failed to get artists:', e);
        return undefined
    }
}

/**
 * Edit artists profile information
 * @param {ArtistEditQuery} query Query
 * @returns {ArtistProfile} Edited artist profile
 */
export async function EditArtist(query: ArtistEditQuery): Promise<ArtistProfile | undefined> {
    try {
        const supabase = createClient<Database>(query.apiUrl, query.apiKey);

        const {data: artistData, error: artistError} = await supabase
            .from('artists')
            .select('username, name, tags, country, images, bio, url')
            .eq('userId', query.userId)
            .returns<ArtistEditableFields>();

        if (artistError) throw artistError;

        let updatedColumns: Partial<ArtistEditQuery['edit']> = {};

        for (let key in query.edit) {
            if (query.edit[key] !== undefined) {
                if (key === 'images' && typeof query.edit[key] === 'object' && artistData.images) {
                    updatedColumns.images = {
                        ...artistData.images,
                        ...query.edit[key]  
                    };
                } else {
                    updatedColumns[key] = query.edit[key];
                }
            }
        }

        const { data, error } = await supabase
            .from("artists")
            .update(updatedColumns)
            .eq('userId', query.userId)
            .select()
            .returns<ArtistProfile>();

        if (error) throw error;

        return data;
    } catch(e) {
        console.error('Failed to edit artists:', e);
        return undefined
    }
}

/**
 * Update artists stats (followers count and tweets count)
 * @param {ArtistUpdateQuery} query Query
 * @returns {number} Number of successed artist updates
 */
export async function UpdateArtist(query: ArtistUpdateQuery): Promise<number> {
    try {
        const supabase = createClient<Database>(query.apiUrl, query.apiKey);
        
        const updatedArtists = query.artists.map((artist) => {
            return supabase
                .from('artists')
                .update({
                    followersCount: artist.followersCount,
                    tweetsCount: artist.tweetsCount
                })
                .eq('userId', artist.userId);
        });

        const results = await Promise.all(updatedArtists);
        const resultsHasErrors = results.some(result => result.error);

        if (resultsHasErrors) console.error('Error updating artists:', results.map(result => result.error));
        
        return results.length - results.map(result => result.error).length;
    } catch(e) {
        console.error('Failed to update artists:', e);
        return 0;
    }
}