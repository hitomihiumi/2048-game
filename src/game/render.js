'use strict';

const { LazyCanvas, TextLayer, EllipseLayer } = require("@hitomihiumi/lazy-canvas");

async function renderGame(game) {

    let canvasSize = game.data.size * 75;

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

                if (game.data.font !== null) {
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
                        .setFilled(this.data.filled)
                        .setStroke(this.data.lineThickness),
                    text
                )
            }
        }
    }
    return await canvas.renderImage();
}

var getColor = function (game, color) {
    if (game.data.filled === true) {
        return game.data.tilescolors['0']
    } else {
        return game.data.tilescolors[String(color)]
    }
}

var getOffset = function (game, tileValue) {
    return game.data.offsets[String(tileValue)]
}

var getTileTextFontSize = function (tileValue, tileSize) {
    let fontSize = 0.83 * tileSize;
    if (tileValue > 0) {
        fontSize -= (Math.floor(Math.log10(tileValue)) + 1) * 10;
    }
    return fontSize;
};

module.exports.renderGame = renderGame