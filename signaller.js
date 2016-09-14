var detect = require('rtc-core/detect');
var extend = require('cog/extend');
var getable = require('cog/getable');
var cuid = require('cuid');
var mbus = require('mbus');
var prepare = require('./prepare');

/**
  ## `signaller(opts, bufferMessage) => mbus`

  Create a base level signaller which is capable of processing
  messages from an incoming source.  The signaller is capable of
  sending messages outbound using the `bufferMessage` function
  that is supplied to the signaller.

**/
module.exports = function(opts, bufferMessage) {
  // get the autoreply setting
  var autoreply = (opts || {}).autoreply;

  // create the signaller mbus
  var signaller = mbus('', (opts || {}).logger);

  // initialise the peers
  var peers = signaller.peers = getable({});

  // initialise the signaller attributes
  var attributes = signaller.attributes = {
    browser: detect.browser,
    browserVersion: detect.browserVersion,
    agent: 'unknown'
  };

  function createToMessage(header) {
    return function() {
      var args = header.concat([].slice.call(arguments));

      // inject the signaller.id
      args.splice(3, 0, signaller.id);
      bufferMessage(prepare(args));
    }
  }

  // initialise the signaller id
  signaller.id = (opts || {}).id || cuid();

  /**
    #### `isMaster(targetId) => Boolean`

    A simple function that indicates whether the local signaller is the master
    for it's relationship with peer signaller indicated by `targetId`.  Roles
    are determined at the point at which signalling peers discover each other,
    and are simply worked out by whichever peer has the lowest signaller id
    when lexigraphically sorted.

    For example, if we have two signaller peers that have discovered each
    others with the following ids:

    - `b11f4fd0-feb5-447c-80c8-c51d8c3cced2`
    - `8a07f82e-49a5-4b9b-a02e-43d911382be6`

    They would be assigned roles:

    - `b11f4fd0-feb5-447c-80c8-c51d8c3cced2`
    - `8a07f82e-49a5-4b9b-a02e-43d911382be6` (master)

  **/
  signaller.isMaster = function(targetId) {
    var peer = peers.get(targetId);

    return peer && peer.roleIdx !== 0;
  };

  /**
    #### `send(args*)`

    Prepare a message for sending, e.g.:

    ```js
    signaller.send('/foo', 'bar');
    ```

  **/
  signaller.send = function() {
    var args = [].slice.call(arguments);

    // inject the metadata
    args.splice(1, 0, signaller.id);

    // send the message
    bufferMessage(prepare(args));
  };


  /**
    #### `to(targetId)`

    Use the `to` function to send a message to the specified target peer.
    A large parge of negotiating a WebRTC peer connection involves direct
    communication between two parties which must be done by the signalling
    server.  The `to` function provides a simple way to provide a logical
    communication channel between the two parties:

    ```js
    var send = signaller.to('e95fa05b-9062-45c6-bfa2-5055bf6625f4').send;

    // create an offer on a local peer connection
    pc.createOffer(
      function(desc) {
        // set the local description using the offer sdp
        // if this occurs successfully send this to our peer
        pc.setLocalDescription(
          desc,
          function() {
            send('/sdp', desc);
          },
          handleFail
        );
      },
      handleFail
    );
    ```

  **/
  signaller.to = function(targetId) {
    return {
      send: createToMessage(['/to', targetId])
    };
  };

  /**
    ### Signaller Internals

    The following functions are designed for use by signallers that are built
    on top of this base signaller.
  **/

  /**
    #### `_announce()`

    The internal function that constructs the `/announce` message and triggers
    the `local:announce` event.

  **/
  signaller._announce = function() {
    signaller.send('/announce', attributes);
    signaller('local:announce', attributes);
  };

  /**
    #### `_leave()`

    The internal function that should be called when a peer gracefully leaves
    the call. This will send a `/leave` message to the other peer indicating that
    this peer connection should be closed

  **/
  signaller._leave = function() {
    signaller.send('/leave', { id: signaller.id });
  };

  /**
    #### `_process(data)`


  **/
  signaller._process = require('./process')(signaller);

  /**
    #### `_update`

    Internal function that updates core announce attributes with
    updated data.

**/
  signaller._update = function(data) {
    extend(attributes, data, { id: signaller.id });
  };

  // set the autoreply flag
  signaller.autoreply = autoreply === undefined || autoreply;

  return signaller;
};
