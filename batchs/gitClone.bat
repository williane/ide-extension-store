@ECHO ON
C:
ECHO cd \Repositorios >> C:\Repositorios\teste.log
cd \Repositorios
git clone https://Williane.Marques:mqfleirxkzsx2g3zsujksp5jciexirbmdqxtyk2pvcdnymmvoifa@%1
ECHO cd \%2 >> C:\Repositorios\teste.log
cd \%2
git branch develop
git checkout develop




