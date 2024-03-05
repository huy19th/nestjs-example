export interface LogInResponse {
    accessToken: string;
}

export interface AccessTokenPayload {
    _id: string;
    key: string;
}

export interface CachedTokens {
    [refreshToken: string]: string;
}