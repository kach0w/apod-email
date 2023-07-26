export default async function handler(req, res) {
  const options = {
    method: 'POST',
    url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '0a110d7d80msh1aee9c56803a5d5p1401c3jsn90f55ffc86dd',
      'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
    },
    data: {
      personalizations: [
        {
          to: [
            {
              email: 'karsab343@gmail.com'
            }
          ],
          subject: 'Hello, World!'
        }
      ],
      from: {
        email: 'karsab343@gmail.com'
      },
      content: [
        {
          type: 'text/plain',
          value: 'Hello, World!'
        }
      ]
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}