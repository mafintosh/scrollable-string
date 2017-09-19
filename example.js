var box = require('./')
var input = require('neat-input')()
var diff = require('ansi-diff-stream')()

diff.pipe(process.stdout)

var lines = generateLines()
var s = box(lines, {maxHeight: height()})

process.stdout.on('resize', function () {
  s.resize({maxHeight: height()})
  diff.clear()
  render()
})

input.on('up', function () {
  s.up()
  render()
})

input.on('down', function () {
  s.down()
  render()
})

render()

function height () {
  return Math.max(0, process.stdout.rows - 5)
}

function render () {
  var output = s.toString()

  output =
    (s.atTop() ? '(at top)' : '(up arrow to scroll up)') + '\n' +
    output +
    (s.atBottom() ? '(at bottom)' : '(down arrow to scroll down)')

  diff.write(output)
}

function generateLines () {
  return Array(50).join('\n').split('\n').map((_, i) => 'line #' + i).join('\n')
}
