declare module '@hitomihiumi/2048-game';

export class Game {
    constructor()
    startGame(): Promise<NodeJS.ArrayBufferView>;
    move(direction: string): object;
    reset(): this;
    setUser(userid: string): this;
    setColors(colors: object): this;
    setSize(size: number): this;
    setLineThickness(thickness: number): this;
    setFilled(filled: boolean): this;
    setFont(font: object): this;
    setGlobalOffset(offset: number): this;
    setOffsets(offsets: object): this;
    importData(data: object): this;
    exportData(): object;
    step(): number;
    score(): number;
    userId(): string;
}