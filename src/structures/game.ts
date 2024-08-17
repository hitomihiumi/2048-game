import { renderGame } from './render';
import { Font } from "@hitomihiumi/lazy-canvas";
import { LazyGame } from '../types/game'

/**
 * @example
 * import { Game } from '@hitomihiumi/2048-game'
 * import * as fs from 'fs'
 * import { Font } from '@hitomihiumi/lazy-canvas'
 *
 * let game = new Game()
 *     .setUser('13123123123')
 *     .setFont(
 *         new Font()
 *             .setFamily('Koulen')
 *             .setWeight('regular')
 *             .setPath('./fonts/Koulen-Regular.ttf')
 *     )
 *
 * async function main() {
 *     await game.startGame()
 *
 *     let arr = ['up', 'left', 'right', 'down', 'up', "left"]
 *
 *     for (let i = 0; i < 5; i++) {
 *         //@ts-ignore
 *         let data  = await game.move(arr[i])
 *         if (data[1] !== undefined) {
 *             const pngData = data[1]
 *             //@ts-ignore
 *             fs.writeFileSync(`output${i}.png`, pngData)
 *         }
 *     }
 * }
 *
 * main()
 */
export class Game {
    data: LazyGame;

    constructor(data?: LazyGame) {
        this.data = data ? { ...data } : {} as LazyGame

        this.data.userId ??= null;
        this.data.size ??= 4;
        this.data._score ??= 0;
        this.data._step ??= 0
        this.data.tilescolors ??= {
            '0': '#191919',
            '2': '#A151DD',
            '4': '#A045BF',
            '8': '#9F39A1',
            '16': '#9E2D83',
            '32': '#9D2165',
            '64': '#9C1547',
            '128': '#A71D42',
            '256': '#BD3854',
            '512': '#D35366',
            '1024': '#E96E78',
            '2048': '#FF8A8A',
        };
        this.data.lineThickness ??= 4;
        this.data.filled ??= false;
        this.data.globaloffset ??= { x: 0, y: 0 };
        this.data.offsets ??= {
            '2': { x: 0, y: 0 },
            '4': { x: 0, y: 0 },
            '8': { x: 0, y: 0 },
            '16': { x: 0, y: 0 },
            '32': { x: 0, y: 0 },
            '64': { x: 0, y: 0 },
            '128': { x: 0, y: 0 },
            '256': { x: 0, y: 0 },
            '512': { x: 0, y: 0 },
            '1024': { x: 0, y: 0 },
            '2048': { x: 0, y: 0 },
        }
    }

    renderGame = renderGame

    setColors(colors: { [key: string]: string; }) {
        this.data.tilescolors = colors;
        return this;
    }

    setSize(size: number) {
        this.data.size = size;
        return this;
    }

    setUser(userid: string) {
        this.data.userId = userid;
        return this;
    }

    setLineThickness(thickness: number) {
        this.data.lineThickness = thickness;
        return this;
    }

    setFilled(filled: boolean) {
        this.data.filled = filled;
        return this;
    }

    setFont(font: Font) {
        this.data.font = font;
        return this;
    }

    setGlobalOffset(offset: { x: number, y: number }) {
        this.data.globaloffset = offset;
        return this;
    }

    setOffsets(offsets: { [key: string]: { x: number, y: number } }) {
        if (typeof offsets !== 'object') throw new Error('\'offsets\' can be only object!')
        this.data.offsets = offsets;
        return this;
    }

    importData(data: LazyGame) {
        if (typeof data !== 'object') throw new Error('\'data\' can be only object!')

        let newData = { ...data }

        if (data.tilescolors === undefined) newData.tilescolors = this.data.tilescolors;
        if (data.lineThickness === undefined) newData.lineThickness = this.data.lineThickness;
        if (data.filled === undefined) newData.filled = this.data.filled;
        if (data.font === undefined) newData.font = this.data.font;
        else if (data.font instanceof Font) newData.font = data.font;
        else { // @ts-ignore
            newData.font = new Font().setFamily(data.font.family).setWeight(data.font.weight).setPath(data.font.path);
        }
        if (data.globaloffset === undefined) newData.globaloffset = this.data.globaloffset;
        if (data.offsets === undefined) newData.offsets = this.data.offsets;

        this.data = newData
        return this;
    }

    exportData() {
        return { ...this.data };
    }

    userId() {
        return this.data.userId;
    }

    tiles() {
        return this.data._tiles;
    };

    score() {
        return this.data._score;
    };

    step() {
        return this.data._step;
    };

    async startGame() {
        //console.log(renderGame)
        //console.log(this.renderGame)

        if (this.data.size === undefined) this.data.size = 4;
        if (this.data._score === undefined) this.data._score = 0;
        if (this.data._step === undefined) this.data._step = 0

        if (this.data._tiles === null || this.data._tiles === undefined) {
            this.data._tiles = []

            for (let y = 0; y < this.data.size; y++) {

                let row = [];

                for (let x = 0; x < this.data.size; x++) {
                    row.push(0);
                }

                this.data._tiles.push(row);
            }

            this.reset();
        }

        return await this.gameUpdate('start')
    }

    async move(direction: 'up' | 'down' | 'left' | 'right') {

        let vec;

        switch (direction) {
            case 'up':
                vec = [0, -1];
                break;
            case 'down':
                vec = [0, 1];
                break;
            case 'left':
                vec = [-1, 0];
                break;
            case 'right':
                vec = [1, 0];
                break;
        }

        if (!this.canMove(vec)) return this.gameUpdate('nochange');

        let tilesCombinedTo = [];
        let xRange = this.getImportantRange(vec[0]);
        let yRange = this.getImportantRange(vec[1]);

        for (let y = yRange[0]; y >= yRange[1] && y <= yRange[2]; y += yRange[3]) {

            for (let x = xRange[0]; x >= xRange[1] && x <= xRange[2]; x += xRange[3]) {

                let tile = this.data._tiles[y][x];

                if (tile === 0) continue;

                let adjY = y;
                let adjX = x;

                while (adjY + vec[1] >= 0 &&
                adjY + vec[1] < this.data.size &&
                adjX + vec[0] >= 0 &&
                adjX + vec[0] < this.data.size &&
                this.data._tiles[adjY + vec[1]][adjX + vec[0]] === 0) {
                    adjY += vec[1];
                    adjX += vec[0];
                }

                if (adjY !== y || adjX !== x) {
                    this.data._tiles[adjY][adjX] = tile;
                    this.data._tiles[y][x] = 0;
                }

                if (adjY + vec[1] >= 0 &&
                    adjY + vec[1] < this.data.size &&
                    adjX + vec[0] >= 0 &&
                    adjX + vec[0] < this.data.size &&
                    this.data._tiles[adjY + vec[1]][adjX + vec[0]] === tile) {

                    let tileAlreadyCombinedTo = false;

                    for (let _i = 0, tilesCombinedTo_1 = tilesCombinedTo; _i < tilesCombinedTo_1.length; _i++) {

                        let combinedTile = tilesCombinedTo_1[_i];

                        if (combinedTile[0] === adjX + vec[0] &&
                            combinedTile[1] === adjY + vec[1]) {

                            tileAlreadyCombinedTo = true;
                            break;

                        }
                    }
                    if (!tileAlreadyCombinedTo) {

                        this.data._tiles[adjY + vec[1]][adjX + vec[0]] += tile;
                        this.data._score += this.data._tiles[adjY + vec[1]][adjX + vec[0]];
                        this.data._tiles[adjY][adjX] = 0;
                        tilesCombinedTo.push([adjX + vec[0], adjY + vec[1]]);

                    }
                }
            }
        }

        this.data._step += 1
        this.spawnRandomTile();

        for (let a = 0; a < this.data._tiles.length; a++) {
            for (let b = 0; b < this.data._tiles[a].length; b++) {
                if (this.data._tiles[a][b] === 2048) {
                    return await this.gameUpdate('win');
                }
            }
        }

        if (this.isGameOver())
            return await this.gameUpdate('gameover');
        return await  this.gameUpdate('move');
    };

    async gameUpdate(status: 'start' | 'win' | 'nochange' | 'gameover' | 'move') {
        let canvas = await this.renderGame(this)

        switch (status) {
            case 'start':
                return [ 'start', canvas ]
            case 'win':
                return [ 'win', canvas ]
            case 'nochange':
                return [ 'nochange', canvas ]
            case 'gameover':
                return [ 'gameover', canvas ]
            case 'move':
                return [ 'move', canvas ]
        }
    }

    isGameOver() {
        return (!this.canMove([0, -1]) &&
            !this.canMove([0, 1]) &&
            !this.canMove([-1, 0]) &&
            !this.canMove([1, 0]));
    };

    /**
     * Gets the important range of tiles to consider when checking movements in canMove.
     * @returns [initial, min, max, step]
     */

    getImportantRange(direction: number) {
        if (direction < 0)
            return [1, 1, this.data.size - 1, 1];
        else if (direction > 0)
            return [this.data.size - 2, 0, this.data.size - 2, -1];
        return [this.data.size - 1, 0, this.data.size - 1, -1];
    };

    /**
     * @returns true iff it is possible to move in the given direction
     */

    canMove(vec: number[]) {

        let xRange = this.getImportantRange(vec[0]);
        let yRange = this.getImportantRange(vec[1]);

        for (let y = yRange[0]; y >= yRange[1] && y <= yRange[2]; y += yRange[3]) {

            for (let x = xRange[0]; x >= xRange[1] && x <= xRange[2]; x += xRange[3]) {

                let tile = this.data._tiles[y][x];

                if (tile === 0)
                    continue;

                let neighborTile = this.data._tiles[y + vec[1]][x + vec[0]];

                if (neighborTile === tile || neighborTile === 0) {
                    return true;
                }
            }
        }
        return false;
    };

    spawnRandomTile() {

        let y, x;

        do {
            y = (Math.random() * this.data.size) | 0;
            x = (Math.random() * this.data.size) | 0;
        } while (this.data._tiles[y][x] !== 0);

        this.data._tiles[y][x] = Math.random() < 0.9 ? 2 : 4;
    };

    reset() {

        for (let y = 0; y < this.data.size; y++) {

            for (let x = 0; x < this.data.size; x++) {

                this.data._tiles[y][x] = 0;

            }
        }

        this.spawnRandomTile();
        this.spawnRandomTile();
    };
}
