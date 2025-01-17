note: `kbn-alert-load` has moved!
===============================================================================

We're rebuilding it - better, stronger, faster.

For now, private, probably eventually public, at

https://github.com/elastic/kbn-alert-load


kbn-alert-load: command-line utility for doing kibana alerting load tests
===============================================================================

## usage

    kbn-alert-load <args> <options>

TBD; run `kbn-alert-load` with no parameters for help.


## install pre-reqs

- install Node.js - the current version Kibana uses
- have an account set up at https://cloud.elastic.co or equivalent
- create an API key at the cloud site for use with `ecctl`
- install `ecctl` - https://www.elastic.co/guide/en/ecctl/current/ecctl-installing.html
- create an initial config for `ecctl` with `ecctl init`, providing your API key


## install

    npm install -g pmuellr/kbn-alert-load


## run via npx without installing

    npx pmuellr/kbn-alert-load <args> <opts>


## change log

#### 2.1.0 - 2021-07-14

- updated to work with the latest ecctl v1.4.0
- changed RAM size calculation to match closest available values per region
- various other small updates
- pull request: https://github.com/pmuellr/kbn-alert-load/pull/5

#### 1.x.x - ????-??-??

- add lsd, rmd, and rmdall commands
- print existing deployments at begin and end of run command

#### 1.0.0 - 2020-10-29

- initial release
