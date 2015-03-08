var prepare = require('./prepare');

module.exports = function(signaller, send) {
  return function() {
    var args = [].slice.call(arguments);

    // inject the metadata
    args.splice(1, 0, signaller.id);

    // send the message
    send(prepare(args));
  };
};
