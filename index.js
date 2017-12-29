var inherits = require('util').inherits
var os = require('os')
var EventEmitter = require('events')

inherits(Box, EventEmitter)

module.exports = Box

function Box (string, opts) {
  if (!(this instanceof Box)) return new Box(string, opts)

  EventEmitter.call(this)

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

Box.prototype.setPosition = function (pos) {
  var oldPosition = this.position
  var maxPosition = Math.max(0, this.lines.length - 1 - this.maxHeight)

  if (pos < 0) this.position = 0
  else if (pos > maxPosition) this.position = maxPosition
  else this.position = pos

  var moved = this.position !== oldPosition
  if (moved) this.emit('update')
  return moved
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

Box.prototype.pct = function () {
  var bottomEdge = this.position + this.maxHeight
  var lines = this.lines.length - 1
  return Math.min(1, bottomEdge / lines)
}

Box.prototype.moveToTop =
Box.prototype.top = function () {
  return this.setPosition(0)
}

Box.prototype.moveToBottom =
Box.prototype.bottom = function () {
  return this.setPosition(Infinity)
}

Box.prototype.move = function (inc) {
  return this.setPosition(this.position + inc)
}

Box.prototype.up = function () {
  return this.setPosition(this.position - 1)
}

Box.prototype.down = function () {
  return this.setPosition(this.position + 1)
}

Box.prototype.set = function (string) {
  if (!/\n$/.test(string)) string += os.EOL
  this.string = string
  this.lines = string.split(os.EOL)
  var moved = this.setPosition(this.position)
  if (!moved) this.emit('update')
  return true
}

Box.prototype.height = function () {
  var lines = this.lines.length - 1
  var remainingLines = lines - this.position

  if (remainingLines < this.minHeight) return this.minHeight
  if (remainingLines > this.maxHeight) return this.maxHeight
  return remainingLines
}

Box.prototype.resize = function (opts) {
  var oldHeight = this.height()
  if (opts.height) opts.minHeight = opts.maxHeight = opts.height
  this.maxHeight = opts.maxHeight || this.maxHeight
  this.minHeight = opts.minHeight || this.minHeight
  var moved = this.setPosition(this.position)
  if (moved) return true
  var changed = oldHeight !== this.height()
  if (changed) this.emit('update')
  return changed
}

Box.prototype.toString =
Box.prototype.render = function () {
  var needsNewline = this.position + this.maxHeight < this.lines.length
  var lines = this.lines.slice(this.position, this.position + this.maxHeight)

  while (lines.length <= this.minHeight) {
    needsNewline = false
    lines.push('')
  }

  return lines.join(os.EOL) + (needsNewline ? os.EOL : '')
}
