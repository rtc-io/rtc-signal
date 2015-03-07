function prepareArg(arg) {
  if (typeof arg == 'object' && (! (arg instanceof String))) {
    return JSON.stringify(arg);
  }
  else if (typeof arg == 'function') {
    return null;
  }

  return arg;
}

module.exports = function(args) {
  return args.map(prepareArg).join('|');
};
