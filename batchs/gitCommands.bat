@ECHO ON
C:
ECHO cd \%1 >>C:\Repositorios\teste.log
cd \%1
rmdir %5 /S/Q
git branch %3
git checkout %3
git add .
git commit -m %2
git push https://Williane.Marques:mqfleirxkzsx2g3zsujksp5jciexirbmdqxtyk2pvcdnymmvoifa@%4 --all