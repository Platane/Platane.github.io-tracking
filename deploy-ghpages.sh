#!/bin/bash

# stash and change branch to gh-pages
git stash
git checkout gh-pages
git pull

# grab the lastest files from master
git checkout master -- .

# build
rm -rf ./front-dist/*
npm install

# copy dist files to root dir
cp ./front-dist/* ./
cp ./front-src/index.html ./

# keep ignoring files
# /!\ please do it
git checkout gh-pages -- ./gitignore
git checkout gh-pages -- ./gitignore
git checkout gh-pages -- ./gitignore
git rm -r --cached .
# /!\ can't do git add . here because the .sh script is running, 
#   it will fail with no permission as the file is locked
#   let's add everything but the .sh script
git add ./*.js
git add ./*.html
git add ./.gitignore
git add ./README.md
git add ./package.json

# commit and push
git commit -m "deploy"
git push

# back to master
git checkout master
