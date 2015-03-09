var test = require('tape');
var outbound = [];
var signaller;

test('create a signaller', function(t) {
  t.plan(1);
  t.ok(signaller = require('../signaller')({}, outbound.push.bind(outbound)));
});

test('announce first peer', function(t) {
  t.plan(2);
  signaller.once('peer:announce', function(data) {
    t.equal(data.id, 1);
  });

  signaller._process('/announce|1|' + JSON.stringify({ id: 1, room: 'foo' }));
  t.ok(signaller.peers.get(1), 'registered peer');
});

test('the signaller has replied with the expected response', function(t) {
  var message = outbound.shift() || '';

  t.plan(2);
  t.ok(message, 'got message');
  t.deepEqual(message.split('|').slice(0, 4), ['/to', '1', '/announce', signaller.id], 'matched expected');
});

test('announce second peer', function(t) {
  t.plan(2);
  signaller.once('peer:announce', function(data) {
    t.equal(data.id, 2);
  });

  signaller._process('/announce|2|' + JSON.stringify({ id: 2, room: 'foo' }));
  t.ok(signaller.peers.get(2), 'registered peer');
});

test('the signaller has replied with the expected response', function(t) {
  var message = outbound.shift() || '';

  t.plan(2);
  t.ok(message, 'got message');
  t.deepEqual(message.split('|').slice(0, 4), ['/to', '2', '/announce', signaller.id], 'matched expected');
});
