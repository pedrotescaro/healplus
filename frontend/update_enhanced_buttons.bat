@echo off
echo Atualizando enhanced-buttons.js nos arquivos HTML...

cd html

for %%f in (*.html) do (
    echo Atualizando %%f...
    powershell -Command "(Get-Content '%%f') -replace '<script src=\"../js/button-handler.js\"></script>', '<script src=\"../js/button-handler.js\"></script>`n    <script src=\"../js/enhanced-buttons.js\"></script>' | Set-Content '%%f'"
)

echo Enhanced buttons atualizado com sucesso!
pause
