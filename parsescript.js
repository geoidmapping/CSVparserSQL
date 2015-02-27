var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var csv = require('fast-csv');
var db;
var csvdata =[];
var agency1=[];
var timeperiods1 = [];
db = new sqlite3.Database('complete.db');  

var stream = fs.createReadStream("dronedata.csv");
 
csv.fromStream(stream, {headers : true})
 .on("data", function(data){
    csvdata.push(data);
     console.log(data);
 })
 .on("end", function(){
    
     console.log("done");
    
    db.serialize(function() {
        
        db.run("CREATE TABLE timeperiod (info TEXT)");
        db.run("CREATE TABLE tribalagency (info TEXT)");
        
        
        db.run("CREATE TABLE drone (strike TEXT, dateDAY INTEGER, dateMONTH INTEGER, dateYEAR INTEGER, tribe TEXT, location TEXT, lat REAL, long REAL, timeperiod TEXT)");
        var stmt = db.prepare("INSERT INTO drone VALUES (?,?,?,?,?,?,?,?,?)");
        
        for (var i = 0; i < csvdata.length; i++) {
                        
            var dateit = csvdata[i].Date.split("/");
            checkArray(agency1, csvdata[i].TribalAgency)
            checkArray(timeperiods1, csvdata[i].TimePeriod)
            
            stmt.run(csvdata[i].Strike, dateit[0], dateit[1], dateit[2], csvdata[i].TribalAgency, csvdata[i].Location, csvdata[i].Latitude, csvdata[i].Longitude, csvdata[i].TimePeriod);
  
        }
        
        var stmt2 = db.prepare("INSERT INTO timeperiod VALUES (?)");
         for (var i = 0; i < timeperiods1.length; i++) {
            stmt2.run(timeperiods1[i]);
         }
        stmt2.finalize();
        
        var stmt3 = db.prepare("INSERT INTO tribalagency VALUES (?)");
         for (var i = 0; i < agency1.length; i++) {
            stmt3.run(agency1[i]);
         }
        stmt3.finalize();
        
        
    stmt.finalize();
 /*
  db.each("SELECT rowid AS id, info FROM drone", function(err, row) {
      console.log(row.id + ": " + row.info);
  });*/
});
 
    db.close();

    console.log(csvdata.length);
 });


function checkArray(newarray, tocheck)
{
    if(newarray.indexOf(tocheck) == -1)
    {
	   newarray.push(tocheck);
	   console.log(tocheck);
    }
    else
    {
	   console.log("We've already got a " + tocheck);
	   console.log(tocheck);
    }
}







 

