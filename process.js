const http = require('https');
const fs = require('fs');

const httpGet = url => {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
            res.setEncoding('utf8');
            let body = ''; 
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve(body);
            });
        }).on('error', reject);
    });
};

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
function capitalizeAfterUnderscore(str) {
    str = str.split('');
    str[str.indexOf('_') + 1] = str[str.indexOf('_') + 1].toUpperCase();
    return str
}

var foo = (myStr) =>
  new Promise((resolve, reject) => {
    let attempts = 5;
    let modfified = myStr.replace('ic_fluent_','').replace('_filled','');

    while (modfified.includes("_") && attempts !== 0) {
        modfified = capitalize(capitalizeAfterUnderscore(modfified).join('').replace('_', ''));
        attempts--;
    }
    resolve(modfified);
});

httpGet("https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/fonts/FluentSystemIcons-Filled.json").then(jsonObject => {
    let final = JSON.parse(jsonObject);
    Object.keys(final).forEach(k => {
        foo(k).then(result => {
            let content = result+': '+final[k];
            content += "\n";
            fs.appendFile("processed.txt", content, (err) => {
                if (err) console.log(err);
            });
        });
    });
});