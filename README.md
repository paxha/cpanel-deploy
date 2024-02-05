# cPanel Deploy

Deploy to cPanel through github actions.

## Getting Started

```yml
name: cPanel Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to cPanel
        id: deploy
        uses: paxha/cpanel-deploy@v2.1.0
        with:
          hostname: 'https://server327.web-hosting.com'
          cpanel_username: 'smartdaddy'
          repository_root: '/home/smartdaddy/repositories/smart-daddy.com'
          branch: main
          cpanel_api_token: '${{ secrets.CPANEL_TOKEN }}'
```
