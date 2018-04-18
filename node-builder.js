#!/usr/bin/env node
"use strict"

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

function installArchSpecificPackage(version, require) {

  process.env.npm_config_global = 'false';

  var platform = process.platform == 'win32' ? 'win' : process.platform;
  var arch = platform == 'win' && process.arch == 'ia32' ? 'x86' : process.arch;

  var cp = spawn(platform == 'win' ? 'npm.cmd' : 'npm', ['install', '--no-save', ['node', platform, arch].join('-') + '@' + version], {
    stdio: 'inherit',
    shell: true
  });

  cp.on('close', function(code) {
    var pkgJson = require.resolve(['node', platform, arch].join('-') + '/package.json');
    var subpkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
    var executable = subpkg.bin.node;
    var bin = path.resolve(path.dirname(pkgJson), executable);

    try {
      fs.mkdirSync(path.resolve(process.cwd(), 'bin'));
    } catch (e) {
      if (e.code != 'EEXIST') {
        throw e;
      }
    }

    linkSync(bin, path.resolve(process.cwd(), executable));

    if (platform == 'win') {
      var pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));
      fs.writeFileSync(path.resolve(process.cwd(), 'bin/node'), 'This file intentionally left blank');
      pkg.bin.node = 'bin/node.exe';
      fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2));
    }

    return process.exit(code);

  });
}

function linkSync(src, dest) {
  try {
    fs.unlinkSync(dest);
  } catch (e) {
    if (e.code != 'ENOENT') {
      throw e;
    }
  }
  return fs.linkSync(src, dest);
}

module.exports = installArchSpecificPackage;

class NodeBuilder {
	static async main( args ) {
		const fn = "NodeBuilder.main";

		if( !args ) {
			console.error( fn + ": Missing Arguments" );
			return 1;
		} else {
			const yargs = require("yargs")( args.slice(2) );
			yargs.version();
			yargs.demandCommand( 1, 2, "You must specify version, and optionally a prerelease" );
			yargs.help("help").wrap(76);
			if( !yargs.argv._[0] ) {
				console.warn( "Use: " + yargs.$0 + " version [pre]" )
				return 1;
			} else {
				const argversion = yargs.argv._[0];
				const version = (argversion[0] == "v") ? argversion.slice(1) : argversion;
				const vversion = "v" + version;
				console.log( "Node.js "+version );
				console.log( "Attempting to install " + this.package + "@" + version );
				// TODO: ... left off here
				return 0;
			}
		}
	}

	static get platform() { return process.platform == "win32" ? "win" : process.platform; }
	static get arch()     { return this.platform == "win" && process.arch == "ia32" ? "x86" : process.arch; }
	static get package()  { return [ "node", this.platform, this.arch ].join( "-" ); }

}

if( !module.parent ) {
	NodeBuilder.main( process.argv ).then( ret => {
		process.exit( ret );
	} ).catch( err => {
		console.error( err );
		process.exit( 1 );
	} );
}
