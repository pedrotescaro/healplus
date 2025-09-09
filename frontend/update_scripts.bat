@echo off
echo Atualizando scripts nos arquivos HTML...

cd html

for %%f in (*.html) do (
    echo Atualizando %%f...
    powershell -Command "(Get-Content '%%f') -replace '<script src=\"../js/theme-manager.js\"></script>', '<script src=\"../js/theme-manager.js\"></script>`n    <script src=\"../js/button-handler.js\"></script>`n    <script src=\"../js/main.js\"></script>' | Set-Content '%%f'"
)

echo Scripts atualizados com sucesso!
pause
