
import cors from 'cors'
import temp from 'fs-temp'
import ytdl from 'ytdl-core';
import fs from 'fs'
import express from 'express'
import morgan from 'morgan'

import 'dotenv/config'



let app = express();
import formattFile from './utils/formattingFileName.js';
import { env } from 'process';

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/downloadSucces/:fileName',(req,res)=>{
    let {fileName} = req.params
    console.log(fileName,"Este es en downloadSucces")

    fileDir = `${process.env.USERPROFILE}/Downloads/${fileName}.mp3`

    res.attachment(fileName)
    res.download(fileDir)
})

app.get('/infoVideo',async (req,res)=>{
    let {urlVideo} = req.query

    let info = await ytdl.getInfo(urlVideo);
    //let fileName = formattFile(info.videoDetails.title)
    console.log(info.videoDetails)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    res.json(info.videoDetails)
})

app.get('/generateLink/mp3',async (req,res) => {
    try{
        let {urlVideo} = req.query

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        ytdl(urlVideo,{filter:'audioonly',quality:'highestaudio'})
        .on('data',(chunk) => {
            console.log(chunk.toString('utf8'))
            //file += chunk
            res.write(chunk)
        })
        .on('end',()=>{
            res.end('Terminated')
            //res.status(200).json({"fileName":fileName,"lenghtFile":lenghtFile})
            //res.status(200).json({})
        })
        //.pipe(fs.createWriteStream(`${process.env.USERPROFILE}/Downloads/${fileName}.mp3`))
        //.on("finish",()=>{
        //        fileDir = `${process.env.USERPROFILE}/Downloads/${fileName}.mp3`
        //        //res.download(fileDir)
        //    })
    }catch(err){
        res.send(err)
    }
})

app.get('/generateLink/Mp4',async (req,res) =>{
    try{
        let {urlVideo,quality} = req.query
        let qualityReal;

        
        console.log(quality)

        switch (quality) {
            case '1080p':
                qualityReal = '137'
                break;
            case '7020p':
                qualityReal = '136'
                break;
            case '135p':
                qualityReal = '137'
                break;
            default:
                break;
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        ytdl(urlVideo,{filter: (format) => format.quality = 'hd720'})
        .on('data',(chunk)=>{
            console.log(chunk,'utf-8')
            res.write(chunk)
        })
        .on('end',()=>{
            console.log('Video Download')
            res.end('Donwloand')
        })
    }catch(err){
        res.send(err)
    }
})

app.listen(process.env.PORT,()=>{
    console.log('Server running in port',process.env.PORT)
})