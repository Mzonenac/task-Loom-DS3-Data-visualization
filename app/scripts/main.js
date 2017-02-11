var d3App = angular.module('d3App', []);

d3App.controller('AppCtrl', function AppCtrl ($scope) {
    var entity;
    $scope.data = setUpJson; // intial data set
    /*
     Find current entity in dataset by choice panel
    * */
    $scope.selectEnt = function(name){
        angular.forEach(setUpJson.entities, function(arr){
            if(arr.entity === name) {
                arr? $scope.entity = arr: "";
                return false;
            }
        });
    };
    /*
     Select/deselect Expand mode by +Expand/-Minimize click button
    * */
    $scope.expandSvg = function(v){
        if(!v.status) {
            $scope.expand = {
                status: true,
                val: "- Minimize"
            }
        }
        else {
            $scope.expand = {
                status: false,
                val: "+ Expand"
            }
        }
    };
});

/* 
DS3 visualization directive 
 */
d3App.directive('dsVisualization', function ($compile) {
    var svg,data,width,height;
    return {
        restrict: 'EA',
        scope: {
            val: '=',
            expand: '='
        },
        link: function (scope, el) {
            //entity change event
            scope.$watch('val', function (values) {
                //expand mode change event
                scope.$watch('expand', function (expand) {  
                    if (!values)
                        return;
                    if (!values.distribution)
                        return false;
                    if (!values.distribution.relativeParts)
                        return;
                    
                    if(expand.status) {
                        //set to full size screen avoid choice panel
                        width = window.innerWidth - 250;
                        height = window.innerHeight - 45;
                    }
                    else {
                        //set 30vw size for height and width of widget
                        width = window.innerWidth/100 * 30; 
                        height = window.innerWidth/100 * 30;
                    }
                    //resize SVG and check it if exist (initial setting 30vw x 30vw)
                    if(!svg) {
                        svg = d3.select(el[0])
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height);
                    }
                    else {
                        svg
                            .attr("width", width)
                            .attr("height", height);
                    }
                    //type of entity different visualsation parts
                    switch (values.type){
                        case "CONTINUOUS": scope.renderContinuos(values,width,height); break;
                        case "DISCRETE": scope.renderDiscrete(values,width,height);break;
                    }
                })
                    
            });
            /*
            Discrete mode
             */
            scope.renderDiscrete = function(obj,width,height) {
                var data,n,xScale, barHeight, margin,barWidth,color,marginTop,
                    chartWidth,chartHeight, barMargin, deviation,minBarWidth, labelMargin;
                
                data = scope.dataRender(obj.distribution.relativeParts, "occurrences");  // render data of entity
                n = Object.keys(data).length;                                   //count of bars
                barHeight = 20;
                margin = {top: 10, right: 10, bottom: 10, left: 10};            //margins
                chartWidth = width - (margin.right + margin.left);
                chartHeight = height - (margin.top + margin.bottom);
                marginTop = (chartHeight - (barHeight + margin.bottom)*n) /2;  // middle vertical align of bars
                barWidth = chartWidth/2;                                      // initial bar width
                barMargin = 5;
                deviation = 0.25; // 25% deviation
                minBarWidth = 0.1 // 10%
                labelMargin = 10; // Deviation label margin

                svg.selectAll('*').remove(); // clear old svg
                color = d3.scale.category20();
                
                // color = function(val){
                //     var color;
                //     var l = chartWidth - xScale(val);
                //     (l <= chartWidth/10)? color = "#aec7e8": color = "#1F77B4";
                //     return color;
                // }
                
                xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return  d.value;
                    })])
                    .range([0, chartWidth]);

                
                // bar visualization
                svg.selectAll('rect')    
                    .data(data).enter()
                    .append('rect')
                    .attr('height', barHeight)
                    .attr('width', barWidth )
                    .attr('y', function(d,i){ return  marginTop + (barHeight + barMargin) * i;})
                    .attr('x', margin.left)
                    .attr('fill', function(d) {return color(d.value); })
                    .text(function (d) {
                        return d.name;
                    })
                    .transition()
                    .duration(1000)
                    .attr('width', function(d) {
                        var l = chartWidth - xScale(d.value);          
                        (l <= chartWidth * minBarWidth)? l = chartWidth * minBarWidth:"";    //set minimal width of bars
                        return l;
                    });
                
                // Red line 25% of deviation
                svg.append("rect")
                    .attr("fill","red")
                    .attr("class", "redline axis")
                    .attr("y", margin.top)
                    .attr("x", width * deviation)
                    .attr("width", 1)
                    .attr("height", chartHeight - margin.bottom * 2 - margin.top )
                
                // Deviation line Label
                svg.append("g")
                    .append("text")
                    .attr("fill","#000")
                    .attr("y", margin.top)
                    .attr("x", width * deviation + labelMargin)
                    .text("Deviation 25%")
                    .attr("font-size", "10px")
                
            }
            scope.renderContinuos = function(obj,width,height){
                var n,margin,x,y,xAxis,yAxis,valueline, chartWidth,chartHeight, ticks,deviation,labelMargin;
                data = scope.dataRender(obj.distribution.relativeParts, "occurrences");    // render data of entity
                n = Object.keys(data).length;                                              //count of points 
                
                
                margin = {top: 10, right: 10, bottom: 10, left: 10};                       //margins
                chartWidth = width - (margin.right + margin.left);
                chartHeight = height - (margin.top + margin.bottom);
                ticks = 20;
                deviation = 0.25 //25% of deviation
                labelMargin = 50; // Deviation label margin
                
                svg.selectAll('*').remove();    // clear old svg

                x = d3.scale.linear().range([margin.left, chartWidth]);          //set range
                y = d3.scale.linear().range([chartHeight, margin.top]);
                
                
                xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(n);
                
                yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(ticks);
                
                valueline = d3.svg.line()
                    .x(function(d,i) { return x(i); })
                    .y(function(d) { return y(d.value); });
                
                    // Scale the range of the data
                    x.domain(d3.extent(data, function(d,i) { return i; }));
                    y.domain([0, d3.max(data, function(d) { return d.value; })]);

                    // Add the valueline path.
                    svg.append("path")
                        .attr("fill","none")
                        .attr("class", "line")
                        .attr("stroke", "steelblue")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 2)
                        .attr("d", valueline(data))
                        

                    // Add the X Axis
                    svg.append("g")
                        .append("text")
                        .attr("fill","#333")
                        .attr("class", "x axis")
                        .attr("x", margin.left + 50 )
                        .attr("y", chartHeight)
                        .attr("text-anchor", "end")
                        .call(xAxis)
                        .text("Occurrences")
                        .attr("font-size","10px");
                

                    // Add the Y Axis
                    svg.append("g")
                        .append("text")
                        .attr("fill","#333")
                        .attr("transform", "rotate(-90)")
                        .attr("class", "y axis")
                        .attr("y",margin.left/2)
                        .attr("x", -margin.top)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .call(yAxis)
                        .attr("d", valueline(data))
                        .text("Values")
                        .attr("font-size","10px");
                
                // Add red line of 25% deviation
                    svg.append("rect")
                        .attr("fill","red")
                        .attr("class", "redline axis")
                        .attr("y", chartHeight * (1 - deviation))
                        .attr("x", margin.left)
                        .attr("width", chartWidth - margin.left)
                        .attr("height",1);

                    svg.append("g")
                        .append("text")
                        .attr("fill","#000")
                        .attr("y", chartHeight * (1 - deviation) - 10)
                        .attr("x", chartWidth - margin.left - margin.right - labelMargin)
                        .text("Deviation 25%")
                        .attr("font-size", "10px");
                
            }
            // Render data by key
            scope.dataRender = function (data, key) {
                var obj = [], i = 0;
                angular.forEach(data, function(o,k){
                    obj[i] = {name: k, value: o[key]};
                    i++;
                });
                return obj;
            }
        }
        
    }
        
});