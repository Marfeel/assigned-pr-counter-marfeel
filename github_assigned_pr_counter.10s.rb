#!/usr/bin/env ruby
# coding: utf-8
# <bitbar.title>GitHub Assigned PR Counter</bitbar.title>
# <bitbar.version>v1.0.0</bitbar.version>
# <bitbar.author>akira-hamada</bitbar.author>
# <bitbar.author.github>akira-hamada</bitbar.author.github>
# <bitbar.desc>GitHub Assigned Pull Request Counter</bitbar.desc>
# <bitbar.dependencies>ruby</bitbar.dependencies>
# <bitbar.abouturl>https://github.com/akira-hamada/github-assigned-pr-counter</bitbar.abouturl>

require 'net/http'
require 'uri'
require 'json'

ACCESS_TOKEN = '' # Generate new token here https://github.com/settings/tokens (you must check [repo] to access to private repos)
OWNER = 'Marfeel'
REPOS = ['MarfeelXP','AliceTenants','Gutenberg']
GITHUB_USERNAME = 'YOUR_USERNAME'
COLOR_CLEAN_PR='green'
COLOR_PR='red'

def setColorTheme()
  if ENV["BitBarDarkMode"]
    return 'white'
  end
  return 'black'
end

def getIssuesByUser(repo)
  url = "https://api.github.com/repos/#{OWNER}/#{repo}/issues?access_token=#{ACCESS_TOKEN}"
  issues = JSON.parse(Net::HTTP.get(URI.parse(url)))
  issues = issues.select do |issue|
    !issue['pull_request'].nil? && !issue['assignee'].nil? && issue['assignee']['login'] == GITHUB_USERNAME
  end
  return issues
end

def renderCounter(count)
  totalPRNumberColor = count >= 1 ? COLOR_PR : COLOR_CLEAN_PR
  if count == 0
      puts ":palm_tree: #{count} | color=#{totalPRNumberColor}"
  else
      puts ":eyeglasses: #{count} | color=#{totalPRNumberColor}"
  end
  puts '---'
end

issuesDividedByRepos = REPOS.map{ |repo| getIssuesByUser(repo) }

# Response detail is here https://developer.github.com/v3/pulls/#response
totalPR = 0
issuesDividedByRepos.each.with_index { |issues, i|
  totalPR = totalPR + issues.length
}
renderCounter(totalPR)


issuesDividedByRepos.each.with_index { |issues, i|
  count = issues.count
  color = setColorTheme()
  puts "#{REPOS[i]} | color=#{color}"
  renderCounter(count)

  issues.each do |pr|
    puts "#{pr['title']} | color=#{color} href=#{pr['html_url']}"
  end
  puts '---'
}
