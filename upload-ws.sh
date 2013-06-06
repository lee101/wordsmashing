#!/bin/bash
rm -rf ../wordsmashinglive
mkdir ../wordsmashinglive
cp -rf * ../wordsmashinglive 
cd ../wordsmashinglive

rm js/ws-min.js
rm js/temp.js
java -jar yuicompressor-2.4.7.jar js/jquery-1.9.1.min.js -o js/temp.js --charset utf-8
cat js/temp.js >> js/ws-min.js
java -jar yuicompressor-2.4.7.jar js/jquery.blockUI.js -o js/temp.js --charset utf-8
cat js/temp.js >> js/ws-min.js
java -jar yuicompressor-2.4.7.jar js/wordutils.js -o js/temp.js --charset utf-8
cat js/temp.js >> js/ws-min.js
java -jar yuicompressor-2.4.7.jar js/game.js -o js/temp.js --charset utf-8
cat js/temp.js >> js/ws-min.js

rm js/temp.js
cp -f js/ws-min.js ../wordsmashing/js/ws-min.js 

java -jar yuicompressor-2.4.7.jar css/bootstrap.css -o css/ws-min.css --charset utf-8
java -jar yuicompressor-2.4.7.jar css/main.css -o css/temp.css --charset utf-8
cat css/temp.css >> css/ws-min.css

rm css/temp.css
cp -f css/ws-min.css ../wordsmashing/css/ws-min.css

python ./uploadhelper.py

#cat js/temp.js >> js/ws-mi
appcfg.py update --secure .

