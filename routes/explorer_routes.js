var express = require('express'),
router = express.Router(),
path = require("path"),
db = require('./tools/db'),
ejs = require("ejs"),
fs = require('fs-extra'),
SqlString = require('sqlstring'),
querystring = require('querystring'),
Busboy = require('busboy');

var docfolder = process.env.DOCFOLDER;

function ensureAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

function stripPath(pfad){
  return path.normalize(pfad.replace("%2e","").replace("%2F"),"").replace(/^(\.\.(\/|\\|$))+/, '');
};

function whatContent(filePath){
  var folders = [];
  var filez = [];
  //filetype in ejs soon
  icons = {"txt":'far fa-file-alt',
          'pdf':"far fa-file-pdf",
          'mp4':"far fa-file-video",
          'mov':"far fa-file-video",
          'mp3':"far fa-file-audio",
          'wav':"far fa-file-audio",
          'flac':"far fa-file-audio",
          'zip':"far fa-file-archive",
          'csv':"fas fa-file-csv",
          'pptx':"far fa-file-powerpoint",
          'docx':"far fa-file-word",
          'png':"far fa-file-image",
          'jpg':"far fa-file-image",
          'gif':"far fa-file-image",
          'jpeg':"far fa-file-image",
          'xlsm':"far fa-file-excel"
        }

  const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
  }

  const isFolder = folderName => {
    return fs.lstatSync(folderName).isDirectory();
  }
  fs.readdirSync(filePath).forEach(file => {

      if (isFile(path.join(filePath, file)) && file[0] != "."){
        filez.push({'name':file,'path':path.join(filePath, file),'icon':(file.split(".")[file.split(".").length-1] in icons ? icons[file.split(".")[file.split(".").length-1]] : "fas fa-file")});
      }

      if (isFolder(path.join(filePath, file)) && file[0] != "." ){
            folders.push({'name':file,'path':path.join(filePath, file)});
      }
  });

  return [folders,filez];
}

//strip the file from a path
function rmfilefrompath(path){
  var newpath="";
  const elm = path.split("/").slice(1,path.split("/").length-1);
  for (i in elm){
    if (i == elm.length -1){
      newpath +=elm[i]
    }else{
      newpath +=elm[i] +"/"
    }
  }
  return newpath;
}

router.get('/',ensureAuthenticated, function (req, res) {
    if (!req.query.path || req.query.path=="/"){
      var result = whatContent(docfolder);
      var pfad = "";
      var pb=""
    }else{
      var pfad = stripPath(req.query.path);
      var result = whatContent(path.join(docfolder,pfad));
      var pb = rmfilefrompath(pfad);
    }

    res.render('explorer', {title:"Explorer",
                         err:req.flash('error'),
                         msg:req.flash('msg'),
                         user:req.user,
                         folders: result[0],
                         files:result[1],
                         path:pfad,
                         pathback:pb,
                         isauth:req.isAuthenticated()
                       });
});

//post routes
router.post('/actions/newfolder',ensureAuthenticated, function (req, res) {
  const dir=stripPath(path.join(docfolder,req.body.path,req.body.foldername));
  try {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
    }
  } catch (err) {
    console.log(err);
  }
  const query = querystring.stringify({
          "path":req.body.path
      });

  if (req.body.path == "/"){
    res.redirect('/explorer');
  }else{
    res.redirect('/explorer/?'+query);
  }
});

router.post('/actions/renamefolder',ensureAuthenticated, function (req, res) {

  const olddir=stripPath(path.join(docfolder,req.body.path,req.body.oldname));
  const newdir=stripPath(path.join(docfolder,req.body.path,req.body.foldername));

  fs.rename(olddir, newdir, function (err) {
    if (err) throw err;
  });

  const query = querystring.stringify({
          "path":req.body.path
      });

  if (req.body.path == "/"){
    res.redirect('/explorer');
  }else{
    res.redirect('/explorer/?'+query);
  }
});

router.post('/actions/deletefolder',ensureAuthenticated, function (req, res) {
  const dir=stripPath(path.join(docfolder,req.body.path,req.body.name));
  fs.remove(dir, err => {
      if (err) throw err;
  })

  if (req.body.name == "/"){
    res.redirect('/explorer');
  }else{
    res.redirect('/explorer/?path='+req.body.path);
  }

});

router.post('/actions/deletefile',ensureAuthenticated, function (req, res) {
  const dir=stripPath(path.join(docfolder,req.body.path));
  fs.remove(dir, err => {
    if (err) throw err;
  })

  if (req.body.name == "/"){
    res.redirect('/explorer');
  }else{
    res.redirect('/explorer/?path='+rmfilefrompath(req.body.path));
  }

});

router.post('/actions/renamefile',ensureAuthenticated, function (req, res) {
  const olddir=stripPath(path.join(docfolder,req.body.path,req.body.oldname));
  const newdir=stripPath(path.join(docfolder,req.body.path,req.body.filename));

  fs.rename(olddir, newdir, function (err) {
    if (err) throw err;
  });

  const query = querystring.stringify({
          "path":req.body.path
      });

  if (req.body.path == "/"){
    res.redirect('/explorer');
  }else{
    res.redirect('/explorer/?'+query);
  }
});

router.post('/actions/upload', ensureAuthenticated, function(req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    var saveTo = function(path){return fs.existsSync(path) ?  path+"1" : path;}
    file.pipe(fs.createWriteStream(saveTo(path.join(docfolder,req.query.path,filename))));

  });
  busboy.on('finish', function() {
    if (req.query.path == "/"){
      res.redirect('/explorer');
    }else{
      res.redirect('/explorer/?path='+req.query.path);
    }
  });
  return req.pipe(busboy);
});

//export router
module.exports = router;
