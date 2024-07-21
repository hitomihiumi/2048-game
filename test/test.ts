import { Game, LazyGame } from '../dist'
import * as fs from 'fs'
import { Font } from '@hitomihiumi/lazy-canvas'

let game = new Game()
    .setUser('13123123123')
    .setFont(
        new Font()
            .setFamily('Koulen')
            .setWeight('regular')
            .setPath('./fonts/Koulen-Regular.ttf')
    )

async function main() {
    await game.startGame()

    let arr = ['up', 'left', 'right', 'down', 'up', "left"]

    for (let i = 0; i < 5; i++) {
        //@ts-ignore
        let data  = await game.move(arr[i])
        console.log(data[0])
        if (data[1] !== undefined) {
            const pngData = data[1]
            //@ts-ignore
            fs.writeFileSync(`output${i}.png`, pngData)
        }
    }
}

main()