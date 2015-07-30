#!/bin/bash
git stash
git checkout gh-pages
git pull
git checkout master -- .
npm install
cp ./front-dist/* ./
cp ./front-src/index.html ./
git checkout -- ./gitignore
git rm -r --cached .
git add .
git commit -m "deploy"
git push
git checkout master
