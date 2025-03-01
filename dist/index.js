"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.dping = exports.webserver = exports.ping = void 0;
const axios = require('axios');
const express = require('express');
const WebhookClient = require('discord.js').WebhookClient;
const app = express();
app.use(express.static("public"));
/**
 * Copyright (c) 2022, Kieran Schuler (picturebooks // kieran@kie.ac)
 *
 * https://github.com/picturebooks/pinger.ts
 *
 * This code is subject to the BSD 3-Clause "New" or "Revised" License authored by Regents of the University of California.
 * Information about this license can be found in the LICENSE.md file.
 
 * Ping a website
 * @param {website} The website to ping
 * @param {interval} The interval per ping (in milli-seconds)
 * @param {logging} Enable logging
 * @param {flipDM} Flip the month/day to day/month in the log
 * @param {noURLFix} If you're pinging a non-http/https url, set this to true
 * @example
 * const pinger = require("pinger.ts")
 * pinger.ping("kie.ac", 60000, true)
 *
 * Start a webserver
 * @param {port} The port in which you want the webserver to run on
 * @param {content} The content to display on the page, if no content is provided, it will be autofilled.
 * @param {flipDM} Flip the date and the month to other formats (American & British)
 * @example
 * const pinger= require("pinger.ts")
 * pinger.webserver(9005, "Welcome!", true)
 *
 */
const ping = async function (url, interval = 30000, logging = true, flipDM = false, noURLFix = false) {
    let count = 1;
    if (!interval)
        interval = 30000;
    if (!url)
        return console.log(`[🏓 pinger.ts] You must specify a URL.`);
    if (!url.startsWith('http://') && !url.startsWith('https://') && !noURLFix) {
        url = `https://${url}`;
    }
    if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
        return console.log(`[🏓 pinger.ts] You must specify a valid URL.`);
    }
    if (logging == true) {
        console.log(`[🏓 pinger.ts] Currently logging pings for ${url} with the interval ${interval}.`);
    }
    function URLValidity(string) {
        try {
            new URL(string);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    const ps = (t) => `${t}`.padStart(2, '0');
    const dm = (m, d) => flipDM ? `${ps(d)}/${ps(m)}` : `${ps(m)}/${ps(d)}`;
    return setInterval(async () => {
        const d = new Date();
        await axios.get(url, {
            headers: {
                'User-Agent': 'npmjs.org/pinger.ts'
            },
        })
            .catch(e => console.log(`[🏓 pinger.ts] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e));
        if (logging === true) {
            console.log(`[🏓 pinger.ts] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged ${url} -> Ping #${count}`);
        }
        ;
        count++;
    }, interval);
};
exports.ping = ping;
const webserver = async function (port, content, flipDM = false) {
    app.get('*', (req, res) => {
        if (!content) {
            res.json('[🏓 pinger.ts] Actively listening for requests. If logging is enabled, check your terminal.');
        }
        else {
            res.send(content);
        }
    });
    const listener = app.listen(port, () => {
        const d = new Date();
        const ps = t => `${t}`.padStart(2, '0');
        const dm = (m, d) => flipDM ? `${ps(d)}/${ps(m)}` : `${ps(m)}/${ps(d)}`;
        console.log(`[🏓 pinger.ts] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Webserver listening on port ${port}`);
    });
};
exports.webserver = webserver;
const dping = async function (webhooktoken, webhookid, url, interval, flipDM = false, noURLFix = false) {
    let count = 1;
    if (!webhooktoken)
        return console.log(`[🏓 pinger.ts] You must specify a webhook token. If you don't want Discord logging, use the .ping method.`);
    if (!webhookid)
        return console.log(`[🏓 pinger.ts] You must specify a webhook id. If you don't want Discord logging, use the .ping method.`);
    if (!interval)
        interval = 30000;
    if (!url)
        return console.log(`[🏓 pinger.ts] You must specify a URL.`);
    if (interval < 10000)
        return console.log(`[🏓 pinger.ts] Due to Discord's API rate limiting, you cannot send more than one request in under 10 seconds. Try using an interval of 10000 or more.`);
    if (!url.startsWith('http://') && !url.startsWith('https://') && !noURLFix) {
        url = `https://${url}`;
    }
    if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
        return console.log(`[🏓 pinger.ts] You must specify a valid URL.`);
    }
    console.log(`[🏓 pinger.ts] Currently logging pings for ${url} with the interval ${interval}. Please check your Discord channel connected to the webhook.`);
    function URLValidity(string) {
        try {
            new URL(string);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    const ps = t => `${t}`.padStart(2, '0');
    const dm = (m, d) => flipDM ? `${ps(d)}/${ps(m)}` : `${ps(m)}/${ps(d)}`;
    return setInterval(async () => {
        const d = new Date();
        await axios.get(url, {
            headers: {
                'User-Agent': 'npmjs.org/pinger.ts'
            },
        })
            .catch(e => console.log(`[🏓 pinger.ts] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e));
        const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });
        webhookClient.send({
            content: `[🏓 pinger.ts] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged <${url}> -> Ping #${count}`,
            username: 'pinger.ts Logging'
        });
        count++;
    }, interval);
};
exports.dping = dping;
class Group {
    constructor(name = "Pinger Group") {
        this.pingers = new Map();
        this.name = name;
    }
    startAll() {
        this.pingers.forEach(ping => { if (!ping.started) {
            ping.start();
        } });
    }
    ;
    add(url, interval, logging = true, flipDM = false, noURLFix = false) {
        const id = this.pingers.size + 1;
        let ping = {
            name: null,
            id,
            config: { url, interval, logging, flipDM, noURLFix },
            ping: async function (url, interval, logging = true, flipDM = false, noURLFix = false) {
                let count = 1;
                const pf = `[🏓 pinger.ts] [${this.name}] [${this.id}]`;
                if (!interval)
                    interval = 30000;
                if (!url)
                    return console.log(`${pf} You must specify a URL.`);
                if (!url.startsWith('http://') && !url.startsWith('https://') && !noURLFix) {
                    url = `https://${url}`;
                }
                if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
                    return console.log(`${pf} You must specify a valid URL.`);
                }
                if (logging == true) {
                    console.log(`${pf} Currently logging pings for ${url} with the interval ${interval}.`);
                }
                function URLValidity(string) {
                    try {
                        new URL(string);
                    }
                    catch (_a) {
                        return false;
                    }
                    return true;
                }
                const ps = t => `${t}`.padStart(2, '0');
                const dm = (m, d) => flipDM ? `${ps(d)}/${ps(m)}` : `${ps(m)}/${ps(d)}`;
                return setInterval(async () => {
                    await axios.get(url, {
                        headers: {
                            'User-Agent': 'pinger.ts'
                        },
                    })
                        .catch(e => {
                        const d = new Date();
                        console.log(`${pf} [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e);
                    });
                    if (logging === true) {
                        const d = new Date();
                        console.log(`${pf} [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged ${url} -> Ping #${count}`);
                    }
                    ;
                    count++;
                }, interval);
            },
            interval: null,
            stop: null,
            started: false,
            start: null
        };
        ping.name = this.name;
        ping.start = () => {
            const tp = ping.ping(ping.config.url, ping.config.interval, ping.config.logging, ping.config.flipDM, ping.config.noURLFix);
            if (!tp) {
                return;
            }
            ping.interval = tp;
            ping.stop = () => {
                clearInterval(ping.interval);
                if (ping.config.logging) {
                    console.log();
                }
            };
            ping.started = true;
        };
        console.log(`[🏓 pinger.ts] [${ping.name}] Added pinger for ${ping.config.url} into group.`);
        this.pingers.set(id, ping);
        return ping;
    }
    ;
    addStart(url, interval, logging = true, flipDM = false, noURLFix = false) {
        this.add(url, interval, logging, flipDM, noURLFix).start();
    }
    ;
    stop(id = undefined) {
        if (id) {
            if (this.pingers.has(id) && this.pingers.get(id).started) {
                this.pingers.get(id).stop();
            }
        }
        else {
            this.pingers.forEach(ping => { if (ping.started) {
                ping.stop();
            } });
        }
    }
    ;
}
exports.Group = Group;
;
