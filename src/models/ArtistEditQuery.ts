export interface ArtistEditQuery {
    userId: string,
    edit: {
        username?: string,
        name?: string,
        tags?: string[],
        country?: string, 
        images?: {
            avatar?: string,
            banner?: string
        },
        bio?: string,
        url?: string,
        [key: string]: 
            string 
            | { avatar?: string, banner?: string} 
            | string[]
            | undefined,
    },
    apiUrl: string,
    apiKey: string
}

export interface ArtistEditableFields {
    username: string,
    name: string,
    tags: string,
    country: string, 
    images: {
        avatar: string,
        banner: string
    },
    bio: string,
    url: string,
}