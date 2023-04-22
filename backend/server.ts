const express = require("express");

const PORT: number = 3001;

type URLInfo = {
    long: string;
    accessCount: number;
};
let urlMap: {[short: string]: URLInfo} = {};

function randomString(): string {
    // Get a random 6 character string
    // 62^6 = 56.8 billion possible strings
    const STR_LEN: number = 6;
    const CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const CHARS_LEN: number = CHARS.length;

    let res = '';
    for (let i = 0; i < STR_LEN; i++) {
      res += CHARS.charAt(Math.floor(Math.random() * CHARS_LEN));
    }

    return res;
}

const app = express();
app.use(express.json());

var api_router = express.Router();
app.use('/api', api_router);

api_router.route('/list').get((req, res) => {
    let URLsList: string[] = [];
    for (const [short, info] of Object.entries(urlMap)) {
        URLsList.push(`${info.long}: ${short}  ${info.accessCount} visits`);
    }
    res.status(200).json({URLsList});
});

function parseURL(rawURL: string): string {
    // Add http:// to the beginning of URLs if they don't have a protocol
    const DEFAULT_PROTOCAL: string = "http://";

    try {
        new URL(rawURL);
        return rawURL;
    } catch(error) {}

    const URLWithProtocal: string = DEFAULT_PROTOCAL + rawURL;
    try {
        new URL(URLWithProtocal);
        return URLWithProtocal;
    }  catch(error) {}

    return "";
}

api_router.route('/url').post((req, res) => {
    let longURL: string = req.body?.url;
    if (!longURL) {
        return res.status(400).json({ message: "URL was empty"});
    }

    longURL = parseURL(longURL);
    if (!longURL) {
        return res.status(400).json({ message: "URL was invalid"});
    }

    let shortURL: string = randomString();
    // very unlikely, but ensure we don't randomly generate the same
    // shortURL twice
    while (shortURL in urlMap) {
        shortURL = randomString();
    }
    urlMap[shortURL] = {long: longURL, accessCount: 0};

    res.status(201).send({ shortURL, longURL });
});

api_router.route('/url').delete((req, res) => {
    const shortURL: string = req.body?.url;
    if (!shortURL) {
        return res.status(400).json({ message: "URL was empty"});
    }

    if (!(shortURL in urlMap)) {
        return res.status(400).json({ message: `No known long URL for ${shortURL}`});
    }

    delete urlMap[shortURL];
    return res.status(200).send();
});

app.get("/:ShortURL", (req, res) => {
    const shortURL: string = req.params["ShortURL"];
    const info: URLInfo = urlMap[shortURL];
    const longURL: string = info?.long;
    if (!longURL) {
        return res.status(400).json({ message: `No known long URL for ${shortURL}`});
    }

    info.accessCount++;
    return res.redirect(302, longURL);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});