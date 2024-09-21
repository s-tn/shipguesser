const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';
const key = "2afb7f24669427b0e4919361a158f5587a3a80b46099582b03a46d64b46bc3d4"
const iv = "fdb01e7bc91566ba603f1e46c7f72904"

console.log(key, iv)

let json = JSON.parse(fs.readFileSync('./data.json', 'utf-8').toLowerCase());

json.forEach((item) => {
    if (item.special == 'none') return item.special = [];
    item.special = item.special.split(', ').map((special) => special.trim());
})

json.forEach((item) => {
    if (item.weapon == 'none') return item.weapon = [];
    item.weapon = item.weapon.split(', ').map((weapon) => weapon.trim().toLowerCase());
})

json.forEach((item) => {
    if (item.tank == 'none') return item.tank = [];
    item.tank = item.tank.split(', ').map((tank) => tank.trim().toLowerCase());
})

let data = Buffer.from(JSON.stringify(json).toLowerCase(), 'utf-8');

while (data.length % 16 !== 0) {
    data = Buffer.concat([data, Buffer.from(' ')]);
}

const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
let encrypted = cipher.update(data, 'utf8', 'base64');
encrypted += cipher.final('base64');

console.log(crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex')).update(Buffer.from(encrypted, 'base64')).toString('utf-8'))

fs.writeFileSync('./public/final.css', encrypted);