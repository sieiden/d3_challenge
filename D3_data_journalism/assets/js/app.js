// I worked with Erin Wills (TA)
// #######################  1.  Data Exploration  ################ //
// CSV file shows that
//  Data has following columns: id, state, abbr, poverty, povertyMoe, age, ageMoe, income, incomeMoe, healthcare, healthcareLow, healthcareHigh, ovesity, obesityLow, obesityHigh, smokes, smokesLow, smokesHigh
//  Once read by d3.csv then it is like an array of 51 objects as key-value pair format so I will need to use foreach or arrow functions to get arrays
//  console.log(data) see below after d3.csv

// #################### 2.  Define Function ###############//
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);  //width define at beginning of main code
  
    return xLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  //ADD FUNCTION TO UPDATE Y AXIS AS WELL

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // Added by Erin
  // Note:  as compared to renderCircles, the attr iterator needs to match what is created initially
  // So above I use "cx" and below I use "x" -  this needs to match the attr on line 245
  // text is positioned by x,y attributes, circles are positioned by cx, cy attributes
function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {
  
    textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
        return textcirclesGroup;
    }
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  
    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    }
    else {
      label = "Age:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
    
    //Note:  Below circlesGroup is having the tooltip added but other elements could also have the tool tip added
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data,this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

//########################  3.  SVG Setup ###################################//
// function makeResponsive(){
//     var svgArea = d3.select("#scatter").select("svg");

//     if (!svgArea.empty()) {
//         svgArea.remove();
//   }
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    // xScale uses width so xScale() can only be called below this point
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // #################### 4.  BRING in Data and ADD Structure ###############//

    // Initial Params - includes any axis selection that has multiple options
    var chosenXAxis = "poverty";

    // Retrieve data from the CSV file and execute everything below
    d3.csv("assets/data/data.csv").then(function(healthData, err) {
        if (err) throw err;
   
        // parse data - set values to numerical data types
        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.healthcare = +data.healthcare;
        });

    // Data Exploration (Section 1)
        console.log(healthData);

    // xLinearScale function above csv import; Note:  xLinearScale is functioncontains scaled data specific to the defined axis
    // Important note:  xScale uses width that is defined above; xScale can only be called below width in the code
    // scaling function: https://www.d3indepth.com/scales/
        var xLinearScale = xScale(healthData, chosenXAxis);

    // Create y scale function NEED TO CHANGE THIS TO ADD OPTIONS TO Y AXIS
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.healthcare)])
            .range([height, 0]);

    // Create initial axis functions; generates the scaled axis
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis; adds x axis chart data tick marks to chartgroup
    // for future axis value changes then the renderAxes() function needs called
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

    // append y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

    // New by Erin - provide data first to grouped elements 
    // case is important - selectAll() works but SelectAll() would produce a type error - the capitalizaton makes a difference
        var circlesGroupAll = chartGroup.selectAll("circlesGroup").data(healthData).enter();

    // modfied by Erin - data is already bound to circlesGroupAll and now I am adding the 'circles' with one circle for each data
    // note that the attributes are "cx" and "cy"; the data is being scaled by the scaling functions defined above; see it is a function
    // the centers of the circles are also coming from the specific x data group 'chosenXAxis'
    // append initial circles
        var circlesGroup = circlesGroupAll
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 15)

    // added by Erin - I wanted to add text to the circles - probably several ways of doing this but here is one.
    // data is bound to ciclesGroupAll like above and now I add a text element at "x" and "y", not the difference from above.
    // added round function to make the numbers in the cirlces have no decimals; this is a random data selection; I just wanted something inside the circles. If you want to see why these values are like they are then you need to back-calculate what xScale and transpose is doing
        var textcirclesGroup = circlesGroupAll
            .append("text")
            .classed("stateText", true)
            .text((d)=>d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d.healthcare))

    // Create group for two x-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

    // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


// #################### 5.  ADD updates upon clicking axis text  ###############//

    // x axis labels event listener
    // if you comment out the entire labelsGroup section then you can see that the plot populates but does not update when selecting the axis
    // note that above this section, only the updateToolTip and xScale functions are called of all the user created functions at the top of the script
    // the other functions at the top of the page are used to re-define the data applied to the xLinearScale function, xAxis object, circlesGroup elements, textcirclesGroup elements, circlesGroup elements
        labelsGroup.selectAll("text")
            .on("click", function() {
        // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
        
            // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
            // New - updates text labels within circles
                textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
            // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    }).catch(function(error) {
    console.log(error);
    });

// }
// makeResponsive();
// d3.select(window).on("resize", makeResponsive);