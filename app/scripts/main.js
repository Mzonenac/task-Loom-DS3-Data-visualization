var d3App = angular.module('d3App', []);

d3App.controller('AppCtrl', function AppCtrl ($scope) {
    $scope.data = setUpJson; // intial data set
    /*
     Find current entity in dataset by choice panel
    * */
    $scope.selectEntity = function(name){
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
d3App.directive('dsVisualization', function () {
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
                        default: return false;break;
                    }
                })
                    
            });
            /*
            Discrete mode
             */
            scope.renderDiscrete = function(obj,width,height) {
                var data,n,xScale, barHeight, margin,barWidth,color,marginTop,
                    chartWidth,chartHeight,barMargin,deviation,minBarWidth,labelMargin;
                
                data = scope.dataRender(obj.distribution.relativeParts, "occurrences");  // render data of entity
                n = Object.keys(data).length;                                   //count of bars
                barHeight = Math.round(height/n) / 3;
                barMargin = barHeight;
                margin = {top: 10, right: 10, bottom: 10, left: 10};            //margins
                chartWidth = width - (margin.right + margin.left);
                chartHeight = height - (margin.top + margin.bottom);
                barHeight = Math.round((chartHeight/n) / 3);
                barMargin = barHeight;
                marginTop = Math.round((chartHeight - ((barHeight * n) + (barMargin * (n - 1)))) /2);  // middle vertical align of bars
                barWidth = Math.round(chartWidth/2);                                      // initial bar width
                deviation = 0.25; // 25% deviation
                minBarWidth = 0.1; // 10%
                labelMargin = 10; // Deviation label margin
                
                svg.selectAll('*').remove(); // clear old svg
                color = d3.scale.category20();
                
                xScale = d3.scale.linear()
                                    .domain([0, d3.max(data, function(d) {
                                        return  d.value;
                                    })])
                                    .range([chartWidth, 0]);

                
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
                    .attr("height", chartHeight - margin.bottom * 2 - margin.top );
                
                // Deviation line Label
                svg.append("g")
                    .append("text")
                    .attr("fill","#000")
                    .attr("y", margin.top)
                    .attr("x", width * deviation + labelMargin)
                    .text("Deviation " + deviation * 100 + "%")
                    .attr("font-size", "10px");


                svg.selectAll("text.label")
                    .data(data)
                    .enter().append("text")
                    .attr("class", "label")
                    .attr("x", margin.left )
                    .attr("y", function(d,i){ return  marginTop + (barHeight + barMargin) * i - 2;})
                    .attr("text-anchor", "left")
                    .attr('fill','#999')
                    .text(function(d) {
                        return d.name.substr(0,20) + " (value: " + d.value + ")";
                    });
                
            };
            scope.renderContinuos = function(obj,width,height){
                var n,margin,x,y,xAxis,yAxis,valueline, chartWidth,chartHeight,
                    deviation,labelMargin,points,tip;
                
                data = scope.dataRender(obj.distribution.relativeParts, "occurrences");    // render data of entity
                n = Object.keys(data).length;                                              //count of points 
                
                margin = {top: 30, right: 10, bottom: 10, left: 50};                       //margins
                chartWidth = width - (margin.right + margin.left);
                chartHeight = height - (margin.top + margin.bottom);
                deviation = 0.25; //25% of deviation
                labelMargin = 50; // Deviation label margin
                
                svg.selectAll('*').remove();    // clear old svg

                x = d3.scale.linear().range([margin.left, chartWidth]);          //set range for axis and points
                y = d3.scale.linear().domain([0, d3.max(data, function(d) {
                    return  d.value;
                })]).range([chartHeight, margin.top - margin.bottom]);

                
                //axis functions
                xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(n);

                yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(n);
                
                // get values 
                valueline = d3.svg.line()
                    .x(function(d,i) { return x(i); })
                    .y(function(d) { return y(d.value); });
                
                
                    // Scale the range of the data
                    x.domain(d3.extent(data, function(d,i) { return i; }));
                    y.domain([0, d3.max(data, function(d) { return d.value; })]);

                tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-5, 0])
                    .html(function(d) {
                        return "<strong>Entity #" + d.name + "</strong> : <span> " + d.value + "</span>";
                    });
                svg.call(tip);
                
                    // Add the valueline path.
                    svg.append("path")
                        .attr("fill","none")
                        .attr("class", "line")
                        .attr("stroke", "steelblue")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 2)
                        .attr("d", valueline(data));

                //Add circles for points
                    svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', 'points pointer')
                        .attr('r', 3)
                        .attr('cy',function(d){return y(d.value)})
                        .attr('cx', function (d,i) {
                            return x(i);})
                        .attr('fill', '#fff')
                        .attr('stroke','steelblue')
                        .attr('stroke-width',2);

                    // Add the X Axis
                    svg.append("g")            
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (chartHeight - margin.bottom) + ")")
                        .attr('fill', 'none')
                        .attr('stroke', 'grey')
                        .attr('stroke-width', 1)
                        .attr('shape-rendering', 'crispEdges')
                        .attr('font-size','8px')
                        .call(xAxis);

                    // Add the Y Axis
                    svg.append("g")             
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (margin.left / 2 ) + ", 0)")
                        .attr('fill', 'none')
                        .attr('y',margin.top)
                        .attr('stroke', 'grey')
                        .attr('stroke-width', 1)
                        .attr('shape-rendering', 'crispEdges')
                        .attr('font-size','8px')
                        .attr("text-anchor", "right")
                        .call(yAxis);
                
                    svg.selectAll("rect")
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr("class", "tool_tip pointer")
                        .attr('fill','#fff')
                        .attr('width', 20)
                        .attr('height',20)
                        .attr("y", function(d){return y(d.value) - 10;})
                        .attr("x", function (d,i) {return x(i) - 10;})
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    // Add red line of 25% deviation
                    svg.append("rect")
                        .attr("fill","red")
                        .attr("class", "redline axis")
                        .attr("y", chartHeight * (1 - deviation))
                        .attr("x", margin.left)
                        .attr("width", chartWidth - margin.left)
                        .attr("height",1);
    
                    // Add deviation text
                    svg.append("g")
                        .append("text")
                        .attr("fill","#000")
                        .attr("y", chartHeight * (1 - deviation) - 10)
                        .attr("x", chartWidth - margin.left - margin.right - labelMargin)
                        .text("Deviation " + deviation * 100 + "%")
                        .attr("font-size", "10px");
                        
            };
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