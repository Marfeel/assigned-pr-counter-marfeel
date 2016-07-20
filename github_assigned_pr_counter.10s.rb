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

def getIssues(repo)
  url = "https://api.github.com/repos/#{OWNER}/#{repo}/issues?access_token=#{ACCESS_TOKEN}"
  issues = JSON.parse(Net::HTTP.get(URI.parse(url)))
  return issues
end

issuesDividedByRepos = REPOS.map{ |repo| getIssues(repo) }

# Response detail is here https://developer.github.com/v3/pulls/#response
issuesDividedByRepos.each.with_index { |issues, i|
  asigned_pulls = issues.select do |issue|
    !issue['pull_request'].nil? && !issue['assignee'].nil? && issue['assignee']['login'] == GITHUB_USERNAME
  end

  count = asigned_pulls.count
  color = setColorTheme()
  prNumberColor = count >= 1 ? COLOR_PR : COLOR_CLEAN_PR

  if count == 0
    puts ":palm_tree: #{count} | color=#{prNumberColor}"
  else
    puts ":eyeglasses: #{count} | color=#{prNumberColor}"
  end

  puts "#{REPOS[i]} | color=#{color}"

  puts '---'

  asigned_pulls.each do |pr|
    puts "#{pr['title']} | color=#{color} href=#{pr['html_url']}"
  end
  puts '---'
}
