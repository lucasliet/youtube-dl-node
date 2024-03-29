import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { baseUrl } from './server';

export default {
  /**
   * Given provided url in request body, it uses
   * youtube-dl to download the video as a mp3 file
   * and returns the download url to response json
   * @param request 
   * @param response 
   */
  downloadMusic: (request: Request, response: Response) => {

    const { url } = request.query;

    if (!url) return response.json({
      welcome_message: `Youtube-DL in Node.JS: ${baseUrl}/list`,
      usage: `${baseUrl}?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
    });

    const command = 'PATH=./bin:$PATH youtube-dl --extract-audio --audio-format=mp3 --audio-quality=9 --embed-thumbnail --add-metadata "ytsearch:%(artist) %(title)" -o "output/%(artist)s-%(title)s.%(format)s" ';

    exec(command + url, (err, stdout, stderr) => {
      if (err) {
        response.status(500).json(err);
        console.error(err);
        return;
      }

      const match: RegExpMatchArray | null = stdout.match(/\[ffmpeg\] Destination: (.+.mp3)/);

      if (match) {
        const filename: string = match[1].replace(/ /g, '%20');
        response.status(200).json({ video_url: `${baseUrl}/${filename}` });
      }
      else response.status(500).json(stdout);
    });

  },

  /**
   * list available files urls to download
   * on response json
   * @param request 
   * @param response 
   */
  listFiles: (request: Request, response: Response) => {

    fs.readdir(path.resolve(__dirname, '..', 'output'),
      (err, files) => {
        if (err) {
          response.status(500).json(err.message);
          console.error(err);
          return;
        }
        response.json(
          files.map(file => `${baseUrl}/output/${file.replace(/ /g, '%20')}`)
        );
      }
    );

  }

}
