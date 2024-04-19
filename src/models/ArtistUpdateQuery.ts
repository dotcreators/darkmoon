export interface ArtistUpdateQuery {
    artists: ArtistStats[],
    apiUrl: string,
    apiKey: string
}

export interface ArtistStats {
    userId: string,
    followersCount: number,
    tweetsCount: number,
}