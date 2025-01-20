export interface Boulder {
    id: number;
    name: string;
    description?: string;
    date_set: string;  // ISO date string
    board: number;  // Foreign key ID
    setter: number;  // Foreign key ID
    first_ascentionist?: number;  // Optional Foreign key ID
    draft: boolean;
    rating: 1 | 2 | 3 | 4 | 5;
    fa_grade?: number | null | undefined;
    consensus_grade?: number | null | undefined;
    ascentionist_count: number;
}

export interface User {
    username: String;
    email: String;
    password: String;
}