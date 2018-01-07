::START /B /wait cmd /C mongo mongodb://heroku_bwcmzm1p:dumch6k7cjom726boh401mm5m7@ds153719.mlab.com:53719/heroku_bwcmzm1p "%loadjs%"
::START /B /wait cmd /C db.dokumanlar.update({document_id:"%%~nI"},{"document_path":"%%~dpI"},{"upsert":true});
::set _temp=%%~dpI
::set _result=%_temp:\=\\%
::@echo docs.push({"document_id":"%%~nI","document_path":"%_result%"^}^)^;>>%loadjs%
::@echo db.dokumanlar.insertMany(docs,{^}^)^;>>%loadjs%
::set endof=)
::set loadjs=D:\Projects\topicbinder\resources\load.js
::copy /y nul %loadjs%
::@echo var docs=[]^;>>%loadjs%
@echo off
set root=D:\Projects\topicbinder\resources\extract\FBIS
cd %root%
for /R "%root%" %%I in (*) do (
copy %%~nI temp.js
@echo ^<ROOT^>>%%~nI
@type temp.js >> %%~nI
@echo ^</ROOT^>>>%%~nI
)
@del temp.js



