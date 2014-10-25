data=[["","","",""]
    # ['Timeline','Russischkurs',new Date(2011,6,1),new Date(2011,7,16)]
    # ['Timeline','Kasachisch',new Date(2011,8,1),new Date(2011,9,1)]
    ['Timeline','(6)',new Date(2014,2,1),new Date(2014,9,1)]
    ['Timeline','5',new Date(2013,6,1),new Date(2013,7,15)]
    ['Timeline','(4)',new Date(2013,3,1),new Date(2013,6,1)]
    ['Timeline','(2)',new Date(2012,4,1),new Date(2013,1,1)]
    ['Timeline','(2)',new Date(2013,8,1),new Date(2014,0,1)]
    ['Timeline','(1)',new Date(2011,9,1),new Date(2012,1,1)]
    ['Timeline','(3)',new Date(2012,9,1),new Date(2013,1,1)]
['Timeline','St. Petersburg',new Date(2013,1,1),new Date(2013,6,1)]]



el=document.getElementById('chart_div')
chart = new google.visualization.Timeline(el)
d = google.visualization.arrayToDataTable(data)
opts={
  timeline: {showRowLabels:false}
  # width:800
}
google.setOnLoadCallback(chart.draw(d,opts))
