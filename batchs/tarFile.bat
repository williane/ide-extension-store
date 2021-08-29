@ECHO ON
C:
ECHO cd \%1 >>C:\Repositorios\teste.log
cd \%1
ECHO tar -cf %2.tar * >>C:\Repositorios\teste.log
tar -cf %2.tar *
ECHO copy %2.tar %3\toserver >>C:\Repositorios\teste.log
copy %2.tar %3\toserver