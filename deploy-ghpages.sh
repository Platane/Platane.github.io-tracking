#!/bin/bash

# stash and change branch to gh-pages
git stash
git checkout gh-pages
git pull

# grab the lastest files from master
git checkout master -- ./front-src
git checkout master -- ./package.json
git checkout master -- ./webpack.config.js

# build
rm -rf ./front-dist/*
npm install

# copy dist files to root dir
cp ./front-dist/* ./
cp ./front-src/index.html ./

# keep ignoring files
printf "front-dist\nfront-src\nrun.js\nwebpack.config.js\n.gitignore-ghpages\nnode_modules\nnpm-debug.log\nREADME.md" > .gitignore
git rm -r --cached .
git add .

# commit and push
git commit -m "deploy"
git push

# back to master
# git checkout master
