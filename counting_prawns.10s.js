#!/usr/local/bin/node
/*
*coding: utf-8
* <bitbar.title>Counting Prawns</bitbar.title>
* <bitbar.version>v1.0.0.beta</bitbar.version>
* <bitbar.author>stefano-nerder-saitta</bitbar.author>
* <bitbar.author.github>stefanosaittamrf</bitbar.author.github>
* <bitbar.desc>GitHub Assigned Pull Request Counter with fancy emoji :tada:</bitbar.desc>
* <bitbar.dependencies>node</bitbar.dependencies>
* <bitbar.abouturl>https://github.com/stefanosaittamrf/assigned-pr-counter-marfeel</bitbar.abouturl>
*/

const https = require('https');
const bitbar = require('bitbar');

// Configurable params
const githubConfig = {
  accessToken: '',
  username: 'stefanosaittamrf',
  owner: 'Marfeel',
  repos: ['MarfeelXP', 'AliceTenants', 'Gutenberg'],
  color: 'green',
  alertColor: 'red',
};

const createMutipleOptions = (config) => {
  const {
    accessToken,
    owner,
    repos,
  } = config;

  return repos.map(repo => ({
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/pulls`,
    method: 'GET',
    headers: {
      Authorization: `token ${accessToken}`,
      'User-Agent': 'Counting-Prawns-App',
    },
  }));
};

const getPr = (options) => {
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      /* TODO: this is just a print of data, need to be parsed */
      process.stdout.write(d);
    });
  });
  req.end();
};

const getPrDividedByReposAndAssignedToYou = () => {
  const prDividedByRepos = getPr(createMutipleOptions(githubConfig));
  /* TODO: i need to attach the name of the repo to this Array */
  return prDividedByRepos.map(repo =>
    getPr(repo).filter(pr => {
      const {
        login,
      } = pr.assignee;
      const {
        username,
      } = githubConfig;
      return login === username;
    }));
};

const getTotalPrAssignedToYou = (prDividedByReposAssignedToYou) => (
  prDividedByReposAssignedToYou.reduce((acc, prDividedByRepos) => (
    acc + prDividedByRepos.length
  ), 0)
);

const getEmoji = num => (num > 0 ? ':eyeglasses:' : ':palm_tree:');

const getColor = darkMode => (darkMode ? 'white' : 'black');

const getFormattedPrByRepo = (repo, darkMode, sep) => (
  /* TODO: needs a spearator after each pr obj */
  repo.map(pr => (
    {
      text: pr.title,
      color: getColor(darkMode),
      href: pr.html_url,
    }
  ))
);

const bitbarObjectBuilder = (prAssignedToYouDividedByRepos, ...bitbarConfigVars) => {
  const totalPrAssignedToYou = getTotalPrAssignedToYou(prAssignedToYouDividedByRepos);
  const {
    darkMode,
    sep,
  } = bitbarConfigVars;

  const heading = {
    text: `${getEmoji(totalPrAssignedToYou)} ${totalPrAssignedToYou}`,
    color: getColor(darkMode),
    dropdown: false,
  };

  const formattedPr = prAssignedToYouDividedByRepos.map(repo => (
    {
      text: repo.name,
      color: getColor(darkMode),
      submenu: getFormattedPrByRepo(repo, darkMode, sep),
    }
  ));

  return Array.of(heading).concat(formattedPr);
};

const paintBitBar = () => {
  bitbar(bitbarObjectBuilder(getPrDividedByReposAndAssignedToYou(), bitbar));
};

paintBitBar();
