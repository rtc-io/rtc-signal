
[![NPM](https://nodei.co/npm/rtc-signal.png)](https://nodei.co/npm/rtc-signal/)



### `rtc-signal/prepare(args) => String`

Convert an array of values into a pipe-delimited string.

### `rtc-signal/process(signaller, opts) => fn(message)`

The core processing logic that is used to respond to incoming signaling
messages.

#### announce

```
/announce|%metadata%|{"id": "...", ... }
```

When an announce message is received by the signaller, the attached
object data is decoded and the signaller emits an `announce` message.

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
