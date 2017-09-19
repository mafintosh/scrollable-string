var tape = require('tape')
var scrollable = require('./')

tape('basic', function (t) {
  var str = scrollable('foo\nbar\nbaz\n', {maxHeight: 1})

  t.same(str.toString(), 'foo\n')
  str.down()
  t.same(str.toString(), 'bar\n')
  str.down()
  t.same(str.toString(), 'baz\n')
  str.down()
  t.same(str.toString(), 'baz\n')
  str.up()
  t.same(str.toString(), 'bar\n')

  t.end()
})

tape('set', function (t) {
  var str = scrollable({maxHeight: 1})

  str.set('foo\nbar\nbaz\n')

  t.same(str.toString(), 'foo\n')
  str.down()
  t.same(str.toString(), 'bar\n')
  str.down()
  t.same(str.toString(), 'baz\n')
  str.down()
  t.same(str.toString(), 'baz\n')
  str.up()
  t.same(str.toString(), 'bar\n')

  str.set('1\n2\n')

  t.same(str.toString(), '1\n')
  str.down()
  t.same(str.toString(), '2\n')
  str.down()
  t.same(str.toString(), '2\n')
  str.down()
  t.same(str.toString(), '2\n')
  str.up()
  t.same(str.toString(), '1\n')

  t.end()
})

tape('minHeight', function (t) {
  var str = scrollable({minHeight: 5})

  str.set('foo\nbar\nbaz\n')
  t.same(str.toString(), 'foo\nbar\nbaz\n\n')

  str.set('foo\nbar\nbaz\n1\n2\n3\n4\n')
  t.same(str.toString(), 'foo\nbar\nbaz\n1\n2\n3\n4\n')
  t.end()
})
