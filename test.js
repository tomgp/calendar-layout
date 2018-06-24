// very rough testing

const calendarLayout = require('./index');
console.log(String(new Date(2018,0,1)))
const myLayout = calendarLayout()
  .startDate(new Date(2018,0,1));

const position = (myLayout(new Date(2018,0,1)))[0];
const position2 = (myLayout(new Date(2018,0,7)))[0];
const position3 = (myLayout(new Date(2018,0,8)))[0];

console.log(position, 'week 0', position.week == 0);
console.log(position, 'day 0', position.day == 0);

console.log(position2, 'week 0', position2.week == 0);
console.log(position2, 'day 6', position2.day == 6);

console.log(position3, 'week 1', position3.week == 1);
console.log(position3, 'day 0', position3.day == 0);