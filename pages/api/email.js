const nodemailer = require('nodemailer');
const fetch = require("node-fetch");
import firebaseAdmin from '../../firebaseadmin';

async function sendWeeklyEmail(emailData) {
    console.log("emailData: " + emailData)
    try {
        let d = new Date();
        let month = d.getMonth();
        let day = d.getDate();
        let year = d.getFullYear();
        if(month === 12){
            month = 1;
        } else {
            month += 1;
        }
        if(day <= 7){
            if(month <= 1){
                month = 12
                year -= 1
                day -= 7
            } else {
                month -= 1;
                day -= 7
            }
        } else {
            day -= 7;
        }

        let today = new Date();
        let m = today.getMonth()
        if(m === 12){
            m = 1;
        } else {
            m += 1;
        }
        let da = today.getDate();
        let y = today.getFullYear();
        if(da <= 1){
            if(month <= 1){
                month = 12
                year -= 1
                day -= 1
            } else {
                month -= 1;
                day -= 1
            }
        } else {
            day -= 1;
        }

        const apikey = "lSkLrcuvQ6cLXCzJ30CxggRbpqnZLmMVDFSUereC" || process.env.NEXT_PUBLIC_NASA_API_KEY
        // console.log(apikey)
        const url = "https://api.nasa.gov/planetary/apod?start_date=" + year + "-" + month + "-" + day + "&end_date=" +  y + "-" + m + "-" + da + "&api_key=" + apikey ;
        // console.log(url)
        const nasa = await fetch(url)
        const data = await nasa.json();
        // console.log(data)
        let urls=[]
        let dates=[]
        let titles=[]
        data.map(v => {
            urls.push(v.hdurl)
            dates.push(v.date)
            titles.push(v.title)
        })
        // console.log(dates)
        // console.log(titles)
        // console.log(urls)
        let htmlString = `
        <div style="font-family: 'Source Serif 4', serif; color: #222;">
            <h2>Hello! Here's this week's APoD photos:</h2>        
            <br>
            <img width="300" height="300" src=${urls[0]}>
            <br>
            <p style="color: #222">${dates[0]} - <b>"${titles[0]}"</b></p>
            <br><br>
            <img width="300" height="300" src=${urls[1]}>
            <br>
            <p style="color: #222">${dates[1]} - <b>"${titles[1]}"</b></p>
            <br><br>
            <img width="300" height="300" src=${urls[2]}>
            <br>
            <p style="color: #222">${dates[2]} - <b>"${titles[2]}"</b></p>
            <br><br>
            <img width="300" height="300" src=${urls[3]}>
            <br>
            <p style="color: #222">${dates[3]} - <b>"${titles[3]}"</b></p>
            <br><br>
            <img width="300" height="300" src=${urls[4]}>
            <br>
            <p style="color: #222"${dates[4]} - <b>"${titles[4]}"</b></p>
            <br><br>
            <img width="300" height="300" src=${urls[5]}>
            <br>
            <p style="color: #222">${dates[5]} - <b>"${titles[5]}"</b>}</p>
            <br><br>
            <img width="300" height="300" src=${urls[6]}>
            <br>
            <p style="color: #222">${dates[6]} - <b>"${titles[6]}"</b></p>
            <br><br>
            <h3 style="color: #222">See you next week,</h3>
            <h3 style="color: #222">Karthik</h3>
            <br>
            <p style="color: #222"><a style="color: #3b82f6" href="https://github.com/kach0w">@kach0w</a> | <a style="color: #3b82f6" href="https://apod-email.vercel.app">Website</p>
        </div>
        `
        // const emailList = fetchEmailsFromFirebase(); 
        const gmailPWD = "rxcpxwbitetqvjfi"
        // console.log(emails)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'karsab499@gmail.com',
                pass: gmailPWD,
            }
        });
        let subjectstr = `${m}/${da} Star Gazer Mailing List`
        transporter.sendMail({
            from: 'Karthik Sabhanayakam <karsab499@gmail.com>',
            to: emailData,
            subject: subjectstr ,
            html: htmlString,
        });
    //   console.log('Weekly email sent');
    } catch (error) {
      console.error('Error sending weekly email:', error);
    }
}

export default async function handler(req, res) {
    const db = firebaseAdmin.firestore();
    const snapshot = await db.collection('apod').get();
    const emails = [];
    snapshot.forEach((doc) => {
      emails.push(doc.data().emailInput);
    });
    
    sendWeeklyEmail(emails);
    res.status(200).end('Hello Cron!');
}