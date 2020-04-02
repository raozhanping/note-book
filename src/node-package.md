# package.json

## name
- The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
- The name can't start with a dot or an underscore.
- New packages must not have uppercase letters in the name.
- The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

## version

## description

## keywords

## homepage

## bugs

```json
{
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

## license

## author, contributors

```json
{
  "name" : "Barney Rubble",
  "email" : "b@rubble.com",
  "url" : "http://barnyrubble.tumblr.com/"
}

// shorten
"Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
```

## files
`files > .npmignore > .gitignore`  

### always included files
- package.json
- README
- CHANGES / CHANGELOG /HISTORY
- LICENSE / LICENCE
- NOTICE
- The file in the "main" field

## always ignored files
- .git
- CVS
- .svn
- .hg
- .lock-wscript
- .wafpickle-N
- .*.swp
- .DS_Store
- ._*
- npm-debug.log
- .npmrc
- node_modules
- config.gypi
- *.orig
- package-lock.json (use shrinkwrap instead)

## main

## browser

## bin

```json
{ "bin" : { "myapp" : "./cli.js" } }
```

If you have a single executable, and its name should be the name of the package, then you can just supply it as a string  

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}
```
would be the same as this:  
```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin" : { "my-program" : "./path/to/program" }
  }
```

## man
> Specify either a single file or an array of filenames to put in place for the man program to find

## directories
### directories.lib
### directories.bin
### directories.man
### directories.doc
### directories.example
### directories.test

## repository
```json
"repository": {
  "type" : "git",
  "url" : "https://github.com/npm/cli.git"
}

"repository": {
  "type" : "svn",
  "url" : "https://v8.googlecode.com/svn/trunk/"
}

"repository": {
  "type" : "git",
  "url" : "https://github.com/facebook/react.git",
  "directory": "packages/react-dom"
}
```

shortcut syntax  
```js
"repository": "npm/npm"

"repository": "github:user/repo"

"repository": "gist:11081aaa281"

"repository": "bitbucket:user/repo"

"repository": "gitlab:user/repo"
```

## scripts

## config

## dependencies

## devDependencies

## peerDependencies

## bundledDependencies

## optionalDependencies

## engines
```json
{
  "engines" : { "node" : ">=0.10.3 <0.12" }
  }
```

## engineStrict
`This feature was removed in npm 3.0.0`  

## os
` process.platform`  

```json
// white list
"os" : [ "darwin", "linux" ]

// black list
"os" : [ "!win32" ]
```

## cpu
` process.arch`  

## preferGlobal
`DEPRECATED`

## private

## publishConfig
