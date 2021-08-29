@ECHO off
C:
ECHO cd \%1 > C:\Repositorios\teste.log
cd \%1
git pull https://Williane.Marques:mqfleirxkzsx2g3zsujksp5jciexirbmdqxtyk2pvcdnymmvoifa@%2
git branch develop
git checkout develop
git pull https://Williane.Marques:mqfleirxkzsx2g3zsujksp5jciexirbmdqxtyk2pvcdnymmvoifa@%2 develop



