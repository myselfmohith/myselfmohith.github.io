# Github page with custom deploy action.

###### github pages, pages, custom script

Sample action.yaml to deploy custom html to Github Pages 
```
name: Github Pages Deploy
on:
  push:
    branches: 
      - main
  workflow_dispatch:

permissions: # required to deploy to pages
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: actions/checkout@v4 # clones the repo to current working directory
      - uses: actions/configure-pages@v5 # pre-checkes for setuo of pages
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3 # uploads the specified directory to pages setup
        with:
          path: 'dst'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```