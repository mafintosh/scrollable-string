# scrollable-string

Generate a diff friendly string that is bounded by a configurable scroll box.

```
npm install scrollable-string
```

[![Build Status](https://travis-ci.org/mafintosh/scrollable-string.svg?branch=master)](https://travis-ci.org/mafintosh/scrollable-string)

Made for usage with [ansi-diff-stream](https://github.com/mafintosh/ansi-diff-stream) and friends

## Usage

``` js
var scrollable = require('scrollable-string')

var multiLineString = `
  foo
  bar
  baz
`

var str = scrollable(multiLineString, {
  maxHeight: 2 // max 32 rows high
})

console.log(str.toString()) // prints foo\nbar\n
str.down()
console.log(str.toString()) // prints bar\nbaz\n
str.down()
console.log(str.toString()) // still prints bar\nbaz\n
```

## API

#### `var str = scrollable(string, [options])`

Create a new scrollable string. Options include:

``` js
{
  maxHeight: 32, // max rows height
  minHeight: 0 // min height (will pad the input string)
}
```

#### `str.up()`

Move the view-port up.

#### `str.down()`

Move the view-port down.

#### `str.move(inc)`

Move the view-port up or down, i.e `str.move(-5)` to move 5 lines up.

#### `str.bottom()`

Move to bottom.

#### `str.top()`

Move to top.

#### `str.toString()`

Returns the string rendered by the view-port.

#### `var bool = str.atBottom()`

Check if the view-port is at the bottom.

#### `var bool = str.atTop()`

Check if the view-port is at the top.

#### `var bool = str.scrollable()`

Check if the view-port is not at the top or bottom.

## License

MIT
