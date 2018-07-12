const {timeYear, timeMonth, timeWeek, timeMonday}  = require('d3-time');

const isDate = d => (Object.prototype.toString.call(d) === '[object Date]');

const firstNday = (date, weekDay)=>{
  let current = new Date(date);
  current.setDate(1);
  while(current.getDay() != weekDay){
    current.setDate(current.getDate() + 1);
  }
  return current;
}

const lastNday = (date, weekday)=>{
  let current = new Date(date);
  current.setMonth(current.getMonth() + 1);
  current.setDate(0);
  while(current.getDay() != 1){
    current.setDate(current.getDate() - 1);
  }
  return current;
}

function calendarLayout(options){
  const defaults = {
    startDate: new Date(),
    dateAccessor: d=>d,
  };

  const config = Object.assign({}, defaults, options);

  function layout(dates){
    if(!Array.isArray(dates)) dates = [dates];
    return dates.map(d=>{
      const date = config.dateAccessor(d);
      if(isDate(date)){
        let day = d.getDay() - 1; // I want my weeks to start on monday TODO: make this configurable
        if(day===-1){ day = 6 };
        return {
          data: d,
          week: timeMonday.count(config.startDate, date),
          month: timeMonth.count(config.startDate, date),
          day,
        }
      }
      console.warn(`${date} is not a date`);
      return undefined;
    });
  }

  layout.monthOutline = (date) => {
    
    const month = date.getMonth();
    const year = date.getFullYear();

    const [firstDay] = layout(new Date(year, month, 1));
    const [firstSunday] = layout(firstNday(date, 0));
    const [lastSunday] = layout(lastNday(date, 0));
    const [lastDay] = layout(new Date(year, month + 1, 0));
    const [lastMonday] = layout(lastNday(date, 1));
    const [firstMonday] = layout(firstNday(date, 1));

    const coords = [
      firstDay,     // first day of the month
      {    // first sunday of the month, day +1
        day: firstSunday.day + 1,
        week: firstSunday.week,
        month: firstSunday.month,
      },{    // last sunday of the month, day +1, week +1
        day: firstSunday.day + 1, //no idea why last sunday wasn't working here...
        week: lastSunday.week,
        month: lastSunday.month,
      },{    // last day of the month, day +1
        day: lastDay.day + 1,
        week: lastDay.week,
        month: lastDay.month,
      },{     // last day of the month, day +1, week +1
        day: lastDay.day + 1,
        week: lastDay.week + 1,
        month: lastDay.month,
      },{     // last monday of the month, week +1
        day: lastMonday.day,
        week: lastMonday.week + 1,
        month: lastMonday.month,
      },
      firstMonday,  // first monday of the month
      {    // first day of the month, week +1
        day: firstDay.day,
        week: firstDay.week + 1,
        month: firstDay.month,
      },
      firstDay
      // BACK to first day of th month
    ];
    return coords;
  }

  layout.startDate = (d)=>{
    if(!d) return config.startDate;
    config.startDate = d;
    return layout;
  }

  layout.dateAccessor = (d) => {
    if(!d) return config.dateAccessor;
    config.dateAccessor = d;
    return layout;
  }

  return layout;
}
calendarLayout.version = require('./package.json').version;

module.exports = calendarLayout;