// types/music.ts
export type Note = {
    id: number;
    pitch: string;
    staffPosition: number;
    ledger: boolean;
    x: number;
    measure: number;
    duration: string;
    beats: number;
}

export type StaffPosition = {
    note: string;
    position: number;
    ledger?: boolean;
}

export type DurationInfo = {
    beats: number;
    symbol: string;
    name: string;
    toneNotation: string;
}

export type StaffConfig = {
    topMargin: number;
    lineSpacing: number;
    staffHeight: number;
    measureWidth: number;
    leftMargin: number;
    measures: number;
}