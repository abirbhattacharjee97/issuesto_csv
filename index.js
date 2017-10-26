'use strict';

var _       = require('lodash'),
    request = require('request'),
    util    = require('util');

var accessToken;

try
{
    var githubConfig = require('./configs/github');
    accessToken = githubConfig.accessToken;
}
catch (err)
{
    accessToken = process.env.GITHUB_ACCESS_TOKEN;
    if (!accessToken)
    {
      console.log('GitHub access token is not available. Please set it via GITHUB_ACCESS_TOKEN environment variable.');
      process.exit(1);
    }
}

var ISSUES_API_URL = 'https://api.github.com/repos/%s/issues?access_token=%s';
var repoPath = process.argv[2]

function collectIssues(outputFunction)
{
    var issuesUrl = util.format(ISSUES_API_URL, repoPath, accessToken);
    request({
        url: issuesUrl,
        json: true,
        headers:
        {
          'User-Agent': 'Node.js Request',
          'Accept': 'application/json'
        }
      }, function (err, resp, body) {
            if (err || resp.statusCode !== 200)
            {
                console.log(err, resp);
                return;
            }

      var issues = [];

      body.map(function (issue) {

            var labels = [];
            _.each(issue.labels, function(label){
              labels.push(label.name);
            });

            var assignees = [];
            _.each(issue.assignees,function(assignee){
              assignees.push(assignee.login);
            });

            var milestones = [];
            _.each(issue.milestones,function(milestone){
              milestones.push(milestone.name);
            });

            issues.push({
                author: issue.user.login,
                title: issue.title.replace(/"/g, '\''),
                labels: labels.join(),
                assignees: assignees.join(),
                milestones: milestones.join(),
                status: issue.state
              });
            });
    outputFunction(issues);
  });
}

var outputFunctions = {};

outputFunctions.all = function (data)
{
  console.log('===== JSON format =====');
  outputFunctions.json(data);
  console.log('\n===== CSV format =====');
  outputFunctions.csv(data);
};

outputFunctions.json = function (data) {
  console.log(JSON.stringify(data, null, 2));
};


var fs = require('fs');
var json2csv = require('json2csv');
var newLine= "\r\n";


var fields = ['Title', 'Status', 'Author', 'Labels','Milestones', 'Assignee'];
var appendThis = [];

outputFunctions.csv = function (data) {

  _.each(data, function (issue) {
    var a = {

      'Title': issue.title,
      'Status': issue.status,
      'Author': issue.author,
      'Labels': issue.labels,
      'Milestones': issue.milestones,
      'Assignee': issue.assignees

      }

     appendThis.push(a);
  });

  var toCsv = {

      data: appendThis,
      fields: fields,
      hasCSVColumnTitle: false
  };

  fs.stat('file.csv', function (err, stat) {
      if (err != null) {
          //write the headers and newline
          fields= (fields + newLine);

          fs.writeFile('file.csv', fields, function (err, stat) {
              if (err) throw err;

         var csv = json2csv(toCsv) + newLine;


              fs.appendFile('file.csv', csv, function (err) {
                  if (err) throw err;
                  console.log('Successfully written');
              });
          });
      }
  });

};

collectIssues(outputFunctions.csv);
