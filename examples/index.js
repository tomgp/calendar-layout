const calendarLayout = require('../index.js');

import {select, selectAll, scaleBand, scaleLinear, line} from 'd3';

console.log(`calendarLayout: ${calendarLayout.version}`);

const firstDay = new Date(2018, 0, 1);
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

const a = layout.monthOutline(firstDay)

const lastData = calendar[calendar.length - 1];

const dayScale = scaleLinear()
  .domain([0, 6])
  .range([0, 400]);

const weekScale = scaleLinear()
  .domain([0, lastData.week+1])
  .range([0, 1000]);

const outline = line()
  .x(d=>{
    return dayScale(d.day);
  })
  .y(d=>{
    return weekScale(d.week);
  });

select('svg.calendar')
  .selectAll('g.day')
    .data(calendar)
  .enter()
    .append('g')
    .attr('transform', d => `translate(${dayScale(d.day)}, ${weekScale(d.week)})`)
    .attr('class','day')
    .call(parent => {
      parent.append('rect')
        .attr('fill', '#eee')
        .attr('stroke', 'none')
        .attr('width', dayScale(1)) //dayScale.bandwidth()
        .attr('height', weekScale(1)); //weekScale.bandwidth()
      
      parent.append('text')
        .attr('dy', weekScale(1)/3 * 2)
        .attr('dx', dayScale(1)/5)
        .text(d=>`${d.data.getDate()}`);
    });

select('svg.calendar')
  .selectAll('g.month')
    .data([
      layout.monthOutline(firstDay),
      layout.monthOutline(new Date(2018, 5, 1))
    ])
  .enter()
    .append('g')
    .attr('class', 'month')
  .call((parent)=>{
    parent.append('path')
      .attr('d', d=>{
        return outline(d);
      })
      .attr('fill', 'none')
      .attr('stroke', '#F00');
  })
  
