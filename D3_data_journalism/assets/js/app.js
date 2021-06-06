// I worked with Erin Wills (TA)
// #######################  1.  Data Exploration  ################ //
// CSV file shows that
//  Data has following columns: id, state, abbr, poverty, povertyMoe, age, ageMoe, income, incomeMoe, healthcare, healthcareLow, healthcareHigh, obesity, obesityLow, obesityHigh, smokes, smokesLow, smokesHigh
//  Once read by d3.csv -> array of 51 objects as key-value pairs
//  console.log(data) see below after d3.csv

// #################### 2.  Define Function ###############//
// function used for updating x-scale var upon click on x-axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);  //width define at beginning of main code
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on y-axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);  //height defined at beginning of main code
  
    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating yAxis var upon click on y-axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  // Function with just x values added by Erin
  // text is positioned by x,y attributes, circles are positioned by cx, cy attributes
function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
        return textcirclesGroup;
    }
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    var label1;
    var label2;
  
    if (chosenXAxis === "poverty") {
        if(chosenYAxis === "healthcare"){
            label1 = "Poverty: ";
            label2 = "Healthcare: "
        }
        else if (chosenYAxis === "smokes"){
            label1 = "Poverty: ";
            label2 = "Smokes: "
        }
        else if (chosenYAxis === "obesity"){
            label1 = "Poverty: ";
            label2 = "Obesity: "
        }
    }
    else if(chosenXAxis === "age"){
        if(chosenYAxis === "healthcare"){
            label1 = "Age: ";
            label2 = "Healthcare: "
        }
        else if (chosenYAxis === "smokes"){
            label1 = "Age: ";
            label2 = "Smokes: "
        }
        else if (chosenYAxis === "obesity"){
            label1 = "Age: ";
            label2 = "Obesity: "
        }
    }
    else if(chosenXAxis === "income"){
        if(chosenYAxis === "healthcare"){
            label1 = "Income: ";
            label2 = "Healthcare: "
        }
        else if (chosenYAxis === "smokes"){
            label1 = "Income: ";
            label2 = "Smokes: "
        }
        else if (chosenYAxis === "obesity"){
            label1 = "Income: ";
            label2 = "Obesity: "
        }
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label1} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
      });
    
    circlesGroup.call(toolTip);

    //on mouseover event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data,this);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

//########################  3.  SVG Setup ###################################//
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// set width and high for xScale and yScale
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

// Initial Params - on page load poverty and healthcare variables will be selected
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
   
    // parse data - set values to numerical data types
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

// Data Exploration (Section 1)
    // console.log(healthData);

// calls xLinearScale function from above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

//calls yLinearScale function from above csv import
    var yLinearScale = yScale(healthData, chosenYAxis);


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
    // Note: the data is being scaled by the scaling functions defined above
    // the centers of the circles are also coming from the specific x data group 'chosenXAxis' and y data group 'chosenYAxis'
    // append initial circles
    var circlesGroup = circlesGroupAll
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)

    // added by Erin - Add text to the circles
    // data is bound to ciclesGroupAll like above and now I add a text element at "x" and "y" vs. "cx" and "cy"
    //Look at what xScale and transpose is doing
    var textcirclesGroup = circlesGroupAll
        .append("text")
        .classed("stateText", true)
        .text((d)=>d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .classed("axis-text", true)

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", 0-(height/2))
        .attr("y", -40)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare(%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", 0-(height/2))
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("x", 0-(height/2))
        .attr("y", -80)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


// #################### 5.  ADD updates upon clicking axis text  ###############//

    // x axis labels event listener
    // Note: above this section, only the updateToolTip and xScale functions have been called 
    //out of all the user created functions at the top of the script
    // the other functions at the top of the script are used to re-define the data applied 
    //to the xLinearScale function, xAxis object, yLinearScale, yAxis element, 
    //functioncirclesGroup elements, textcirclesGroup elements, circlesGroup elements
    xLabelsGroup.selectAll("text")
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
            xAxis = renderXAxes(xLinearScale, xAxis);
        
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates text labels within circles
            textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "poverty"){
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "income"){
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
    // y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = value;

            console.log(chosenYAxis)

            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);
        
            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates text labels within circles
            textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "smokes") {
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "healthcare"){
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity"){
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
}).catch(function(error) {
console.log(error);
});

