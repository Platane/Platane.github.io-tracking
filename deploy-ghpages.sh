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
git checkout -- ./gitignore
git rm -r --cached .
git add .

# commit and push
git commit -m "deploy"
git push

# back to master
git checkout master
