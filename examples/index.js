const calendarLayout = require('../index.js');

import {select, selectAll, scaleBand, scaleLinear} from 'd3';

console.log(`calendarLayout: ${calendarLayout.version}`);

const firstDay = new Date(2018,0,1);
const today = new Date();

const layout = calendarLayout()
    .startDate(firstDay);
  
const dates = [];
let currentDate = new Date(firstDay);
while (currentDate.getTime()<today.getTime()){
  dates.push(new Date(currentDate));
  currentDate.setDate(currentDate.getDate()+1);
}

const calendar = layout(dates);

const lastData = calendar[calendar.length - 1];

const dayScale = scaleLinear()
  .domain([0, 6])
  .range([0, 400]);

const weekScale = scaleLinear()
  .domain([0, lastData.week+1])
  .range([0, 1000]);

select('svg.calendar')
  .selectAll('g.day')
    .data(calendar)
  .enter()
    .append('g')
    .attr('transform', d=>`translate(${dayScale(d.day)}, ${weekScale(d.week)})`)
    .attr('class','day')
    .call(parent=>{
      parent.append('rect')
        .attr('fill','none')
        .attr('stroke','#000')
        .attr('width', dayScale(1)) //dayScale.bandwidth()
        .attr('height', weekScale(1)); //weekScale.bandwidth()
      
      parent.append('text')
        .attr('dy',weekScale(1)/3 * 2)
        .attr('dx',dayScale(1)/5)
        .text(d=>`${d.data.getDate()}`);
    });
