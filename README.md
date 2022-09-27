# My run-on-slack app template

## Steps to enable this app

### 0. Enable the next-gen platform in your workspace

To use this sample, you first need to install and configure the Slack CLI.
Step-by-step instructions can be found in
[Quickstart Guide](https://api.slack.com/future/quickstart). Also, the beta
platform needs to be enabled for your paid Slack workspace.

And then, you can use this GitHub repository as the template for your app.

```bash
slack create my-deepl-slack-app -t seratch/run-on-slack-deepl
cd my-deepl-slack-app/
```

### 1. Enable reaction_added trigger

First off, open `triggers/trigger.ts` source file and modify it to have a valid
list of channel IDs to enable this app. And then, run the following CLI command:

```bash
slack deploy
slack trigger create --trigger-def triggers/reaction_added.ts
```

### 2. Set DeepL API key to the app

Add your DeepL API key to the app env variables:

```bash
slack env add DEEPL_AUTH_KEY <your own key here>
```

### 3. Add the app to the channels

Add the deployed app to the channels you've listed in the step 1.

### 4. Add a reaction to a message in the channel

Add `:jp:` reaction to any message in the channel. If everything is fine, you
will see the same content that is translated into Japanese in its thread.

<img width="300" src="https://user-images.githubusercontent.com/19658/192277306-b3a2f431-1b8b-44e0-9b6a-224ca09a4b6e.png">

## LICENSE

The MIT License
