var os = require('os')

module.exports = Box

function Box (string, opts) {
  if (!(this instanceof Box)) return new Box(string, opts)
  if (typeof string !== 'string' && !opts) {
    opts = string
    string = ''
  }
  if (!opts) opts = {}
  if (opts.height) opts.minHeight = opts.maxHeight = opts.height

  this.minHeight = opts.minHeight || 0
  this.maxHeight = opts.maxHeight || 32
  this.position = 0
  this.set(string || opts.string || '')
}

Box.prototype.scrollable = function () {
  return !this.atTop() || !this.atBottom()
}

Box.prototype.atTop = function () {
  return this.position === 0
}

Box.prototype.atBottom = function () {
  var lines = this.lines.length - 1
  return lines - this.position <= this.maxHeight
}

Box.prototype.top = function () {
  this.position = 0
  return this._check()
}

Box.prototype.bottom = function () {
  this.position = Infinity
  return this._check()
}

Box.prototype.move = function (inc) {
  this.position += inc
  return this._check()
}

Box.prototype.up = function () {
  this.position--
  return this._check()
}

Box.prototype.down = function () {
  this.position++
  return this._check()
}

Box.prototype._check = function () {
  if (this.position < 0) {
    this.position = 0
    return false
  }
  if (this.atBottom()) {
    this.position = Math.max(0, this.lines.length - 1 - this.maxHeight)
    return false
  }
  return true
}

Box.prototype.set = function (string) {
  if (!/\n$/.test(string)) string += os.EOL
  this.string = string
  this.lines = string.split('\n')
  this.position = 0
}

Box.prototype.resize = function (opts) {
  if (opts.height) opts.minHeight = opts.maxHeight = opts.height
  this.maxHeight = opts.maxHeight || this.maxHeight
  this.minHeight = opts.minHeight || this.minHeight
  return this._check()
}

Box.prototype.toString =
Box.prototype.render = function () {
  var needsNewline = this.position + this.maxHeight < this.lines.length
  var lines = this.lines.slice(this.position, this.position + this.maxHeight)

  while (lines.length <= this.minHeight) {
    needsNewline = false
    lines.push('')
  }

  return lines.join('\n') + (needsNewline ? os.EOL : '')
}
