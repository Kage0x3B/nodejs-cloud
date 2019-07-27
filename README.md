//get node ready
git clone https://github.com/flowluap/nodejs-cloud
cd nodejs-cloud
npm install

//prepare the database
mysql -u username -p:
CREATE DATABASE databasename;
exit
mysql -u username -p databasename < adminuser.sql

//run the server
Run with  DOCFOLDER="/path/to/starage/directory" node app.js
