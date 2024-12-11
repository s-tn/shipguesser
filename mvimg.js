import * as fs from 'fs';

/*for (var file of fs.readdirSync('./public/shipimg_upper')) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
        console.log(file, `./public/shipimg/${file.toLowerCase()}`)
        fs.writeFileSync(`./public/shipimg/${file.toLowerCase().replace('.jpeg', '.jpg')}`, fs.readFileSync(`./public/shipimg_upper/${file}`));
    }
}*/

for (var file of fs.readdirSync('./public/faction_upper')) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
        console.log(file, `./public/faction/${file.toLowerCase()}`)
        fs.writeFileSync(`./public/faction/${file.toLowerCase().replace('.jpeg', '.jpg').replace(' ', '_')}`, fs.readFileSync(`./public/faction_upper/${file}`));
    }
}