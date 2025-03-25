import { BoulderHold } from "@/app/(app)/(tabs)/(boulders)/set_boulder";

export interface Boulder {
    id: number;
    name: string;
    description?: string;
    holds: BoulderHold[];
    date_set: string;  // ISO date string
    board: number;  // Foreign key ID
    setter: number;  // Foreign key ID
    first_ascentionist?: number;  // Optional Foreign key ID
    draft: boolean;
    like_count: number;
    fa_grade?: number | null | undefined;
    consensus_grade?: number | null | undefined;
    ascentionist_count: number;
}

export interface User {
    username: string;
    email: string;
    password: string;
}

export interface Board {
    id: number;
    name: string;
    description: string;
    owner: string;
    angle: number;
    city: string;
    latitude: number | null;
    longitude: number | null;
    led_quantity: number;
    image: string;
}

export interface LedConfig {
    board: number;
    hold_data: {
        led_number: number;
        relative_x: number;
        relative_y: number;
        radius: number;
    }[];
}

export interface Ascent {
    id: number;
    user: User;
    boulder: number;
    comment: string | null;
    date_time: Date;
    proposed_grade: number;
}