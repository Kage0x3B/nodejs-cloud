# Nodejs Cloud

Store all your files on your nodejs Server. 

![nodejscloud](https://user-images.githubusercontent.com/49984289/61997375-129ccd00-b0a1-11e9-823d-41bf7ffffc5d.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

The authentication runs via passport and a MySQL Database. To install nodejs-cloud you need to create a Database and dump the adminuser.sql file in the db. Login with admin:admin

```
mysql -u username -p:
CREATE DATABASE databasename;
exit
mysql -u username -p databasename < adminuser.sql
```

### Installing

Follow these Steps to get your node app on Port 3000 running:

```
git clone https://github.com/flowluap/nodejs-cloud
cd nodejs-cloud
npm install
```

## Running the first test

Docfolder is the envoirement variable, that sets the path to the directory where all your files are saved

```
DOCFOLDER="/path/to/starage/directory" node app.js
```

## Authors

* **Paul Wolf** - *Initial work* - 

See also the list of [contributors](https://github.com/flowluap/nodejs-cloud/contributors) who participated in this project.

