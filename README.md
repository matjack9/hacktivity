HACKTIVITY
===================

**Hacktivity** is an node script to ✌hack✌ (*read: fake*) git commit history.

Hack contribution activity on GitHub based on your configuration.

How to hack your contributions on GitHub
===================================

### Create new repository on GitHub web interface

Create new repository from web interface here:
[https://github.com/new](https://github.com/new)

### Clone new repository on your local machine

```bash
$ git clone https://github.com/FooBar/repository_name.git
```

### Configure git

Configure git with **your github.com account user email** for hacked contributions to show up on your profile.

```bash
$ git config user.email "you@example.com"
```

### Customize

Feel free to edit the config constants in `index.js`.

```javascript
// config
const WEEKDAY_COMMIT_CHANCE = 0.6; // 60%
const WEEKEND_DAY_COMMIT_CHANCE = 0.3; // 30%
const MIN_COMMITS = 1;
const MAX_COMMITS = 10;
const EARLIEST_COMMIT_TIME = '09:30';
const LATEST_COMMIT_TIME = '18:00';
```

### Execute Hacktivity

**Copy** all of the contents of this repo and **execute script from your local repository folder**:

```bash
$ node .
```

Enter starting and ending dates when prompted.

### Push repository to GitHub

```bash
$ git push
```

License
=======

Copyrights (c) 2018 Matthew Jackson

[![License][license-MIT]][license-url]
Distributed under the MIT license.

If you like **hacktivity** please star!
And follow me on GitHub: [matjack9](https://github.com/TangoMan75)
... And check my other cool projects.

[license-MIT]: https://img.shields.io/badge/Licence-MIT-green.svg
[license-url]: LICENSE
