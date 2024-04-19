export interface ArtistUpdateQuery {
    artists: ArtistStats[],
    apiUrl: string,
    apiKey: string
}

interface ArtistStats {
    userId: string,
    followersCount: number,
    tweetsCount: number,
}