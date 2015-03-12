var test = require('tape');
var outbound = [];

test('create a signaller', function(t) {
  t.plan(1);
  t.ok(signaller = require('../signaller')({}, outbound.push.bind(outbound)));
});

test('process an inbound command and validate that a message:* event is triggered', function(t) {
  t.plan(1);

  signaller.once('message:foo', function(data) {
    t.equal(data, 'bar');
  });

  signaller._process(['/to', signaller.id, '/foo', 'bar'].join('|'));
});
