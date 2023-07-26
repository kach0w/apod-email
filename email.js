import schedule from 'node-schedule';

const job = schedule.scheduleJob('6 13 * * *', () => {
  console.log("Doing function")
});