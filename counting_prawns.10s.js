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
  username: 'YOUR_USERNAME',
  owner: 'Marfeel',
  repos: ['MarfeelXP', 'AliceTenants', 'Gutenberg'],
  color: 'green',
  alertColor: 'red',
};

const getMutipleOptions = (config) => {
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

const getPRs = (options) => (
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  })
);

const getPrDividedByRepos = () => {
  const multipleOptions = getMutipleOptions(githubConfig);
  /* TODO: before to call the API add a name of repo than concat */
  const prDividedByRepos = multipleOptions.map(options => getPRs(options));
  return Promise.all(prDividedByRepos);
};

const filterPrsByLoginNames = pr => {
  const {
    assignees,
  } = pr;

  const {
    username,
  } = githubConfig;

  const loginNames = assignees.map(assignee => assignee.login);
  return loginNames.includes(username);
};

const getPrDividedByReposAndAssignedToYou = () => (
  getPrDividedByRepos().then(prDividedByRepos =>
    prDividedByRepos.map(prs =>
      prs.filter(pr => filterPrsByLoginNames(pr))
    )
  )
);

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
  )).concat(sep)
);

const getStyledTitle = numberOfPr => `${getEmoji(numberOfPr)} ${numberOfPr}`;

/* TODO: This needs a better implementation. Needs refacor */
const getRepoName = prs => prs[0].base.repo.name;

/* TODO: This method should have been called as soon as i get the data, not here. Needs refacor */
const getCleanPrAssignedToYouDividedByRepos = prAssignedToYouDividedByRepos => (
  prAssignedToYouDividedByRepos.filter(prAssignedToYou => prAssignedToYou.length)
);

const bitbarObjectBuilder = (prAssignedToYouDividedByRepos, bitbarConfigVars) => {
  const totalPrAssignedToYou = getTotalPrAssignedToYou(prAssignedToYouDividedByRepos);
  const cleanPrAssignedToYouDividedByRepos = getCleanPrAssignedToYouDividedByRepos(prAssignedToYouDividedByRepos);
  const {
    darkMode,
    sep,
  } = bitbarConfigVars;

  const heading = {
    text: getStyledTitle(totalPrAssignedToYou),
    color: getColor(darkMode),
    dropdown: false,
  };

  const formattedPr = cleanPrAssignedToYouDividedByRepos.map(prs => (
    {
      text: `${getRepoName(prs)} ${getStyledTitle(prs.length)}`,
      color: getColor(darkMode),
      submenu: getFormattedPrByRepo(prs, darkMode, sep),
    }
  ));

  return Array.of(heading, sep).concat(formattedPr);
};

const paintBitBar = () => {
  getPrDividedByReposAndAssignedToYou().then((prAssignedToYou) => {
    bitbar(bitbarObjectBuilder(prAssignedToYou, bitbar));
  });
};

paintBitBar();
