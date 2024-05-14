# Introduction

This is a simple logic and rendering module for the game 2048, it is mainly intended for users of discord.js etc. The module uses `@hitomihiumi/lazy-canvas` to render the image.

## Get Started

1. Install the module by using `npm i @hitomihiumi/2048-game`
2. Enjoy!

## Documentation

### Game - class

Initialize class to create a new game.

```js
const { Game } = require('@hitomihiumi/2048-game');

const game = new Game()
```
### Methods - functions

#### setUser()
```js
game.setUser('1111111111')
```
Used just for identify game, not used in module

#### setSize()
```js
game.setSize(6)
```

Set the size of the game board. The default value is 4.

#### startGame()
```js
await game.startGame(); 
```
Returns canvas buffer. You can use this buffer in AttachmentBuilder (for discord.js), or save it to file by 'fs'.

#### move()
```js
await game.move('up'); // Move the tiles up
await game.move('down'); // Move the tiles down
await game.move('left'); // Move the tiles left
await game.move('right'); // Move the tiles right
```

Returns object with 'status' and 'canvas' properties.
'status' is a string, 'canvas' is a canvas buffer.
'status' can be 'gameover', 'nochange' or 'move'.

<table>
    <tr>
        <td>Status</td>
        <td>Meaning</td>
    </tr>
    <tr>
        <td>gameover</td>
        <td>The end of the game, use 'startGame()' to start a new one</td>
    </tr>
    <tr>
        <td>nochange</td>
        <td>Status in which it is impossible to move to the selected side</td>
    </tr>
    <tr>
        <td>move</td>
        <td>A move in the chosen direction has been made</td>
    </tr>
</table>

#### reset()

```js
game.reset();
```

Resets the game, use 'startGame()' to start a new one.

#### step()

```js
game.step();
```

Returns the number of steps taken in the game.

#### score()

```js
game.score();
```

Returns the current score in the game.

#### userId()

```js
game.userId();
```

Returns the user id.

#### exportData()

```js
game.exportData();
```

Returns the game data in JSON format.

#### importData()

```js
game.importData(data);
```

Imports the game data in JSON format.

### Customization

You can customize the game by changing the following properties:

#### setColors()

```js
game.setColors({
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
});
```

Set the colors of the tiles. '0' is the background color.

#### setFont()

```js
const { Font } = require('@hitomihiumi/lazy-canvas');

game.setFont(
    new Font()
    .setFamily('Koulen')
    .setWeight('regular')
    .setPath('./fonts/Koulen-Regular.ttf')
);
```

Set the font of the text. Use `@hitomihiumi/lazy-canvas` to create a new font.

#### setOffsets()

```js
game.setOffsets({
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
});
```

Sets the x- and y-axis offsets for the numbers individually. If you need to set the offset for all digits at once, use `setGlobalOffset()`.

#### setGlobalOffset()

```js
game.setGlobalOffset({ x: 0, y: 0 });
```

Sets the x- and y-axis offsets for all numbers at once.

#### setLineThickness()

```js
game.setLineThickness(5);
```

Sets the thickness of the cell number stroke line. The default value is 4.

#### setFilled()

```js
game.setFilled(true);
```

Sets whether the cell number is filled or not. The default value is true.