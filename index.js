const Discord = require('discord.js');
const client = new Discord.Client();
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const fs = require('fs');

// Ex: node customsearch.js
//      "Google Node.js"
//      "API KEY"
//      "CUSTOM ENGINE ID"

async function runSample(options) {
  //console.log(options);
  const res = await customsearch.cse.list({
    cx: options.cx,
    q: options.q,
    auth: options.apiKey,
    searchType: options.searchType,
  });
  //console.log(res.data);
  return res.data;
}

async function sendMessage(message, options){
    var data  = await runSample(options).catch(console.error);
    //var stringdata = JSON.stringify(data);
    message.channel.send(data.items === undefined? "No Results": data.items[Math.floor(Math.random()*data.items.length)].link);
}

/*function readFossilList(){
    var info;
    fs.readFile('fossils.txt', (err, data) => { 
        if (err) console.err;
        info =  data.toString();
        console.log("A:"+data.toString());
    });
    return info;
}*/

function matchNumberToName(num, list){
    names = list.split(' ');
    var loc = list.indexOf(num + ")");
    name = names[loc+1]+" "+names[loc+2];
    return name;
}

if (module === require.main) {
  // You can get a custom search engine id at
  // https://www.google.com/cse/create/new

   
    client.on('ready', () => {
        console.log('Client is ready.');
        //console.log(readFossilList());
    });
    
    client.on("message", function(message) {
        console.log(message.content);
        if(str.includes("!ask")){
            var str = message.content;
            sendMessage(message, {  
                q: str.replace("!ask "+message.content, matchNumberToName(parseInt(message.content,10), readFossilList())),
                searchType: 'image',
            }).catch(console.err);
        }
        
        if(str.includes("!list")){
            fs.readFile('fossils.txt', (err, data) => { 
                if (err) console.err; 
                console.log(data.toString().length);
                message.channel.send("```"+data.toString().split('#')[0]+"```"); 
                message.channel.send("```"+data.toString().split('#')[1]+"```");
            }) 
        }
    });
    
}


module.exports = {
  runSample,
};