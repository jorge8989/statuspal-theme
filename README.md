# Statuspal Default Theme

This is the new default theme of Statuspal, which features a small top bar with an optional
logo image and and logo text, here is a preview:

![Theme Preview](/preview.png?raw=true "Theme Preview")

## Statuspal Theme Builder

This theme is built using the Statuspal Theme Builder, which means you can fork it and easily
customize it with user friendly development tools like local preview of your status page and
live changes as you work on your theme.

### Requirements

1. Node version >= 8
2. NPM

### Setup

1. Clone this repo locally: `git clone git@github.com:statuspal/statuspal-theme.git my-new-theme`.
2. Cd to your new theme `cd my-new-theme`.
3. Set this remote as its upstream: `git remote rename origin upstream`.
4. Run `npm install` to install dependencies.

### Development

For easy of developing of your theme, you work by previewing your status page's content in it,
for this you'll need to know the subdomain of the status page you want to preview.

Find your status page's subdomain in the URL of it's admin dashboard
(`statuspal.io/admin/status_pages/<subdomain>`).

To start developing run: `SPAGE=<your status page's subdomain> npm start`, you should be able
to see a live preview of your theme with your status page data under http://localhost:5500.

Change your theme to fit your needs, you can change anything under the `/src` directory
except the `layout.liquid`, this will be overridden by Statuspal. All your changes will be reflected live.

### Use Your Custom Theme

Once you're happy with your theme you can release it by running `SPAGE=<subdomain> npm run release`.

This will generate a `theme.zip` file under the `/dist` directory, you can upload this file
to your status page in the `design` tab of its dashboard.

We recommend trying it first in a dummy status page to make sure it works as expected, if you
encounter any issues don't hesitate to contact us at theme-support@statuspal.io.
