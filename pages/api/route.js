const nodemailer = require('nodemailer')
export default async function handler(req, res) {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let year = d.getFullYear();
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
    let m = today.getMonth() + 1
    let da = today.getDate() - 1;
    let y = today.getFullYear();

    const apikey = process.env.NEXT_PUBLIC_NASA_API_KEY
    const url = "https://api.nasa.gov/planetary/apod?start_date=" + year + "-" + month + "-" + day + "&end_date=" +  y + "-" + m + "-" + da + "&api_key=" + apikey ;
    console.log(url)
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
        <p style="color: #222">${dates[0]} - <b>${titles[0]}</b></p>
        <br><br>
        <img width="300" height="300" src=${urls[1]}>
        <br>
        <p style="color: #222">${dates[1]} - <b>${titles[1]}</b></p>
        <br><br>
        <img width="300" height="300" src=${urls[2]}>
        <br>
        <p style="color: #222">${dates[2]} - <b>${titles[2]}</b></p>
        <br><br>
        <img width="300" height="300" src=${urls[3]}>
        <br>
        <p style="color: #222">${dates[3]} - <b>${titles[3]}</b></p>
        <br><br>
        <img width="300" height="300" src=${urls[4]}>
        <br>
        <p style="color: #222"${dates[4]} - <b>${titles[4]}</b>}</p>
        <br><br>
        <img width="300" height="300" src=${urls[5]}>
        <br>
        <p style="color: #222">${dates[5]} - <b>${titles[5]}</b>}</p>
        <br><br>
        <img width="300" height="300" src=${urls[6]}>
        <br>
        <p style="color: #222">${dates[6]} - <b>${titles[6]}</b></p>
        <br><br>
        <h3 style="color: #222">See you next week,</h3>
        <h3 style="color: #222">Karthik</h3>
        <br>
        <p style="color: #222"><a style="color: #3b82f6" href="https://github.com/kach0w">@kach0w</a> | <a style="color: #3b82f6" href="https://apod-email.vercel.app">Website</p>
    </div>
    `
    const emails = req.body
    const gmailPWD = process.env.NEXT_PUBLIC_GMAIL_PASSWORD
    // console.log(emails)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'karsab499@gmail.com',
            pass: gmailPWD,
        }
    });
    let subjectstr = `${m}/${da} Astronomy Picture of the Day Mailing List`
    // send email
    transporter.sendMail({
        from: 'Karthik Sabhanayakam <karsab499@gmail.com>',
        to: emails,
        subject: subjectstr ,
        html: htmlString,
    });
    res.status(200).json({ success: "yay" });
}