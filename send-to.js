var prepare = require('./prepare');

module.exports = function(signaller, send) {
  function createSender(header) {
    return function() {
      var args = header.concat([].slice.call(arguments));

      // inject the signaller.id
      args.splice(3, 0, signaller.id);
      send(prepare(args));
    }
  }

  return function(targetId) {
    return {
      send: createSender(['/to', targetId]);
    };
  };
};
