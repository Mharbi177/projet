git rm -r --cached node_modules
git add .
git commit -m "Tasnim interactive letter"
git branch -M main
git remote remove origin
git remote add origin https://github.com/Mharbi177/projet.git
git push -u origin main
