Benchpress benchmarks for using AngularJS with immutable data.

This repository contains a performance benchpress scripts, of using Immutable.js data structure vs standard arrays in AngularJS application.

The script is inspired by this [blog post](http://blog.mgechev.com/2015/03/02/immutability-in-angularjs-immutablejs/).

You can run it by:

```javascript
mkdir log && mkdir charts
npm install # node-canvas may create troubles
# customize the collection sizes and bindings count at ./benchmarks/benchmarks.spec.js
# otherwise the script execution will take a while...
./node_modules/.bin/protractor protractor.conf.js
node logs-parser.js
```

After running the script inside `./charts` you should have exhaustive list of line charts, representing the benchmarks.

# License

MIT
