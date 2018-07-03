(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

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
          let day = d.getDay() - 1;
          if(day===-1){ day = 6; }        return {
            data: d,
            week: time.timeMonday.count(config.startDate, date),
            day,
          }
        }
        console.warn(`${date} is not a date`);
        return undefined;
      });
    }

    layout.startDate = (d)=>{
      if(!d) return config.startDate;
      config.startDate = d;
      return layout;
    };

    layout.dateAccessor = (d) => {
      if(!d) return config.dateAccessor;
      config.dateAccessor = d;
      return layout;
    };

    return layout;
  }
  calendarLayout.version = require('./package.json').version;

  module.exports = calendarLayout;

})));
