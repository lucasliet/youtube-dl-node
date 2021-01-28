"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const server_1 = require("./server");
exports.default = {
    /**
     * Shows Welcome Message and info for usage as json
     * @param request
     * @param response
     */
    welcome: (request, response) => response.json({
        welcome_message: 'Youtube-DL in Node.JS: https://youtube-dl-node.herokuroutes.com/list',
        info: 'send JSON{ "url" : "http://exemple.com" } of the video as POST to https://youtube-dl-node.herokuroutes.com/'
    }),
    /**
     * Given provided url in request body, it uses
     * youtube-dl to download the video as a mp3 file
     * and returns the download url to response json
     * @param request
     * @param response
     */
    downloadMusic: (request, response) => {
        const { url } = request.body;
        const command = 'PATH=./bin:$PATH youtube-dl --extract-audio --audio-format=mp3 --audio-quality=9 -o "output/%(artist)s-%(title)s.%(format)s" ';
        child_process_1.exec(command + url, (err, stdout, stderr) => {
            if (err) {
                response.status(500).json(err);
                console.error(err);
                return;
            }
            const match = stdout.match(/\[ffmpeg\] Destination: (.+.mp3)/);
            if (match) {
                const filename = match[1].replace(/ /g, '%20');
                response.status(200).json({ video_url: `${server_1.baseUrl}/${filename}` });
            }
            else
                response.status(500).json(stdout);
        });
    },
    /**
     * list available files urls to download
     * on response json
     * @param request
     * @param response
     */
    listFiles: (request, response) => {
        fs_1.default.readdir(path_1.default.resolve(__dirname, '..', 'output'), (err, files) => {
            if (err) {
                response.status(500).json(err.message);
                console.error(err);
                return;
            }
            response.json(files.map(file => `${server_1.baseUrl}/output/${file.replace(/ /g, '%20')}`));
        });
    }
};
