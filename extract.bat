::START /B /wait cmd /C 7z x -y -o"%%~dpI\extract" "%%~fI"
@echo off
for /R "D:\Projects\topicbinder\resources\TREC Disk5\FBIS" %%I in (*.Z) do (
START /B /wait cmd /C 7z x -y -o"D:\Projects\topicbinder\resources\extract\FBIS" "%%~fI"
)
