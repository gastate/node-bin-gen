# node-builder

This fork was intended to create a package that would act as a given version of Node, much as the [node package](https://www.npmjs.com/package/node) does, but using the mechanism of the [node-bin-gen package](https://www.npmjs.com/package/node-bin-gen) to eliminate the need for intermediate `node-{os}-{cpu}` packages.

Before it was finished, two things happened that made it unnecessary for the project at hand:
1. [@aridridel](https://github.com/aredridel) added the missing `node-{os}-{cpu}@{version}` combination (node-darwin-x64@6.10.3)
2. [AWS Lambda added support for Node 8.10](https://aws.amazon.com/about-aws/whats-new/2018/04/aws-lambda-supports-nodejs/)

# node-bin-gen

Generate a node binary package

# Install

```bash
$ npm install -g node-bin-gen
```

# Use

```bash
$ node-bin-gen {node,iojs} version [pre]
```

Use a `pre` version if you're testing.

# How it works

Warning: requires `npm@>=3` to install the generated packages globally!

This package generates a `node-bin` or `iojs-bin` package, and all of the `node-{os}-{cpu}` packages, which are installed by the main metapackage (and as a hack, added to the `package.json` of `node-bin` at install time as a dependency to keep npm from marking it extraneous..

# License

ISC
