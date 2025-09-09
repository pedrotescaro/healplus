@echo off
echo Atualizando referencias nos arquivos HTML...

cd html

for %%f in (*.html) do (
    echo Atualizando %%f...
    powershell -Command "(Get-Content '%%f') -replace 'href=\"css/', 'href=\"../css/' | Set-Content '%%f'"
    powershell -Command "(Get-Content '%%f') -replace 'src=\"js/', 'src=\"../js/' | Set-Content '%%f'"
)

echo Referencias atualizadas com sucesso!
pause
