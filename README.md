# Counting PRawns

## Description
It's very hard to keep truck on everything, and of course memory is something that need to be trained, but if you other 100 things to do sometimes you just forget, thats why the cool thing about programming is that you can let the computer remember (or at least help you) things for you. With this easy script we can truck our assigned pull request in order to don't block the work of others and to make our work smoother.

This tool is based on [BitBar](https://github.com/matryer/bitbar) , an useful software that let you program the MacOSX upper bar easly, in your favourite language.

## Pre-Requirements

- [Download](https://github.com/matryer/bitbar/releases/download/v1.9.1/BitBar-v1.9.1.zip) & Install BitBar
```bash
unzip BitBar-v1.9.1.zip && mv BitBar.app ~/Applications && open BitBar.app
```

## Installation
- Click on the BitBar icon
- Set your favourite directory as Plugin Folder
- Clone this repos into your plugin folder
- Copy the script outside
```bash 
cp github_assigned_pr_counter.10s.rb ..
```

## Configuration

In order to make it work you have to edit this file with your own configs

- Generate new token [here](https://github.com/settings/tokens) (you must check [repo] to access to private repos)
- Set `ACCESS_TOKEN`,  `REPO` and `GITHUB_USERNAME`

## Reminders & Security

If you want to work on this remember to **DONT** commit your API Token. **EVER**

## API

At the moment we are using the GitHub API, but will be changed on the Jira ones, in order to follow better the flow we use at [Marfeel](www.marfeel.com)

## Future improvements & Known Issues

- Refactor this on `Javascript` instead of `Ruby``
- Change the API form Github to Jira
- Support multiple repos
- Growl Notification
- Reminder (after some times with a pending PR, new notification)
- Vacation Mode  

## Open Source Spirits

If something dosen't work, or you wanna make new changes or you just wanna talk about which is the better place to catch some Pokemon don't be afraid of open an issue or send a pull request.

:shipit:
