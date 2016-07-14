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
REPO = 'Marfeel/YOUR_REPO'
GITHUB_USERNAME = 'YOUR_USERNAME'

url = "https://api.github.com/repos/#{REPO}/issues?access_token=#{ACCESS_TOKEN}"
issues =  JSON.parse(Net::HTTP.get(URI.parse(url)))

# Response detail is here https://developer.github.com/v3/pulls/#response
asigned_pulls = issues.select do |issue|
  !issue['pull_request'].nil? && !issue['assignee'].nil? && issue['assignee']['login'] == GITHUB_USERNAME
end

count = asigned_pulls.count
color = count > 0 ? 'black' : 'gray'
if count == 0
  puts ":palm_tree: #{count} | color=#{color}"
else
  puts ":eyeglasses: #{count} | color=#{color}"
end

puts '---'

asigned_pulls.each do |pr|
  puts "#{pr['title']} | color=black href=#{pr['html_url']}"
end
