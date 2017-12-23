::START /B /wait cmd /C 7z x -y -o"%%~dpI\extract" "%%~fI"
@echo off
for /R "C:\Users\OSF\Documents\Projects\trec\DATA\TREC Disk4\FT\FT943" %%I in (*.Z) do (
START /B /wait cmd /C 7z x -y -o"C:\Users\OSF\Documents\Projects\TopicBinder2\resources\extract\FT943\unparsed" "%%~fI"
)
