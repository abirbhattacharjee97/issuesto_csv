# GitHub Issue Extractor
It extracts open issues from the specified GitHub repository and outputs it in .csv format. It currently only fetches the first 100 issues.

## Usage

```
$ npm install
$ node ./index.js nunit/nunit
```

And this is the [corresponding spreadsheet](https://docs.google.com/spreadsheets/d/1uVgtcUwsB9OVrQwUC8oPkcbd3ob00kobhamkGi_0FTI/pubhtml) generated from `sample.csv` above (formatting was done manually).

## Authentication

You need to have an access token in order to use this script. Go to [Settings -> Applications](https://github.com/settings/applications) to generate a new token. Copy and paste it into `configs/github.json` (see `configs/github.sample.json`).

## Credits

The original code is by [Brian Park](http://brianpark.ca) and taken from https://github.com/yaru22/github-issue-extractor