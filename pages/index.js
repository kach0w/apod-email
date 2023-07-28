'use client';
import Image from 'next/image'
// import '../styles/Home.module.css'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../firebase';
import Head from 'next/head'
import schedule from 'node-schedule';
import axios from 'axios' 

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState([]);

    const fetchImage = async () => {
        const apikey = process.env.NEXT_PUBLIC_NASA_API_KEY
        const url = "https://api.nasa.gov/planetary/apod?api_key=" + apikey ;
        const res = await fetch(url);
        const data = await res.json();
        setImageUrl(data.url);
        setDate(data.date);
        setTitle(data.title);
    };
    let d = new Date()
    const sendEmails = async () => {
        const querySnapshot = await db.collection("apod").get();

        const emails = querySnapshot.docs.map((doc) => {
          return doc.data().emailInput;
        });
    
        setEmails(emails);
        console.log("emailData: " + emails)

        
        // emails.map((email) => {
        //   emailList.push(email.emailInput);
        // })
        await fetch("/api/route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify( emails ),
        }).then((res) => res.json())
        .then((result) => {
          console.log(result);
        });; 
    };
    

  useEffect(() => {
    fetchImage();
    // 8 am mondays 0 8 * * 1
    setTimeout(sendEmails,50);

    const job = schedule.scheduleJob('0 8 * * 1', () => {
      console.log("Time: " + d.getHours() + ":" + d.getMinutes() )
      setTimeout(sendEmails,50);
    });
    // console.log(emailList)

  }, []);
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apodData = {
        emailInput,
        createdAt: new Date().toISOString(),
    };
    try {
        if(validateEmail(emailInput)){
            await db.collection('apod').add(apodData);
            setEmailInput('');
            alert("Success, you have been added to the email list.")
        } else {
            alert("Enter a valid email address.")
        }
       
    } catch (error) {
        console.error('Error adding email:', error);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#c2eaba] text-[#222] text-center p-5">
      <Head>
        <title>APoD Email</title>
        <meta name="description" content="An email list for those interested in NASA's Astronomy Pictures of the Day"></meta>
        <link rel="icon" href="/favicon.png" sizes="any" />      
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz@8..60&display=swap" rel="stylesheet" />
      </Head>        
      <h2>Astronomy Picture of the Day - Email List</h2>
      <div className='relative w-[70rem] h-[43rem] mx-auto mt-[5rem]'>
        <div id="apoc-pic" className='absolute inset-y-0 left-0 w-[35rem]'>
          <div>
            <div className='w-[30rem] mb-2'>{title}</div>
          </div>
          <div>
            {imageUrl ? (
            <Image width="500" height="500" src={imageUrl} alt="Fetched Image" style={{ width: '500px', height: '500px' }}></Image>
          ) : (
            <p>Loading...</p>
          )}  
          </div>
          <div>
            <div className='w-[30rem] mt-2'>{date}</div>
          </div>
        </div>
        <div className='absolute inset-y-0 right-0 w-[36rem]'>
          <h2>Hello! Welcome to the website.</h2>
          <p>This email system is a way for astronomy lovers or people who just like 
            seeing space photos to get a snapshot of NASA's 
            Astronomy Photos of the Day.</p>
          <br></br>
          <p className='font-bold'><u>Join the Email List:</u></p>
          <form onSubmit={handleSubmit}>
                <br></br>
                <input
                    className='rounded-md p-2 text-[black] shadow-none'
                    type="text"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    id="email"
                    placeholder="Email..." />
                <br></br>
                <br></br>
                <button className='bg-[#3b82f6] py-2 px-8 rounded-lg hover:shadow-lg text-[white] hover:text-slate-200'>Submit</button>
            </form>
        </div>
        <div className='absolute inset-x-0 bottom-0'>
          <a className='text-[#3b82f6] hover:underline' href="https://github.com/kach0w">@kach0w</a> | Fremont, California | All credit goes to <a className='text-[#3b82f6] hover:underline' href="https://apod.nasa.gov/apod/astropix.html">APoD</a>, check them out
          <br></br>
          <p className='text-[10px] text-slate-600'><a target="_blank" className='text-[10px]' href="https://icons8.com/icon/30623/earth-planet">Earth</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
        </div>
      </div>
    </div>
  )
}
