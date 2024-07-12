export interface MovieDBResponse {
    dates:         Dates;
    page:          number;
    results:       Result[];
    totalPages:   number;
    totalResults: number;
}

export interface Dates {
    maximum: string;
    minimum: string;
}

export interface Result {
    adult:             boolean;
    backdrop_path:     string;
    genre_ids:         number[];
    id:                number;
    original_language: string;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    release_date:      string;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

export enum OriginalLanguage {
    En = "en",
    Es = "es",
}
