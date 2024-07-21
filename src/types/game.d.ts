import { Font } from "@hitomihiumi/lazy-canvas";

export interface LazyGame {
    userId: string | null;
    size: number;
    _tiles: Array<number[]>;
    _score: number;
    _steps: number;
    _step: number;

    tilescolors: { [key: string]: string };
    lineThickness: number;
    filled: boolean;
    font: Font;
    globaloffset: { x: number, y: number };
    offsets: { [key: string]: { x: number, y: number } };
}