@echo off
echo Installation des dependances...
npm install

echo Build et publication...
set GH_TOKEN=%1
npm run publish

echo Termine!