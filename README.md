# cPanel Deploy

Deploy to cPanel through GitHub Actions.

## Getting Started

To deploy your code to cPanel using GitHub Actions, follow these steps:

1. Create a workflow file (e.g., `.github/workflows/cpanel-deployment.yml`) in your repository.

2. Add the following content to the workflow file:

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
