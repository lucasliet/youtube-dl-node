import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { baseUrl, port } from './server';

export default {

  welcome: (request: Request, response: Response) => response.json({
    welcome_message: 'Youtube-DL in Node.JS: https://youtube-dl-node.herokuroutes.com/list'
  }),

  downloadMusic: (request: Request, response: Response) => {

    const { url } = request.body;
    const command = 'PATH=./bin:$PATH youtube-dl --extract-audio --audio-format=mp3 --audio-quality=9 -o "output/%(artist)s-%(title)s.%(format)s" ';

    exec(command + url, (err, stdout, stderr) => {
      if (err) {
        response.status(500).json(err);
        console.error(err);
        return;
      }

      const match: RegExpMatchArray | null = stdout.match(/\[ffmpeg\] Destination: (.+.mp3)/);

      if (match) {
        const filename: string = match[1].replace(/ /g, '%20');
        response.status(200).json({ video_url: `${baseUrl}:${port}/${filename}` });
      }
      else response.status(500).json(stdout);
    });

  },

  listFiles: (request: Request, response: Response) => {

    fs.readdir(path.resolve(__dirname, '..', 'output'),
      (err, files) => {
        if (err) {
          response.status(500).json(err.message);
          console.error(err);
          return;
        }
        response.json(
          files.map(file => `${baseUrl}:${port}/output/${file.replace(/ /g, '%20')}`)
        );
      }
    );

  }

}