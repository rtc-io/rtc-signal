# rtc-signal

Core rtc.io signal processing logic available for use in rtc.io signallers.


[![NPM](https://nodei.co/npm/rtc-signal.png)](https://nodei.co/npm/rtc-signal/)

[![Build Status](https://img.shields.io/travis/rtc-io/rtc-signal.svg?branch=master)](https://travis-ci.org/rtc-io/rtc-signal) 

## Reference

### prepare

```
fn(args) => String
```

Convert an array of values into a pipe-delimited string.

### process

```
fn(signaller, opts) => fn(message)
```

The core processing logic that is used to respond to incoming signaling
messages.

## `signaller(opts, bufferMessage) => mbus`

Create a base level signaller which is capable of processing
messages from an incoming source.  The signaller is capable of
sending messages outbound using the `bufferMessage` function
that is supplied to the signaller.

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

#### `send(args*)`

Prepare a message for sending, e.g.:

```js
signaller.send('/foo', 'bar');
```

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

### Signaller Internals

The following functions are designed for use by signallers that are built
on top of this base signaller.

#### `_announce()`

The internal function that constructs the `/announce` message and triggers
the `local:announce` event.

#### `_process(data)`

#### `_update`

Internal function that updates core announce attributes with
updated data.

## License(s)

### Apache 2.0

Copyright 2013 - 2015 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
