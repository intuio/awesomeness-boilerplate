#!/bin/bash

clear

# Project name variable must be the same as your main project folder
P="PROJECTNAME"

# Run the build script
echo ""
echo "Building..."
echo "----------------"
node r.js -o $P/js/app.build.js
echo "Done."
echo ""

# Remove all unneccessary files
echo "Cleaning up..."
echo "----------------"
echo ""

rm -Rf the-build/.DS_Store 
rm -Rf the-build/build.txt 
rm -Rf the-build/.sass-cache 
rm -Rf the-build/sass 
rm -Rf the-build/config.rb 
rm -Rf the-build/codekit-config.json
rm -Rf the-build/js/app.build.js 
rm -Rf the-build/js/imports
rm -Rf the-build/js/imports/*-ck.js
rm -Rf the-build/js/imports/*-tn.js
rm -Rf the-build/js/*-ck.js
rm -Rf the-build/js/*-tn.js 
rm -Rf the-build/html/imports 
rm -Rf the-build/html/*.tmpl.html 
rm -Rf the-build/html/README-anna.txt 
rm -Rf the-build/html/anna.rb

echo "Done. Bye."
echo ""