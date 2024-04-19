import { TwitterUserProfile } from '../models/Fetch/TwitterUserProfile';
import { FetchUpdatedStats } from '../models/Fetch/UpdateUserProfile';
import { ArtistProfile } from '../models/ArtistProfile';
import { Database } from '../models/Database';
import { createClient } from '@supabase/supabase-js';
import { ArtistsQuery } from '../models/ArtistsQuery';
import { ArtistEditQuery, ArtistEditableFields } from '../models/ArtistEditQuery';

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

export async function GetArtistsPaginated(_query: ArtistsQuery): Promise<ArtistProfile | undefined> {
    try {
        const supabase = createClient<Database>(_query.apiUrl, _query.apiKey);

        let filter: string[] = [];

        if (_query.options?.country) filter.push(`country.eq.${_query.options.country}`);
        if (_query.options?.q) filter.push(`username.like.%${_query.options.q}%`);
        if (_query.options?.tags) {
            let tags = _query.options.tags.split('-');
            let formattedTags = `{${tags.map(tag => `"${tag.toString()}"`).join(', ')}}`;
            filter.push(`tags.cs.${formattedTags}`);
        }

        const filteredString = 'and(' + filter.join(',') + ')';

        const baseQuery = supabase
            .from('artists')
            .select()
            .limit(_query.count - 1)
            .range(_query.count * (_query.page - 1), _query.count * _query.page)
            .order(
                _query.options?.sort == "followers" 
                ? "followersCount"
                : _query.options?.sort == "username"
                ? "username"
                : _query.options?.sort == "posts"
                ? "tweetsCount"
                : "followersCount", 
                { ascending: _query.options?.sort == "username" ? true : false, nullsFirst: false });

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

export async function EditArtist(_query: ArtistEditQuery) {
    try {
        const supabase = createClient<Database>(_query.apiUrl, _query.apiKey);

        const {data: artistData, error: artistError} = await supabase
            .from('artists')
            .select('username, name, tags, country, images, bio, url')
            .eq('userId', _query.userId)
            .returns<ArtistEditableFields>();

        if (artistError) throw artistError;

        let updatedColumns: Partial<ArtistEditQuery['edit']> = {};

        for (let key in _query.edit) {
            if (_query.edit[key] !== undefined) {
                if (key === 'images' && typeof _query.edit[key] === 'object' && artistData.images) {
                    updatedColumns.images = {
                        ...artistData.images,
                        ..._query.edit[key]  
                    };
                } else {
                    updatedColumns[key] = _query.edit[key];
                }
            }
        }

        console.log(updatedColumns)
        console.log(artistData)

        const { data, error } = await supabase
            .from("artists")
            .update(updatedColumns)
            .eq('userId', _query.userId)
            .select();

        if (error) throw error;

        return data;
    } catch(e) {
        console.error('Failed to get artists:', e);
        return undefined
    }
}