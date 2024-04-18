export interface ArtistsQuery {
    page: number,
    count: 25 | number,
    options?: {
        q?: string,
        tags?: string,
        country?: string,
        sort?: string 
    },
    apiUrl: string,
    apiKey: string
}