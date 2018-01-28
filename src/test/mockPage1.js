var mockPage1Result = [
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18294",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18294/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18294/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18294/events",
      "html_url": "https://github.com/nodejs/node/issues/18294",
      "id": 290545935,
      "number": 18294,
      "title": "missing end event in streams",
      "user": {
        "login": "AndreasMadsen",
        "id": 505333,
        "avatar_url": "https://avatars0.githubusercontent.com/u/505333?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/AndreasMadsen",
        "html_url": "https://github.com/AndreasMadsen",
        "followers_url": "https://api.github.com/users/AndreasMadsen/followers",
        "following_url": "https://api.github.com/users/AndreasMadsen/following{/other_user}",
        "gists_url": "https://api.github.com/users/AndreasMadsen/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/AndreasMadsen/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/AndreasMadsen/subscriptions",
        "organizations_url": "https://api.github.com/users/AndreasMadsen/orgs",
        "repos_url": "https://api.github.com/users/AndreasMadsen/repos",
        "events_url": "https://api.github.com/users/AndreasMadsen/events{/privacy}",
        "received_events_url": "https://api.github.com/users/AndreasMadsen/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435883,
          "url": "https://api.github.com/repos/nodejs/node/labels/stream",
          "name": "stream",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": {
        "login": "mcollina",
        "id": 52195,
        "avatar_url": "https://avatars0.githubusercontent.com/u/52195?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/mcollina",
        "html_url": "https://github.com/mcollina",
        "followers_url": "https://api.github.com/users/mcollina/followers",
        "following_url": "https://api.github.com/users/mcollina/following{/other_user}",
        "gists_url": "https://api.github.com/users/mcollina/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/mcollina/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/mcollina/subscriptions",
        "organizations_url": "https://api.github.com/users/mcollina/orgs",
        "repos_url": "https://api.github.com/users/mcollina/repos",
        "events_url": "https://api.github.com/users/mcollina/events{/privacy}",
        "received_events_url": "https://api.github.com/users/mcollina/received_events",
        "type": "User",
        "site_admin": false
      },
      "assignees": [
        {
          "login": "mcollina",
          "id": 52195,
          "avatar_url": "https://avatars0.githubusercontent.com/u/52195?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/mcollina",
          "html_url": "https://github.com/mcollina",
          "followers_url": "https://api.github.com/users/mcollina/followers",
          "following_url": "https://api.github.com/users/mcollina/following{/other_user}",
          "gists_url": "https://api.github.com/users/mcollina/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/mcollina/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/mcollina/subscriptions",
          "organizations_url": "https://api.github.com/users/mcollina/orgs",
          "repos_url": "https://api.github.com/users/mcollina/repos",
          "events_url": "https://api.github.com/users/mcollina/events{/privacy}",
          "received_events_url": "https://api.github.com/users/mcollina/received_events",
          "type": "User",
          "site_admin": false
        }
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-22T17:16:50Z",
      "updated_at": "2018-01-22T17:17:03Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "body": "* **Version**: master (e7ff00d0c52ad7deefe8be4a6a293d15fd3fca7b)\r\n* **Platform**: All\r\n* **Subsystem**: stream\r\n\r\nhttps://github.com/nodejs/node/commit/1e0f3315c77033ef0e01bb37c3d41c8e1d65e686 introduced an issue where the `end` event isn't emitted.\r\n\r\nThe following test case can reproduce it:\r\n\r\n```js\r\n'use strict'\r\n\r\nconst stream = require('stream')\r\n\r\nclass ReadableArray extends stream.Readable {\r\n  constructor(data) {\r\n    super({ objectMode: true })\r\n    this._data = data\r\n  }\r\n\r\n  _read (size) {\r\n    if (this._data.length === 0) return this.push(null);\r\n    this.push(this._data.shift());\r\n  }\r\n}\r\n\r\nclass PassThroughAsWrapper extends stream.Readable {\r\n  constructor (readable) {\r\n    super({ objectMode: true })\r\n\r\n    this._readable = readable\r\n    this._readable.once('end', () => this.push(null))\r\n  }\r\n\r\n  _read (size) {\r\n    const data = this._readable.read()\r\n    if (data === null) {\r\n      this._readable.once('readable', () => {\r\n        const data = this._readable.read() // this reads null, but somehow the end event is not emitted\r\n        if (data !== null) return this.push(data)\r\n        // end event handler will call .push()\r\n      })\r\n    } else {\r\n      return this.push(data)\r\n    }\r\n  }\r\n}\r\n\r\nconst inputData = [{}, {}]\r\nconst readable = new ReadableArray(inputData)\r\n\r\nlet endEvent = false\r\nconst result = new PassThroughAsWrapper(\r\n  readable.pipe(new stream.PassThrough({ objectMode: true }))\r\n)\r\nresult.once('end', function () { endEvent = true; console.log('end event'); })\r\nresult.resume()\r\n\r\nprocess.on('exit', function () {\r\n  if (!endEvent) console.log('no end event')\r\n})\r\n```\r\n\r\nThe expected result is `end event` the actual result is `no end event`.\r\n\r\n/cc @mcollina @mafintosh "
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18292",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18292/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18292/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18292/events",
      "html_url": "https://github.com/nodejs/node/pull/18292",
      "id": 290539432,
      "number": 18292,
      "title": "win, build: fix intl-none option",
      "user": {
        "login": "poiru",
        "id": 1319028,
        "avatar_url": "https://avatars2.githubusercontent.com/u/1319028?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/poiru",
        "html_url": "https://github.com/poiru",
        "followers_url": "https://api.github.com/users/poiru/followers",
        "following_url": "https://api.github.com/users/poiru/following{/other_user}",
        "gists_url": "https://api.github.com/users/poiru/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/poiru/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/poiru/subscriptions",
        "organizations_url": "https://api.github.com/users/poiru/orgs",
        "repos_url": "https://api.github.com/users/poiru/repos",
        "events_url": "https://api.github.com/users/poiru/events{/privacy}",
        "received_events_url": "https://api.github.com/users/poiru/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 171787391,
          "url": "https://api.github.com/repos/nodejs/node/labels/build",
          "name": "build",
          "color": "eb6420",
          "default": false
        },
        {
          "id": 166236401,
          "url": "https://api.github.com/repos/nodejs/node/labels/windows",
          "name": "windows",
          "color": "9944dd",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-22T16:58:10Z",
      "updated_at": "2018-01-22T16:58:13Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18292",
        "html_url": "https://github.com/nodejs/node/pull/18292",
        "diff_url": "https://github.com/nodejs/node/pull/18292.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18292.patch"
      },
      "body": "Like #17614, but for the `intl-none` option.\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n\r\nbuild"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18291",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18291/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18291/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18291/events",
      "html_url": "https://github.com/nodejs/node/pull/18291",
      "id": 290532989,
      "number": 18291,
      "title": "domain, src: clean up domain-related code",
      "user": {
        "login": "apapirovski",
        "id": 20809,
        "avatar_url": "https://avatars2.githubusercontent.com/u/20809?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/apapirovski",
        "html_url": "https://github.com/apapirovski",
        "followers_url": "https://api.github.com/users/apapirovski/followers",
        "following_url": "https://api.github.com/users/apapirovski/following{/other_user}",
        "gists_url": "https://api.github.com/users/apapirovski/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/apapirovski/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/apapirovski/subscriptions",
        "organizations_url": "https://api.github.com/users/apapirovski/orgs",
        "repos_url": "https://api.github.com/users/apapirovski/repos",
        "events_url": "https://api.github.com/users/apapirovski/events{/privacy}",
        "received_events_url": "https://api.github.com/users/apapirovski/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267502,
          "url": "https://api.github.com/repos/nodejs/node/labels/C++",
          "name": "C++",
          "color": "e11d21",
          "default": false
        },
        {
          "id": 281232761,
          "url": "https://api.github.com/repos/nodejs/node/labels/lib%20/%20src",
          "name": "lib / src",
          "color": "fad8c7",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 3,
      "created_at": "2018-01-22T16:40:26Z",
      "updated_at": "2018-01-22T18:28:40Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18291",
        "html_url": "https://github.com/nodejs/node/pull/18291",
        "diff_url": "https://github.com/nodejs/node/pull/18291.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18291.patch"
      },
      "body": "Move the majority of C++ domain-related code into JS land by introducing a top level domain callback which handles entering & exiting the domain.\r\n\r\nMove the rest of the domain necessities into their own file that creates an internal binding, to avoid exposing domain-related code on the process object.\r\n\r\nAlso a bit of other assorted domain-related cleanup.\r\n\r\n(This happens to boost the performance of top-level domain code by roughly 33% but mostly I just wanted to have less domain-related code scattered all over.)\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ndomain, src"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18290",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18290/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18290/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18290/events",
      "html_url": "https://github.com/nodejs/node/pull/18290",
      "id": 290499742,
      "number": 18290,
      "title": "[v9.x] async_hooks: use typed array stack as fast path",
      "user": {
        "login": "addaleax",
        "id": 899444,
        "avatar_url": "https://avatars2.githubusercontent.com/u/899444?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/addaleax",
        "html_url": "https://github.com/addaleax",
        "followers_url": "https://api.github.com/users/addaleax/followers",
        "following_url": "https://api.github.com/users/addaleax/following{/other_user}",
        "gists_url": "https://api.github.com/users/addaleax/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/addaleax/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/addaleax/subscriptions",
        "organizations_url": "https://api.github.com/users/addaleax/orgs",
        "repos_url": "https://api.github.com/users/addaleax/repos",
        "events_url": "https://api.github.com/users/addaleax/events{/privacy}",
        "received_events_url": "https://api.github.com/users/addaleax/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267502,
          "url": "https://api.github.com/repos/nodejs/node/labels/C++",
          "name": "C++",
          "color": "e11d21",
          "default": false
        },
        {
          "id": 281232761,
          "url": "https://api.github.com/repos/nodejs/node/labels/lib%20/%20src",
          "name": "lib / src",
          "color": "fad8c7",
          "default": false
        },
        {
          "id": 651415590,
          "url": "https://api.github.com/repos/nodejs/node/labels/v9.x",
          "name": "v9.x",
          "color": "0e8a16",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-22T15:13:26Z",
      "updated_at": "2018-01-22T15:13:29Z",
      "closed_at": null,
      "author_association": "OWNER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18290",
        "html_url": "https://github.com/nodejs/node/pull/18290",
        "diff_url": "https://github.com/nodejs/node/pull/18290.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18290.patch"
      },
      "body": "Backport https://github.com/nodejs/node/pull/17780 to v9.x\r\n\r\nCI: https://ci.nodejs.org/job/node-test-commit/15582/\r\n\r\n@evanlucas "
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18289",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18289/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18289/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18289/events",
      "html_url": "https://github.com/nodejs/node/pull/18289",
      "id": 290462061,
      "number": 18289,
      "title": "doc: improve http.request documentation",
      "user": {
        "login": "Zarel",
        "id": 551184,
        "avatar_url": "https://avatars3.githubusercontent.com/u/551184?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Zarel",
        "html_url": "https://github.com/Zarel",
        "followers_url": "https://api.github.com/users/Zarel/followers",
        "following_url": "https://api.github.com/users/Zarel/following{/other_user}",
        "gists_url": "https://api.github.com/users/Zarel/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Zarel/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Zarel/subscriptions",
        "organizations_url": "https://api.github.com/users/Zarel/orgs",
        "repos_url": "https://api.github.com/users/Zarel/repos",
        "events_url": "https://api.github.com/users/Zarel/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Zarel/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267517,
          "url": "https://api.github.com/repos/nodejs/node/labels/doc",
          "name": "doc",
          "color": "006b75",
          "default": false
        },
        {
          "id": 155267422,
          "url": "https://api.github.com/repos/nodejs/node/labels/http",
          "name": "http",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-22T13:17:34Z",
      "updated_at": "2018-01-22T15:33:08Z",
      "closed_at": null,
      "author_association": "NONE",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18289",
        "html_url": "https://github.com/nodejs/node/pull/18289",
        "diff_url": "https://github.com/nodejs/node/pull/18289.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18289.patch"
      },
      "body": "This pull request adds some more specific documentation about how `http.request` works, which is very useful for someone who wants to know how to handle error conditions correctly.\r\n\r\nI kind of don't think this will be accepted _exactly_ as phrased, but this is a starting point.\r\n\r\n##### Checklist\r\n\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n\r\nn/a"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18288",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18288/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18288/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18288/events",
      "html_url": "https://github.com/nodejs/node/issues/18288",
      "id": 290369348,
      "number": 18288,
      "title": "Feature request: url.join(baseUrl, ...others)",
      "user": {
        "login": "XGHeaven",
        "id": 9291212,
        "avatar_url": "https://avatars2.githubusercontent.com/u/9291212?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/XGHeaven",
        "html_url": "https://github.com/XGHeaven",
        "followers_url": "https://api.github.com/users/XGHeaven/followers",
        "following_url": "https://api.github.com/users/XGHeaven/following{/other_user}",
        "gists_url": "https://api.github.com/users/XGHeaven/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/XGHeaven/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/XGHeaven/subscriptions",
        "organizations_url": "https://api.github.com/users/XGHeaven/orgs",
        "repos_url": "https://api.github.com/users/XGHeaven/repos",
        "events_url": "https://api.github.com/users/XGHeaven/events{/privacy}",
        "received_events_url": "https://api.github.com/users/XGHeaven/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 151728679,
          "url": "https://api.github.com/repos/nodejs/node/labels/question",
          "name": "question",
          "color": "cc317c",
          "default": true
        },
        {
          "id": 155435992,
          "url": "https://api.github.com/repos/nodejs/node/labels/url",
          "name": "url",
          "color": "bfe5bf",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 3,
      "created_at": "2018-01-22T07:10:35Z",
      "updated_at": "2018-01-22T09:05:39Z",
      "closed_at": null,
      "author_association": "NONE",
      "body": "<!--\r\nThank you for reporting an issue.\r\n\r\nThis issue tracker is for bugs and issues found within Node.js core.\r\nIf you require more general support please file an issue on our help\r\nrepo. https://github.com/nodejs/help\r\n\r\n\r\nPlease fill in as much of the template below as you're able.\r\n\r\nVersion: output of `node -v`\r\nPlatform: output of `uname -a` (UNIX), or version and 32 or 64-bit (Windows)\r\nSubsystem: if known, please specify affected core module name\r\n\r\nIf possible, please provide code that demonstrates the problem, keeping it as\r\nsimple and free of external dependencies as you are able.\r\n-->\r\n\r\n* **Version**: v9.4.0\r\n* **Platform**: Darwin\r\n* **Subsystem**: url\r\n\r\n<!-- Enter your issue details below this comment. -->\r\n\r\nI want to join url href just like path.join, examples\r\n\r\n```js\r\nurl.join('http://nodejs.org', 'dist', 'download') === 'http://nodejs.org/dist/download'\r\nurl.join('http://nodejs.org/dist', 'download') === 'http://nodejs.org/dist/download'\r\nurl.resolve('http://nodejs.org/dist', 'download') === 'http://nodejs.org/download'\r\nurl.join('http://nodejs.org/dist/', '/download') === 'http://nodejs.org/dist/download'\r\nurl.join('http://nodejs.org/dist', 'http://mirror.nodejs.org/dist') === 'http://mirror.nodejs.org/dist'\r\n\r\n// without protocol prefix, just like path.join\r\nurl.join('nodejs.org', 'dist', 'download') === path.join('nodejs.org', 'dist', 'download') === 'nodejs.org/dist/download'\r\n```\r\n\r\nWhat do you think about this?"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18287",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18287/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18287/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18287/events",
      "html_url": "https://github.com/nodejs/node/pull/18287",
      "id": 290346577,
      "number": 18287,
      "title": "Revert \"build,test: make building addon tests less fragile\" - broken source tarballs",
      "user": {
        "login": "rvagg",
        "id": 495647,
        "avatar_url": "https://avatars2.githubusercontent.com/u/495647?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/rvagg",
        "html_url": "https://github.com/rvagg",
        "followers_url": "https://api.github.com/users/rvagg/followers",
        "following_url": "https://api.github.com/users/rvagg/following{/other_user}",
        "gists_url": "https://api.github.com/users/rvagg/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/rvagg/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/rvagg/subscriptions",
        "organizations_url": "https://api.github.com/users/rvagg/orgs",
        "repos_url": "https://api.github.com/users/rvagg/repos",
        "events_url": "https://api.github.com/users/rvagg/events{/privacy}",
        "received_events_url": "https://api.github.com/users/rvagg/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 171787391,
          "url": "https://api.github.com/repos/nodejs/node/labels/build",
          "name": "build",
          "color": "eb6420",
          "default": false
        },
        {
          "id": 746808418,
          "url": "https://api.github.com/repos/nodejs/node/labels/fast-track",
          "name": "fast-track",
          "color": "a989e5",
          "default": false
        },
        {
          "id": 191447057,
          "url": "https://api.github.com/repos/nodejs/node/labels/meta",
          "name": "meta",
          "color": "fef2c0",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-22T04:17:04Z",
      "updated_at": "2018-01-22T15:28:13Z",
      "closed_at": null,
      "author_association": "OWNER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18287",
        "html_url": "https://github.com/nodejs/node/pull/18287",
        "diff_url": "https://github.com/nodejs/node/pull/18287.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18287.patch"
      },
      "body": "@bnoordhuis this is yours, it was landed in between the last two nightlies. [Current one](https://nodejs.org/download/nightly/v10.0.0-nightly201801218803b69c72/) is broken, [previous one](https://nodejs.org/download/nightly/v10.0.0-nightly20180120e1c29f2c52/) (commit e9c6dcd) is fine.\r\n\r\n```\r\nmake: *** No rule to make target 'deps/uv/test/benchmark-async-pummel.c', needed by 'out/Release/node'.  Stop.\r\n```\r\n\r\nSimulate this in the full source tree with `rm -rf deps/uv/test/` prior to `make` and you'll get the error. It's because we `$(RM) -r $(TARNAME)/deps/uv/{docs,samples,test}` for the source tarball but we've introduced a dependency on test/* and basically everything else that gets built thanks to the new .deps functionality introduced in gyp.\r\n\r\nNot sure what the way forward is here, I understand what the change is intending to do, but it doesn't work for distributable source now. Do you want to come up with a solution or should we revert while you take some time with it?"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18284",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18284/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18284/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18284/events",
      "html_url": "https://github.com/nodejs/node/issues/18284",
      "id": 290305166,
      "number": 18284,
      "title": "MaxListenersExceededWarning in repl",
      "user": {
        "login": "maximelkin",
        "id": 18092308,
        "avatar_url": "https://avatars0.githubusercontent.com/u/18092308?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/maximelkin",
        "html_url": "https://github.com/maximelkin",
        "followers_url": "https://api.github.com/users/maximelkin/followers",
        "following_url": "https://api.github.com/users/maximelkin/following{/other_user}",
        "gists_url": "https://api.github.com/users/maximelkin/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/maximelkin/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/maximelkin/subscriptions",
        "organizations_url": "https://api.github.com/users/maximelkin/orgs",
        "repos_url": "https://api.github.com/users/maximelkin/repos",
        "events_url": "https://api.github.com/users/maximelkin/events{/privacy}",
        "received_events_url": "https://api.github.com/users/maximelkin/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435784,
          "url": "https://api.github.com/repos/nodejs/node/labels/events",
          "name": "events",
          "color": "bfdadc",
          "default": false
        },
        {
          "id": 155435882,
          "url": "https://api.github.com/repos/nodejs/node/labels/repl",
          "name": "repl",
          "color": "5319e7",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-21T20:59:05Z",
      "updated_at": "2018-01-21T21:56:11Z",
      "closed_at": null,
      "author_association": "NONE",
      "body": "* **Version**: v9.4.0\r\n* **Platform**:Linux morsic 4.14.13-1-ARCH #1 SMP PREEMPT Wed Jan 10 11:14:50 UTC 2018 x86_64 GNU/Linux\r\n* **Subsystem**: repl\r\n\r\n```\r\n$ node\r\n> async function test() {\r\n... await Promise.resolve()<many tab clicks>\r\n```\r\n\r\ncauses \r\n```\r\n(node:9133) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 Runtime.executionContextCreated listeners added. Use emitter.setMaxListeners() to increase limit\r\n```"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18283",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18283/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18283/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18283/events",
      "html_url": "https://github.com/nodejs/node/pull/18283",
      "id": 290288968,
      "number": 18283,
      "title": "doc: `readable.push()` supports `undefined` in non-object mode",
      "user": {
        "login": "MoonBall",
        "id": 13298548,
        "avatar_url": "https://avatars1.githubusercontent.com/u/13298548?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/MoonBall",
        "html_url": "https://github.com/MoonBall",
        "followers_url": "https://api.github.com/users/MoonBall/followers",
        "following_url": "https://api.github.com/users/MoonBall/following{/other_user}",
        "gists_url": "https://api.github.com/users/MoonBall/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/MoonBall/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/MoonBall/subscriptions",
        "organizations_url": "https://api.github.com/users/MoonBall/orgs",
        "repos_url": "https://api.github.com/users/MoonBall/repos",
        "events_url": "https://api.github.com/users/MoonBall/events{/privacy}",
        "received_events_url": "https://api.github.com/users/MoonBall/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267517,
          "url": "https://api.github.com/repos/nodejs/node/labels/doc",
          "name": "doc",
          "color": "006b75",
          "default": false
        },
        {
          "id": 155435883,
          "url": "https://api.github.com/repos/nodejs/node/labels/stream",
          "name": "stream",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-21T17:16:32Z",
      "updated_at": "2018-01-22T16:50:26Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18283",
        "html_url": "https://github.com/nodejs/node/pull/18283",
        "diff_url": "https://github.com/nodejs/node/pull/18283.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18283.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\nI found that the readable stream that isn't in object mode supports `undefined` [long ago](https://github.com/nodejs/node/commit/7764b84297432ffb3535a9fe26ec386b315d499d#diff-ba6a0df0f5212f5cba5ca5179e209a17L270), and it's original idea is to [express EOF](https://github.com/nodejs/node/commit/7764b84297432ffb3535a9fe26ec386b315d499d#diff-ba6a0df0f5212f5cba5ca5179e209a17L288). Now it is just treated as a empty string or buffer. But the doc and [code](https://github.com/nodejs/node/blob/master/lib/_stream_readable.js#L292) aren't clear for it **although it is not important**.\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ndoc, stream"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18282",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18282/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18282/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18282/events",
      "html_url": "https://github.com/nodejs/node/pull/18282",
      "id": 290287604,
      "number": 18282,
      "title": "test: adds tests for vm invalid arguments",
      "user": {
        "login": "gillesdemey",
        "id": 868844,
        "avatar_url": "https://avatars1.githubusercontent.com/u/868844?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/gillesdemey",
        "html_url": "https://github.com/gillesdemey",
        "followers_url": "https://api.github.com/users/gillesdemey/followers",
        "following_url": "https://api.github.com/users/gillesdemey/following{/other_user}",
        "gists_url": "https://api.github.com/users/gillesdemey/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/gillesdemey/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/gillesdemey/subscriptions",
        "organizations_url": "https://api.github.com/users/gillesdemey/orgs",
        "repos_url": "https://api.github.com/users/gillesdemey/repos",
        "events_url": "https://api.github.com/users/gillesdemey/events{/privacy}",
        "received_events_url": "https://api.github.com/users/gillesdemey/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-21T16:57:53Z",
      "updated_at": "2018-01-22T15:33:47Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18282",
        "html_url": "https://github.com/nodejs/node/pull/18282",
        "diff_url": "https://github.com/nodejs/node/pull/18282.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18282.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nvm"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18281",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18281/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18281/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18281/events",
      "html_url": "https://github.com/nodejs/node/pull/18281",
      "id": 290284758,
      "number": 18281,
      "title": "url: expose the WHATWG URL API globally",
      "user": {
        "login": "targos",
        "id": 2352663,
        "avatar_url": "https://avatars0.githubusercontent.com/u/2352663?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/targos",
        "html_url": "https://github.com/targos",
        "followers_url": "https://api.github.com/users/targos/followers",
        "following_url": "https://api.github.com/users/targos/following{/other_user}",
        "gists_url": "https://api.github.com/users/targos/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/targos/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/targos/subscriptions",
        "organizations_url": "https://api.github.com/users/targos/orgs",
        "repos_url": "https://api.github.com/users/targos/repos",
        "events_url": "https://api.github.com/users/targos/events{/privacy}",
        "received_events_url": "https://api.github.com/users/targos/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 169485514,
          "url": "https://api.github.com/repos/nodejs/node/labels/semver-major",
          "name": "semver-major",
          "color": "fbca04",
          "default": false
        },
        {
          "id": 512071972,
          "url": "https://api.github.com/repos/nodejs/node/labels/url-whatwg",
          "name": "url-whatwg",
          "color": "c2e0c6",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 7,
      "created_at": "2018-01-21T16:18:02Z",
      "updated_at": "2018-01-22T16:32:01Z",
      "closed_at": null,
      "author_association": "OWNER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18281",
        "html_url": "https://github.com/nodejs/node/pull/18281",
        "diff_url": "https://github.com/nodejs/node/pull/18281.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18281.patch"
      },
      "body": "Install `URL` and `URLSearchParams` on the global object, like they can be\r\nfound in browser environments.\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nurl\r\n\r\n/cc @nodejs/tsc @nodejs/url @jasnell \r\n\r\n~Quick CI: https://ci.nodejs.org/job/node-test-pull-request-lite/106/~\r\nQuick CI: https://ci.nodejs.org/job/node-test-pull-request-lite/107/"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18278",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18278/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18278/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18278/events",
      "html_url": "https://github.com/nodejs/node/pull/18278",
      "id": 290256895,
      "number": 18278,
      "title": "stream: delete unused code",
      "user": {
        "login": "MoonBall",
        "id": 13298548,
        "avatar_url": "https://avatars1.githubusercontent.com/u/13298548?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/MoonBall",
        "html_url": "https://github.com/MoonBall",
        "followers_url": "https://api.github.com/users/MoonBall/followers",
        "following_url": "https://api.github.com/users/MoonBall/following{/other_user}",
        "gists_url": "https://api.github.com/users/MoonBall/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/MoonBall/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/MoonBall/subscriptions",
        "organizations_url": "https://api.github.com/users/MoonBall/orgs",
        "repos_url": "https://api.github.com/users/MoonBall/repos",
        "events_url": "https://api.github.com/users/MoonBall/events{/privacy}",
        "received_events_url": "https://api.github.com/users/MoonBall/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435883,
          "url": "https://api.github.com/repos/nodejs/node/labels/stream",
          "name": "stream",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-21T08:42:06Z",
      "updated_at": "2018-01-22T15:43:04Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18278",
        "html_url": "https://github.com/nodejs/node/pull/18278",
        "diff_url": "https://github.com/nodejs/node/pull/18278.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18278.patch"
      },
      "body": "In implementation of `stream.Writable`, `writable._write()` is always called with a callback that is `_writableState.onwrite()`. And In `afterTransform()`, `ts.writechunk` and `ts.writecb` are assigned to null.  So, `ts.writecb` is a true value if `ts.writechunk` isn't null.\r\n\r\nFrom the view of `stream.Writable`, only `ts.writecb` can inform it about the end of writing chunk to the underlying. So a callback is essential to call `writable._write()`. So, `ts.writecb` is a true value if `ts.writechunk` isn't null.\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nstream"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18277",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18277/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18277/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18277/events",
      "html_url": "https://github.com/nodejs/node/pull/18277",
      "id": 290253467,
      "number": 18277,
      "title": "test: improve fs error message test",
      "user": {
        "login": "joyeecheung",
        "id": 4299420,
        "avatar_url": "https://avatars0.githubusercontent.com/u/4299420?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/joyeecheung",
        "html_url": "https://github.com/joyeecheung",
        "followers_url": "https://api.github.com/users/joyeecheung/followers",
        "following_url": "https://api.github.com/users/joyeecheung/following{/other_user}",
        "gists_url": "https://api.github.com/users/joyeecheung/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/joyeecheung/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/joyeecheung/subscriptions",
        "organizations_url": "https://api.github.com/users/joyeecheung/orgs",
        "repos_url": "https://api.github.com/users/joyeecheung/repos",
        "events_url": "https://api.github.com/users/joyeecheung/events{/privacy}",
        "received_events_url": "https://api.github.com/users/joyeecheung/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 2,
      "created_at": "2018-01-21T07:30:48Z",
      "updated_at": "2018-01-22T15:31:48Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18277",
        "html_url": "https://github.com/nodejs/node/pull/18277",
        "diff_url": "https://github.com/nodejs/node/pull/18277.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18277.patch"
      },
      "body": "In preparation for more fs error migrations..\r\n\r\n- Reuse error validators for sync and async tests\r\n- Validate properties of the errors\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ntest, fs"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18276",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18276/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18276/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18276/events",
      "html_url": "https://github.com/nodejs/node/pull/18276",
      "id": 290250363,
      "number": 18276,
      "title": "fs: use AliasedBuffer for fs_stats_field_array",
      "user": {
        "login": "joyeecheung",
        "id": 4299420,
        "avatar_url": "https://avatars0.githubusercontent.com/u/4299420?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/joyeecheung",
        "html_url": "https://github.com/joyeecheung",
        "followers_url": "https://api.github.com/users/joyeecheung/followers",
        "following_url": "https://api.github.com/users/joyeecheung/following{/other_user}",
        "gists_url": "https://api.github.com/users/joyeecheung/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/joyeecheung/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/joyeecheung/subscriptions",
        "organizations_url": "https://api.github.com/users/joyeecheung/orgs",
        "repos_url": "https://api.github.com/users/joyeecheung/repos",
        "events_url": "https://api.github.com/users/joyeecheung/events{/privacy}",
        "received_events_url": "https://api.github.com/users/joyeecheung/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267502,
          "url": "https://api.github.com/repos/nodejs/node/labels/C++",
          "name": "C++",
          "color": "e11d21",
          "default": false
        },
        {
          "id": 281232761,
          "url": "https://api.github.com/repos/nodejs/node/labels/lib%20/%20src",
          "name": "lib / src",
          "color": "fad8c7",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-21T06:18:19Z",
      "updated_at": "2018-01-22T15:44:04Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18276",
        "html_url": "https://github.com/nodejs/node/pull/18276",
        "diff_url": "https://github.com/nodejs/node/pull/18276.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18276.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nfs"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18274",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18274/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18274/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18274/events",
      "html_url": "https://github.com/nodejs/node/issues/18274",
      "id": 290222973,
      "number": 18274,
      "title": "Delete file after createWriteStream raises no error when stream.write('whatever')",
      "user": {
        "login": "vladblindu",
        "id": 8209918,
        "avatar_url": "https://avatars3.githubusercontent.com/u/8209918?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/vladblindu",
        "html_url": "https://github.com/vladblindu",
        "followers_url": "https://api.github.com/users/vladblindu/followers",
        "following_url": "https://api.github.com/users/vladblindu/following{/other_user}",
        "gists_url": "https://api.github.com/users/vladblindu/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/vladblindu/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/vladblindu/subscriptions",
        "organizations_url": "https://api.github.com/users/vladblindu/orgs",
        "repos_url": "https://api.github.com/users/vladblindu/repos",
        "events_url": "https://api.github.com/users/vladblindu/events{/privacy}",
        "received_events_url": "https://api.github.com/users/vladblindu/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435785,
          "url": "https://api.github.com/repos/nodejs/node/labels/fs",
          "name": "fs",
          "color": "0052cc",
          "default": false
        },
        {
          "id": 151728679,
          "url": "https://api.github.com/repos/nodejs/node/labels/question",
          "name": "question",
          "color": "cc317c",
          "default": true
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-20T21:00:56Z",
      "updated_at": "2018-01-20T23:17:52Z",
      "closed_at": null,
      "author_association": "NONE",
      "body": "I'm on a mac, Node v8.6.0.\r\nBriefly, if I do this in mocha :\r\n```\r\nimport  fs from 'fs-extra'\r\n\r\nconst stream = fse.createWriteStream(\r\n                path.normalize('./myfile.txt'),\r\n                {flags: 'a', encoding: 'utf8', mode: 0o0666}\r\n            )\r\nstream.on('error', err => {\r\n    // this is never called\r\n    console.log(err)\r\n})\r\nfs.unlinkSync('./myfile.txt')\r\n\r\ntry{\r\n    stream.write('whatever', () => {\r\n                console.log('All is well.')\r\n            })\r\n}\r\ncatch (err) {\r\n   assert.isUndefined(err)\r\n}\r\nconst stream = fse.createWriteStream(\r\n                path.normalize('./myfile.txt'),\r\n                {flags: 'a', encoding: UTF8, mode: FILE_MODE}\r\n            )\r\nstream.on('error', err => {\r\n    assert.isNotOk(err)\r\n})\r\n// !!! I delete the stream`s file\r\nfs.unlinkSync('./myfile.txt')\r\n\r\ntry{\r\n    stream.write('whatever')\r\n}\r\ncatch (err) {\r\n   assert.isUndefined(err)\r\n}\r\n```\r\nthe test passes.\r\nI don't thimk this has anything to do with importing fs-extra. It's just a wrapper for fs.\r\nIs this a normal behaviour? Shouldn't there be some way to prevent this kind of error?\r\nThank you for your time."
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18272",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18272/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18272/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18272/events",
      "html_url": "https://github.com/nodejs/node/pull/18272",
      "id": 290207725,
      "number": 18272,
      "title": "build: make linters independent of local node",
      "user": {
        "login": "joyeecheung",
        "id": 4299420,
        "avatar_url": "https://avatars0.githubusercontent.com/u/4299420?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/joyeecheung",
        "html_url": "https://github.com/joyeecheung",
        "followers_url": "https://api.github.com/users/joyeecheung/followers",
        "following_url": "https://api.github.com/users/joyeecheung/following{/other_user}",
        "gists_url": "https://api.github.com/users/joyeecheung/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/joyeecheung/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/joyeecheung/subscriptions",
        "organizations_url": "https://api.github.com/users/joyeecheung/orgs",
        "repos_url": "https://api.github.com/users/joyeecheung/repos",
        "events_url": "https://api.github.com/users/joyeecheung/events{/privacy}",
        "received_events_url": "https://api.github.com/users/joyeecheung/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 171787391,
          "url": "https://api.github.com/repos/nodejs/node/labels/build",
          "name": "build",
          "color": "eb6420",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-20T17:20:00Z",
      "updated_at": "2018-01-22T15:37:33Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18272",
        "html_url": "https://github.com/nodejs/node/pull/18272",
        "diff_url": "https://github.com/nodejs/node/pull/18272.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18272.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nbuild"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18271",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18271/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18271/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18271/events",
      "html_url": "https://github.com/nodejs/node/pull/18271",
      "id": 290200701,
      "number": 18271,
      "title": "doc: split CONTRIBUTING.md",
      "user": {
        "login": "joyeecheung",
        "id": 4299420,
        "avatar_url": "https://avatars0.githubusercontent.com/u/4299420?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/joyeecheung",
        "html_url": "https://github.com/joyeecheung",
        "followers_url": "https://api.github.com/users/joyeecheung/followers",
        "following_url": "https://api.github.com/users/joyeecheung/following{/other_user}",
        "gists_url": "https://api.github.com/users/joyeecheung/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/joyeecheung/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/joyeecheung/subscriptions",
        "organizations_url": "https://api.github.com/users/joyeecheung/orgs",
        "repos_url": "https://api.github.com/users/joyeecheung/repos",
        "events_url": "https://api.github.com/users/joyeecheung/events{/privacy}",
        "received_events_url": "https://api.github.com/users/joyeecheung/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267517,
          "url": "https://api.github.com/repos/nodejs/node/labels/doc",
          "name": "doc",
          "color": "006b75",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 5,
      "created_at": "2018-01-20T15:39:30Z",
      "updated_at": "2018-01-22T15:34:50Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18271",
        "html_url": "https://github.com/nodejs/node/pull/18271",
        "diff_url": "https://github.com/nodejs/node/pull/18271.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18271.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\nI wanted to update the CONTRIBUTING.md with some notes on CI flakes, but seeing how big it is I decided to split it first. It is already too long to read.\r\n\r\nThe first commit split the CONTRIBUTING.md into separate documents. No changes are made to the text of each section other than relative link fixes.\r\nThe second commit improves the summaries in CONTRIBUTING.md.\r\n\r\nFixes: https://github.com/nodejs/node/issues/17842\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ndoc"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18270",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18270/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18270/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18270/events",
      "html_url": "https://github.com/nodejs/node/pull/18270",
      "id": 290195256,
      "number": 18270,
      "title": "src: don't abort when package.json is a directory",
      "user": {
        "login": "bnoordhuis",
        "id": 275871,
        "avatar_url": "https://avatars0.githubusercontent.com/u/275871?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bnoordhuis",
        "html_url": "https://github.com/bnoordhuis",
        "followers_url": "https://api.github.com/users/bnoordhuis/followers",
        "following_url": "https://api.github.com/users/bnoordhuis/following{/other_user}",
        "gists_url": "https://api.github.com/users/bnoordhuis/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bnoordhuis/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bnoordhuis/subscriptions",
        "organizations_url": "https://api.github.com/users/bnoordhuis/orgs",
        "repos_url": "https://api.github.com/users/bnoordhuis/repos",
        "events_url": "https://api.github.com/users/bnoordhuis/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bnoordhuis/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267502,
          "url": "https://api.github.com/repos/nodejs/node/labels/C++",
          "name": "C++",
          "color": "e11d21",
          "default": false
        },
        {
          "id": 155435785,
          "url": "https://api.github.com/repos/nodejs/node/labels/fs",
          "name": "fs",
          "color": "0052cc",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-20T14:17:01Z",
      "updated_at": "2018-01-20T16:04:28Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18270",
        "html_url": "https://github.com/nodejs/node/pull/18270",
        "diff_url": "https://github.com/nodejs/node/pull/18270.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18270.patch"
      },
      "body": "Fixes: https://github.com/nodejs/node/issues/8307\r\n\r\nNo overhead alternative to #18261.\r\n\r\nCI: https://ci.nodejs.org/job/node-test-commit/15553/"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18269",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18269/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18269/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18269/events",
      "html_url": "https://github.com/nodejs/node/issues/18269",
      "id": 290194437,
      "number": 18269,
      "title": "investigate flaky parallel/test-tls-server-verify on Windows",
      "user": {
        "login": "Trott",
        "id": 718899,
        "avatar_url": "https://avatars2.githubusercontent.com/u/718899?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Trott",
        "html_url": "https://github.com/Trott",
        "followers_url": "https://api.github.com/users/Trott/followers",
        "following_url": "https://api.github.com/users/Trott/following{/other_user}",
        "gists_url": "https://api.github.com/users/Trott/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Trott/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Trott/subscriptions",
        "organizations_url": "https://api.github.com/users/Trott/orgs",
        "repos_url": "https://api.github.com/users/Trott/repos",
        "events_url": "https://api.github.com/users/Trott/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Trott/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 637807400,
          "url": "https://api.github.com/repos/nodejs/node/labels/CI%20/%20flaky%20test",
          "name": "CI / flaky test",
          "color": "ffff00",
          "default": false
        },
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        },
        {
          "id": 155267349,
          "url": "https://api.github.com/repos/nodejs/node/labels/tls",
          "name": "tls",
          "color": "fad8c7",
          "default": false
        },
        {
          "id": 166236401,
          "url": "https://api.github.com/repos/nodejs/node/labels/windows",
          "name": "windows",
          "color": "9944dd",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-20T14:02:55Z",
      "updated_at": "2018-01-20T14:03:09Z",
      "closed_at": null,
      "author_association": "OWNER",
      "body": "<!--\r\nThank you for reporting an issue.\r\n\r\nThis issue tracker is for bugs and issues found within Node.js core.\r\nIf you require more general support please file an issue on our help\r\nrepo. https://github.com/nodejs/help\r\n\r\n\r\nPlease fill in as much of the template below as you're able.\r\n\r\nVersion: output of `node -v`\r\nPlatform: output of `uname -a` (UNIX), or version and 32 or 64-bit (Windows)\r\nSubsystem: if known, please specify affected core module name\r\n\r\nIf possible, please provide code that demonstrates the problem, keeping it as\r\nsimple and free of external dependencies as you are able.\r\n-->\r\n\r\n* **Version**: 10.0.0-pre\r\n* **Platform**: win2016, vs2017\r\n* **Subsystem**: test\r\n\r\n<!-- Enter your issue details below this comment. -->\r\nhttps://ci.nodejs.org/job/node-test-binary-windows/14353/COMPILED_BY=vs2017,RUNNER=win2016,RUN_SUBSET=3/console\r\n\r\n```console\r\nnot ok 410 parallel/test-tls-server-verify\r\n  ---\r\n  duration_ms: 120.355\r\n  severity: fail\r\n  stack: |-\r\n    timeout\r\n```"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18268",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18268/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18268/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18268/events",
      "html_url": "https://github.com/nodejs/node/pull/18268",
      "id": 290193154,
      "number": 18268,
      "title": "doc: document the collaborator nomination process",
      "user": {
        "login": "joyeecheung",
        "id": 4299420,
        "avatar_url": "https://avatars0.githubusercontent.com/u/4299420?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/joyeecheung",
        "html_url": "https://github.com/joyeecheung",
        "followers_url": "https://api.github.com/users/joyeecheung/followers",
        "following_url": "https://api.github.com/users/joyeecheung/following{/other_user}",
        "gists_url": "https://api.github.com/users/joyeecheung/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/joyeecheung/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/joyeecheung/subscriptions",
        "organizations_url": "https://api.github.com/users/joyeecheung/orgs",
        "repos_url": "https://api.github.com/users/joyeecheung/repos",
        "events_url": "https://api.github.com/users/joyeecheung/events{/privacy}",
        "received_events_url": "https://api.github.com/users/joyeecheung/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 191447057,
          "url": "https://api.github.com/repos/nodejs/node/labels/meta",
          "name": "meta",
          "color": "fef2c0",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-20T13:43:32Z",
      "updated_at": "2018-01-22T08:46:35Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18268",
        "html_url": "https://github.com/nodejs/node/pull/18268",
        "diff_url": "https://github.com/nodejs/node/pull/18268.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18268.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\nAlso describes the privileges of the collaborators and improve the instructions of the onboarding PR.\r\n\r\nThis is a draft done after the discussion in https://github.com/nodejs/node/issues/18090 and this week's TSC meeting, any feedback is welcome!\r\n\r\nRefs: https://github.com/nodejs/TSC/pull/472\r\nFixes: https://github.com/nodejs/node/issues/18090\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ndoc"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18266",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18266/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18266/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18266/events",
      "html_url": "https://github.com/nodejs/node/pull/18266",
      "id": 290161796,
      "number": 18266,
      "title": "stream: fix not calling cleanup() when unpiping all streams.",
      "user": {
        "login": "MoonBall",
        "id": 13298548,
        "avatar_url": "https://avatars1.githubusercontent.com/u/13298548?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/MoonBall",
        "html_url": "https://github.com/MoonBall",
        "followers_url": "https://api.github.com/users/MoonBall/followers",
        "following_url": "https://api.github.com/users/MoonBall/following{/other_user}",
        "gists_url": "https://api.github.com/users/MoonBall/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/MoonBall/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/MoonBall/subscriptions",
        "organizations_url": "https://api.github.com/users/MoonBall/orgs",
        "repos_url": "https://api.github.com/users/MoonBall/repos",
        "events_url": "https://api.github.com/users/MoonBall/events{/privacy}",
        "received_events_url": "https://api.github.com/users/MoonBall/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 463619724,
          "url": "https://api.github.com/repos/nodejs/node/labels/lts-watch-v6.x",
          "name": "lts-watch-v6.x",
          "color": "c2e0c6",
          "default": false
        },
        {
          "id": 731623788,
          "url": "https://api.github.com/repos/nodejs/node/labels/lts-watch-v8.x",
          "name": "lts-watch-v8.x",
          "color": "1d76db",
          "default": false
        },
        {
          "id": 155435883,
          "url": "https://api.github.com/repos/nodejs/node/labels/stream",
          "name": "stream",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 2,
      "created_at": "2018-01-20T03:46:46Z",
      "updated_at": "2018-01-22T15:36:36Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18266",
        "html_url": "https://github.com/nodejs/node/pull/18266",
        "diff_url": "https://github.com/nodejs/node/pull/18266.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18266.patch"
      },
      "body": "Refs: https://github.com/nodejs/node/pull/12746\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\nAfter a readable stream pipes more than one writable streams, I calls `readable.unpipe()` to remove all piped writable stream. I find that only the first piped writable stream calls the `cleanup()`, the others don't call `cleanup()`.\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [ ] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nstream"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18265",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18265/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18265/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18265/events",
      "html_url": "https://github.com/nodejs/node/issues/18265",
      "id": 290156881,
      "number": 18265,
      "title": "v8.deserialize on WebAssembly module fails with \"Unable to deserialize cloned data\"",
      "user": {
        "login": "jayphelps",
        "id": 762949,
        "avatar_url": "https://avatars1.githubusercontent.com/u/762949?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/jayphelps",
        "html_url": "https://github.com/jayphelps",
        "followers_url": "https://api.github.com/users/jayphelps/followers",
        "following_url": "https://api.github.com/users/jayphelps/following{/other_user}",
        "gists_url": "https://api.github.com/users/jayphelps/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/jayphelps/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/jayphelps/subscriptions",
        "organizations_url": "https://api.github.com/users/jayphelps/orgs",
        "repos_url": "https://api.github.com/users/jayphelps/repos",
        "events_url": "https://api.github.com/users/jayphelps/events{/privacy}",
        "received_events_url": "https://api.github.com/users/jayphelps/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
  
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 2,
      "created_at": "2018-01-20T02:20:19Z",
      "updated_at": "2018-01-20T12:08:30Z",
      "closed_at": null,
      "author_association": "NONE",
      "body": "<!--\r\nThank you for reporting an issue.\r\n\r\nThis issue tracker is for bugs and issues found within Node.js core.\r\nIf you require more general support please file an issue on our help\r\nrepo. https://github.com/nodejs/help\r\n\r\n\r\nPlease fill in as much of the template below as you're able.\r\n\r\nVersion: output of `node -v`\r\nPlatform: output of `uname -a` (UNIX), or version and 32 or 64-bit (Windows)\r\nSubsystem: if known, please specify affected core module name\r\n\r\nIf possible, please provide code that demonstrates the problem, keeping it as\r\nsimple and free of external dependencies as you are able.\r\n-->\r\n\r\n* **Version**: v9.4.0\r\n* **Platform**: 16.6.0 Darwin Kernel Version 16.6.0; root:xnu-3789.60.24~6/RELEASE_X86_64 x86_64\r\n* **Subsystem**: [Serialization API](https://nodejs.org/api/v8.html#v8_serialization_api) (experimental)\r\n\r\n***\r\n\r\n### [Online REPL Reproduction](https://runkit.com/jayphelps/node-issues-18265)\r\n\r\nUsing the experimental Serialization API calling `v8.serialize(module)` on a WebAssembly module works, however trying to then deserialize it `v8.deserialize(buffer)` fails with `Error: Unable to deserialize cloned data.`.\r\n\r\nFrom what I gather, node is using a newly exposed API from v8, so it's possible that exposed API is to blame. Although, v8 itself supports it within its internal APIs and the [--wasm_disable_structured_cloning](https://github.com/v8/v8/commit/495a48c84115057e1ec8cffed37992402ea26776) flag is exposed in node v9.4.0 with the expected value of `false` (don't disable aka is enabled)\r\n\r\n```\r\nnode --v8-options\r\n\r\n...\r\n\r\n--wasm_disable_structured_cloning (disable wasm structured cloning)\r\n        type: bool  default: false\r\n\r\n# false means structured cloning aka serialization is NOT disabled AFAIK -jayphelps\r\n```\r\n\r\n```js\r\nconst v8 = require('v8');\r\n\r\n// only putting a simple wasm binary inline so it's easy to reproduce\r\nconst theModule = new WebAssembly.Module(new Uint8Array([\r\n  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00\r\n]));\r\n\r\nconst buffer = v8.serialize(theModule);\r\nv8.deserialize(buffer);\r\n// \"Error: Unable to deserialize cloned data.\"\r\n```\r\n\r\nA bit more real world example, for those curious:\r\n\r\n```js\r\nconst v8 = require('v8');\r\nconst fs = require('fs');\r\n\r\nfunction writeDemo() {\r\n  const module = new WebAssembly.Module(new Uint8Array([\r\n    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00\r\n  ]));\r\n  const buffer = v8.serialize(module);\r\n  fs.writeFileSync('cached-wasm-module.buffer', buffer);\r\n}\r\n\r\nfunction readDemo() {\r\n  const buffer = fs.readFileSync('cached-wasm-module.buffer');\r\n  const module = new WebAssembly.Module(v8.deserialize(buffer));\r\n  const instance = new WebAssembly.Instance(module);\r\n}\r\n\r\nwriteDemo();\r\nreadDemo();\r\n```\r\n\r\nThis is supported in browsers via `postMessage` or saving them into [IndexedDB](https://developer.mozilla.org/en-US/docs/WebAssembly/Caching_modules)\r\n\r\n***\r\n\r\nNo urgency on my part, just logging mostly curious if someone can point me in the right direction codewise and I'll take a peek. I went down the rabbit hole on my own and didn't immediately see anything that would have prohibited support.\r\n\r\n<!-- Enter your issue details below this comment. -->\r\n\r\nCc/ @kwonoj"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18264",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18264/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18264/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18264/events",
      "html_url": "https://github.com/nodejs/node/pull/18264",
      "id": 290148769,
      "number": 18264,
      "title": "stream: simplify `src._readableState` to `state`",
      "user": {
        "login": "MoonBall",
        "id": 13298548,
        "avatar_url": "https://avatars1.githubusercontent.com/u/13298548?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/MoonBall",
        "html_url": "https://github.com/MoonBall",
        "followers_url": "https://api.github.com/users/MoonBall/followers",
        "following_url": "https://api.github.com/users/MoonBall/following{/other_user}",
        "gists_url": "https://api.github.com/users/MoonBall/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/MoonBall/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/MoonBall/subscriptions",
        "organizations_url": "https://api.github.com/users/MoonBall/orgs",
        "repos_url": "https://api.github.com/users/MoonBall/repos",
        "events_url": "https://api.github.com/users/MoonBall/events{/privacy}",
        "received_events_url": "https://api.github.com/users/MoonBall/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435883,
          "url": "https://api.github.com/repos/nodejs/node/labels/stream",
          "name": "stream",
          "color": "c7def8",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-20T00:47:57Z",
      "updated_at": "2018-01-22T16:37:01Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18264",
        "html_url": "https://github.com/nodejs/node/pull/18264",
        "diff_url": "https://github.com/nodejs/node/pull/18264.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18264.patch"
      },
      "body": "<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\nA small change.\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\nstream"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18263",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18263/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18263/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18263/events",
      "html_url": "https://github.com/nodejs/node/pull/18263",
      "id": 290142760,
      "number": 18263,
      "title": "test: fix flaky cluster unix socket test",
      "user": {
        "login": "bnoordhuis",
        "id": 275871,
        "avatar_url": "https://avatars0.githubusercontent.com/u/275871?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bnoordhuis",
        "html_url": "https://github.com/bnoordhuis",
        "followers_url": "https://api.github.com/users/bnoordhuis/followers",
        "following_url": "https://api.github.com/users/bnoordhuis/following{/other_user}",
        "gists_url": "https://api.github.com/users/bnoordhuis/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bnoordhuis/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bnoordhuis/subscriptions",
        "organizations_url": "https://api.github.com/users/bnoordhuis/orgs",
        "repos_url": "https://api.github.com/users/bnoordhuis/repos",
        "events_url": "https://api.github.com/users/bnoordhuis/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bnoordhuis/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 2,
      "created_at": "2018-01-20T00:02:10Z",
      "updated_at": "2018-01-22T15:49:48Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18263",
        "html_url": "https://github.com/nodejs/node/pull/18263",
        "diff_url": "https://github.com/nodejs/node/pull/18263.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18263.patch"
      },
      "body": "Ensure `common.tmpDir` exists before trying to chdir into it.  Fixes a\r\n\"ENOENT: no such file or directory, uv_chdir\" error when the temporary\r\ndirectory is removed before running the test."
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18262",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18262/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18262/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18262/events",
      "html_url": "https://github.com/nodejs/node/issues/18262",
      "id": 290114019,
      "number": 18262,
      "title": "Bikeshedding question: new home for V8's GYP files?",
      "user": {
        "login": "hashseed",
        "id": 2291463,
        "avatar_url": "https://avatars0.githubusercontent.com/u/2291463?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/hashseed",
        "html_url": "https://github.com/hashseed",
        "followers_url": "https://api.github.com/users/hashseed/followers",
        "following_url": "https://api.github.com/users/hashseed/following{/other_user}",
        "gists_url": "https://api.github.com/users/hashseed/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/hashseed/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/hashseed/subscriptions",
        "organizations_url": "https://api.github.com/users/hashseed/orgs",
        "repos_url": "https://api.github.com/users/hashseed/repos",
        "events_url": "https://api.github.com/users/hashseed/events{/privacy}",
        "received_events_url": "https://api.github.com/users/hashseed/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 176191361,
          "url": "https://api.github.com/repos/nodejs/node/labels/V8%20Engine",
          "name": "V8 Engine",
          "color": "0052cc",
          "default": false
        },
        {
          "id": 171787081,
          "url": "https://api.github.com/repos/nodejs/node/labels/discuss",
          "name": "discuss",
          "color": "02d7e1",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 3,
      "created_at": "2018-01-19T21:35:19Z",
      "updated_at": "2018-01-21T10:58:53Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "body": "As you all might know, Chrome has moved off GYP in favor of GN as build system. V8 has followed that move, but kept maintaining gyp configs for longer than Chrome requires, mostly for Node.js.\r\n\r\nIn the past weeks I have, as [planned](https://docs.google.com/document/d/1gvHuesiuvLzD6X6ONddxXRxhODlOJlxgfoTNZTlKLGA/edit#), implemented a GYP/GN bridge so that V8 as Node.js' dependency can be built with GN. This means that in order to test V8 against Node.js, the V8 team no longer has to maintain GYP.\r\n\r\nWe will probably be getting rid of GYP configs in upstream V8 in this quarter. Node.js will need to take ownership over these files, at least before it has found an alternative to GYP.\r\n\r\nQuestion is, where should these files reside?\r\n- Should they stay in `deps/v8/` even though they no longer exist in upstream V8? I'm sure we can make this work without affecting updating V8 too much by tweaking `.gitignore` files.\r\n- Or should they live in node core, for example `tools` or a new `build` subfolder?\r\n\r\nI don't have any strong opinion on this, but would like to experiment with this to prepare for handover."
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18261",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18261/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18261/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18261/events",
      "html_url": "https://github.com/nodejs/node/pull/18261",
      "id": 290107339,
      "number": 18261,
      "title": "module: ignore package.json/ directories",
      "user": {
        "login": "bmeck",
        "id": 234659,
        "avatar_url": "https://avatars1.githubusercontent.com/u/234659?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bmeck",
        "html_url": "https://github.com/bmeck",
        "followers_url": "https://api.github.com/users/bmeck/followers",
        "following_url": "https://api.github.com/users/bmeck/following{/other_user}",
        "gists_url": "https://api.github.com/users/bmeck/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bmeck/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bmeck/subscriptions",
        "organizations_url": "https://api.github.com/users/bmeck/orgs",
        "repos_url": "https://api.github.com/users/bmeck/repos",
        "events_url": "https://api.github.com/users/bmeck/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bmeck/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155435814,
          "url": "https://api.github.com/repos/nodejs/node/labels/module",
          "name": "module",
          "color": "fbca04",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 13,
      "created_at": "2018-01-19T21:07:30Z",
      "updated_at": "2018-01-20T15:57:23Z",
      "closed_at": null,
      "author_association": "MEMBER",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18261",
        "html_url": "https://github.com/nodejs/node/pull/18261",
        "diff_url": "https://github.com/nodejs/node/pull/18261.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18261.patch"
      },
      "body": "Fixes: https://github.com/nodejs/node/issues/8307\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\n\r\nmodule"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18260",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18260/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18260/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18260/events",
      "html_url": "https://github.com/nodejs/node/pull/18260",
      "id": 290101379,
      "number": 18260,
      "title": "deps: upgrade libuv to 1.19.1",
      "user": {
        "login": "cjihrig",
        "id": 2512748,
        "avatar_url": "https://avatars1.githubusercontent.com/u/2512748?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/cjihrig",
        "html_url": "https://github.com/cjihrig",
        "followers_url": "https://api.github.com/users/cjihrig/followers",
        "following_url": "https://api.github.com/users/cjihrig/following{/other_user}",
        "gists_url": "https://api.github.com/users/cjihrig/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/cjihrig/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/cjihrig/subscriptions",
        "organizations_url": "https://api.github.com/users/cjihrig/orgs",
        "repos_url": "https://api.github.com/users/cjihrig/repos",
        "events_url": "https://api.github.com/users/cjihrig/events{/privacy}",
        "received_events_url": "https://api.github.com/users/cjihrig/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 214431115,
          "url": "https://api.github.com/repos/nodejs/node/labels/libuv",
          "name": "libuv",
          "color": "bfd4f2",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 0,
      "created_at": "2018-01-19T20:43:33Z",
      "updated_at": "2018-01-22T15:26:10Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18260",
        "html_url": "https://github.com/nodejs/node/pull/18260",
        "diff_url": "https://github.com/nodejs/node/pull/18260.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18260.patch"
      },
      "body": "##### Checklist\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\ndeps\r\n\r\nCI: https://ci.nodejs.org/job/node-test-pull-request/12628/\r\nCI2: https://ci.nodejs.org/job/node-test-pull-request/12629/\r\nCI3: https://ci.nodejs.org/job/node-test-pull-request/12632/\r\nCI4: https://ci.nodejs.org/job/node-test-pull-request/12636/"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18259",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18259/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18259/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18259/events",
      "html_url": "https://github.com/nodejs/node/pull/18259",
      "id": 290101244,
      "number": 18259,
      "title": "test: change assert message to default",
      "user": {
        "login": "ryanmahan",
        "id": 22506979,
        "avatar_url": "https://avatars3.githubusercontent.com/u/22506979?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ryanmahan",
        "html_url": "https://github.com/ryanmahan",
        "followers_url": "https://api.github.com/users/ryanmahan/followers",
        "following_url": "https://api.github.com/users/ryanmahan/following{/other_user}",
        "gists_url": "https://api.github.com/users/ryanmahan/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ryanmahan/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ryanmahan/subscriptions",
        "organizations_url": "https://api.github.com/users/ryanmahan/orgs",
        "repos_url": "https://api.github.com/users/ryanmahan/repos",
        "events_url": "https://api.github.com/users/ryanmahan/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ryanmahan/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 746808418,
          "url": "https://api.github.com/repos/nodejs/node/labels/fast-track",
          "name": "fast-track",
          "color": "a989e5",
          "default": false
        },
        {
          "id": 754449534,
          "url": "https://api.github.com/repos/nodejs/node/labels/ready",
          "name": "ready",
          "color": "1eca26",
          "default": false
        },
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 1,
      "created_at": "2018-01-19T20:42:57Z",
      "updated_at": "2018-01-22T15:40:45Z",
      "closed_at": null,
      "author_association": "NONE",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18259",
        "html_url": "https://github.com/nodejs/node/pull/18259",
        "diff_url": "https://github.com/nodejs/node/pull/18259.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18259.patch"
      },
      "body": "assert.strictEqual message argument removed to replace\r\nwith default assert message to show the expected vs\r\nactual values\r\n\r\nRefs: https://github.com/nodejs/node/issues/13296\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ntest\r\n"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18258",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18258/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18258/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18258/events",
      "html_url": "https://github.com/nodejs/node/pull/18258",
      "id": 290095017,
      "number": 18258,
      "title": "doc: improve callback documentation of http2Stream.pushstream()",
      "user": {
        "login": "nephross",
        "id": 9928717,
        "avatar_url": "https://avatars0.githubusercontent.com/u/9928717?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/nephross",
        "html_url": "https://github.com/nephross",
        "followers_url": "https://api.github.com/users/nephross/followers",
        "following_url": "https://api.github.com/users/nephross/following{/other_user}",
        "gists_url": "https://api.github.com/users/nephross/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/nephross/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/nephross/subscriptions",
        "organizations_url": "https://api.github.com/users/nephross/orgs",
        "repos_url": "https://api.github.com/users/nephross/repos",
        "events_url": "https://api.github.com/users/nephross/events{/privacy}",
        "received_events_url": "https://api.github.com/users/nephross/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 155267517,
          "url": "https://api.github.com/repos/nodejs/node/labels/doc",
          "name": "doc",
          "color": "006b75",
          "default": false
        },
        {
          "id": 746808418,
          "url": "https://api.github.com/repos/nodejs/node/labels/fast-track",
          "name": "fast-track",
          "color": "a989e5",
          "default": false
        },
        {
          "id": 647282877,
          "url": "https://api.github.com/repos/nodejs/node/labels/http2",
          "name": "http2",
          "color": "c2e0c6",
          "default": false
        },
        {
          "id": 754449534,
          "url": "https://api.github.com/repos/nodejs/node/labels/ready",
          "name": "ready",
          "color": "1eca26",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 7,
      "created_at": "2018-01-19T20:17:49Z",
      "updated_at": "2018-01-22T16:01:52Z",
      "closed_at": null,
      "author_association": "NONE",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18258",
        "html_url": "https://github.com/nodejs/node/pull/18258",
        "diff_url": "https://github.com/nodejs/node/pull/18258.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18258.patch"
      },
      "body": "Improve documentation of callback signature of\r\nhttp2Stream.pushStream() function to align with\r\nthe changes made in https://github.com/nodejs/node/pull/17406.\r\n\r\nFixes: https://github.com/nodejs/node/issues/18198\r\nRefs: https://github.com/nodejs/node/pull/17406\r\n\r\n<!--\r\nThank you for your pull request. Please provide a description above and review\r\nthe requirements below.\r\n\r\nBug fixes and new features should include tests and possibly benchmarks.\r\n\r\nContributors guide: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md\r\n-->\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] documentation is changed or added\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\n<!-- Provide affected core subsystem(s) (like doc, cluster, crypto, etc). -->\r\ndoc"
    },
    {
      "url": "https://api.github.com/repos/nodejs/node/issues/18257",
      "repository_url": "https://api.github.com/repos/nodejs/node",
      "labels_url": "https://api.github.com/repos/nodejs/node/issues/18257/labels{/name}",
      "comments_url": "https://api.github.com/repos/nodejs/node/issues/18257/comments",
      "events_url": "https://api.github.com/repos/nodejs/node/issues/18257/events",
      "html_url": "https://github.com/nodejs/node/pull/18257",
      "id": 290019113,
      "number": 18257,
      "title": "fix flaky net-connect-handle-econnrefused",
      "user": {
        "login": "Leko",
        "id": 1424963,
        "avatar_url": "https://avatars3.githubusercontent.com/u/1424963?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Leko",
        "html_url": "https://github.com/Leko",
        "followers_url": "https://api.github.com/users/Leko/followers",
        "following_url": "https://api.github.com/users/Leko/following{/other_user}",
        "gists_url": "https://api.github.com/users/Leko/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Leko/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Leko/subscriptions",
        "organizations_url": "https://api.github.com/users/Leko/orgs",
        "repos_url": "https://api.github.com/users/Leko/repos",
        "events_url": "https://api.github.com/users/Leko/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Leko/received_events",
        "type": "User",
        "site_admin": false
      },
      "labels": [
        {
          "id": 176240519,
          "url": "https://api.github.com/repos/nodejs/node/labels/test",
          "name": "test",
          "color": "990099",
          "default": false
        }
      ],
      "state": "open",
      "locked": false,
      "assignee": null,
      "assignees": [
  
      ],
      "milestone": null,
      "comments": 2,
      "created_at": "2018-01-19T15:48:49Z",
      "updated_at": "2018-01-21T20:08:15Z",
      "closed_at": null,
      "author_association": "CONTRIBUTOR",
      "pull_request": {
        "url": "https://api.github.com/repos/nodejs/node/pulls/18257",
        "html_url": "https://github.com/nodejs/node/pull/18257",
        "diff_url": "https://github.com/nodejs/node/pull/18257.diff",
        "patch_url": "https://github.com/nodejs/node/pull/18257.patch"
      },
      "body": "This PR closes #18164\r\n\r\nI changed timing of connecting to server.\r\nIt connects to server after server.close called certainly.\r\n\r\nDoes that solve this issue?\r\nI'd appreciate any feedback or suggestions.\r\n\r\n##### Checklist\r\n<!-- Remove items that do not apply. For completed items, change [ ] to [x]. -->\r\n\r\n- [x] `make -j4 test` (UNIX), or `vcbuild test` (Windows) passes\r\n- [x] tests and/or benchmarks are included\r\n- [x] commit message follows [commit guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md#commit-message-guidelines)\r\n\r\n##### Affected core subsystem(s)\r\ntest"
    }
  ]