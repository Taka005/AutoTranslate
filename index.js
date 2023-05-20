const fetch = require("node-fetch");
const async = require("async");
const fs = require("fs");
const ja = require("./ja.json");
const en = require("./en.json");

async function run(){
  await async.map(Object.keys(ja),async(key)=>{   
    if(typeof ja[key] === "string"){
      const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&dj=1&q=${encodeURIComponent(ja[key])}`)
        .then(res=>res.json());

      const trans = data.sentences.map((sentence)=>{
        return sentence.trans;
      });
      en[key] = trans[0];
    }else if(typeof ja[key] === "object"){
      await async.map(Object.keys(ja[key]),async(key2)=>{   
        await async.map(Object.keys(ja[key][key2]),async(key3)=>{   
          if(typeof ja[key][key2][key3] === "string"){
            const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&dj=1&q=${encodeURIComponent(ja[key][key2][key3])}`)
              .then(res=>res.json());
    
            const trans = data.sentences.map((sentence)=>{
              return sentence.trans;
            });
            en[key][key2][key3] = trans[0];
          }else{
            en[key][key2][key3] = ja[key][key2][key3];
          }
        });
      });
    }
  });

  fs.writeFileSync("ja.json",JSON.stringify(ja,null,"    "));
  fs.writeFileSync("en.json",JSON.stringify(en,null,"    "));
}

run()