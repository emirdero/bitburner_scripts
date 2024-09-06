### bitburner_scripts

A collection of scripts written for the open-source game [bitburner](https://github.com/bitburner-official/bitburner-src).

This repo is inspired by a similar repo by Jrpl: https://github.com/Jrpl/Bitburner-Scripts

## worm.js

Searches through all servers and tries to gain root access on those that do not have root access. Run this when you create or buy a new port opening hack.

## hacknet-upgrader.js

Purchases hacknet nodes and upgrades based on what provides the best return on investment (roi)

Takes one argument:

- `maxNodes`: The maximum number of nodes you want to purchase and upgrade.

## buy-servers.js

Purchases the number of servers passed in.

Takes one argument:

- `numServers`: The number of servers you would like to purchase.

### status-ram.js

Lists all purchased servers and their max ram available

Recommended alias: alias sr="run status-ram.js"

### upgrade-servers.js

Upgrades the ram on your purchased servers whenever you can afford to

## pwn.js

Preps a target for batch hacks, then executes HWGW (Hack Weaken Grow Weaken) hack batches in quick succession.

Takes one argument:

- `target`: The server you wish to attack

## prep.js

Preps a target for batch hacks. If no target is provided it will try to prep all the targets it can.

Takes one optional argument:

- `target`: The server you wish to attack

## boot.js

A simple beginner hack-manager that is meant for early-game hacking where availabe ram is limited.

Takes one argument:

- `target`: The server you wish to attack

### targeted-{hack / grow / weaken}.js

Used by exec in pwn.js, boot.js and prep.js to hack/grow/weaken a specific target

Takes three arguments:

- `threads`: number of threads available
- `delay`: time to sleep before initiating hack
- `target`: the target for the hack

## status-servers.js

Shows the current status of all hackable servers sorted by most max-money

Recommended alias: alias st="run status-servers.js"

##

## utils.js

Contains various utility functions used throughout the other scripts.

### multiscan

A recursive function which finds all available servers starting from the server passed in.\
Takes two arguments:

- `ns`: The Netscript package.
- `server`: Name of the server you want to start from when scanning.

If `home` is passed as the value for `server`, then it will return all available servers in the current bitnode.

### gainRootAccess

Attempts to gain root access of the server passed in.\
Takes two arguments:

- `ns`: The Netscript package.
- `server`: Name of the server you want to attempt to gain root access to.
