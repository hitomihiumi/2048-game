import { LazyCanvas, TextLayer, EllipseLayer, RectangleLayer } from "@hitomihiumi/lazy-canvas";

export async function renderGame(game: any) {

    let canvasSize = game.data.size * 75;

    //console.log(game)

    var canvas = new LazyCanvas()
        .createNewCanvas(canvasSize, canvasSize)

    let tilePadding = canvasSize / 100;

    let tileSize = canvasSize / game.data.size;

    for (let y = 0; y < game.data.size; y++) {

        for (let x = 0; x < game.data.size; x++) {

            let tileValue = game.tiles()[y][x];

            canvas.addLayers(
                new EllipseLayer()
                    .setColor('#191919')
                    .setX(x * tileSize + tilePadding)
                    .setY(y * tileSize + tilePadding)
                    .setWidth(tileSize - 2 * tilePadding)
                    .setHeight(tileSize - 2 * tilePadding)
                    .setRadius(10)
                    .setCentering('legacy')
            )

            if (tileValue !== 0) {

                let text = new TextLayer()
                    .setX(x * tileSize + tileSize / 2 + game.data.globaloffset.x + getOffset(game, tileValue).x)
                    .setY(y * tileSize + tileSize / 2 + 1 + game.data.globaloffset.y + getOffset(game, tileValue).y)
                    .setText(String(tileValue))
                    .setFontSize(getTileTextFontSize(tileValue, tileSize))
                    .setAlign('center')
                    .setBaseline('middle')
                    .setColor(getColor(game, tileValue))

                if (game.data.font) {
                    canvas.loadFonts(game.data.font)

                    text.setFont(game.data.font.toJSON().family)
                        .setWeight(game.data.font.toJSON().weight)
                }

                canvas.addLayers(
                    new EllipseLayer()
                        .setX(x * tileSize + tilePadding + 0.5)
                        .setY(y * tileSize + tilePadding + 0.5)
                        .setWidth(tileSize - 2 * tilePadding - 1)
                        .setHeight(tileSize - 2 * tilePadding - 1)
                        .setRadius(8)
                        .setColor(getColor(game, tileValue))
                        .setFilled(game.data.filled)
                        .setStroke(game.data.lineThickness)
                        .setCentering('legacy'),
                    text
                )
            }
        }
    }
    return await canvas.renderImage();
}

var getColor = function (game: any, color: number) {
    if (game.data.filled === true) {
        return game.data.tilescolors['0']
    } else {
        return game.data.tilescolors[String(color)]
    }
}

var getOffset = function (game: any, tileValue: number) {
    return game.data.offsets[String(tileValue)]
}

var getTileTextFontSize = function (tileValue: number, tileSize: number) {
    let fontSize = 0.83 * tileSize;
    if (tileValue > 0) {
        fontSize -= (Math.floor(Math.log10(tileValue)) + 1) * 10;
    }
    return fontSize;
};