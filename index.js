const time  = require('d3-time');

const isDate = d => (Object.prototype.toString.call(d) === '[object Date]');

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
          week: time.timeMonday.count(config.startDate, date),
          month: time.timeMonth.count(config.startDate, date),
          day,
        }
      }
      console.warn(`${date} is not a date`);
      return undefined;
    });
  }

  layout.monthOutline = (t0) => {
      const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
      const d0 = t0.getDay();
      const w0 = d3.timeWeek.count(d3.timeYear(t0), t0);
      const d1 = t1.getDay();
      const w1 = d3.timeWeek.count(d3.timeYear(t1), t1);

      const coords = [
        [w0+1, d0],
        [w0 , 0],
        [0  , 7],
        [w1 , 0],
        [0  , d1+1]
      ];

// this is a path, we should return a set of coords:
// months, days and weeks which can then be drawn by the same scale as the nomal layedout items 
      return "M" + (w0 + 1) + "," + d0
          + "H" + w0 + "V" + 7
          + "H" + w1 + "V" + (d1 + 1)
          + "H" + (w1 + 1) + "V" + 0
          + "H" + (w0 + 1) + "Z";
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