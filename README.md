# d3_challenge
D3 Homework NW Bootcamp


This homework focused on displaying an interactive scatter plot that charts the correlations between several health and income factors. To run the files use a source code editor (ex. VS Code) and your local server/default browser. Click on one of the three axis labels on the x or y axis to view the correlations.

# **D3 Challenge**

The app.js file is laid out in 5 modules that build the interactive scatter plot.

* Module 1
   *  Explores the assigned data set and lists column names

* Module 2
  * Defines the functions used to build the chart
      *  xScale() updates the x-scale variable (the scale of the x-axis) when a new x axis label is selected
      *  yScale() updates the y-scale variable (the scale of the y-axis) when a new y axis label is selected
      * renderXAxis() renders the new x-axis on the page when a new x axis label is selected
      * renderYAxis() renders the new y-axis on the page when a new y axis label is selected
      * renderCircles() renders the new circles on the page when a new x or y axis label is selected
      * rendertextCircles() renders the new text on top of the circles on the page when a new x or y axis label is selected
      * updateToolTip() updates the tool tip labels using a conditional when a new x or y axis label is selected, adds the selected data to the tool tip and adds an event handler to display the tool tip when a circle is mousedover and disappear when the mouse moves away


* Module 3
   * Builds the SVG canvas, defines the height and width of the chart, and appends the SVG to the scatter div

* Module 4
  * sets the default x and y axis
  * d3.csv()
     * reads the csv file then
        * parses the data from data type string to numerical data type
        * calls xScale() to scale the x-axis by the chosen x axis label
        * calls yScale() to scale the y-axis by the chosen y axis label
        * appends the x and y axis to the chart group
        * generates circles binds the selected data to each generated circle
        * binds the text (state abbreviations) to each circle
        * adds the three x axis labels to the chart group and sets the value for the event listener
        * adds the three y axis labels to the chart group and sets the value for the event listener
        * calls updateToolTip() with the chosen x axis label, chosen y axis label and the generated circles group

* Module 5
  * creates the event listener that updates the x and y axis and the circles with the new data based on the selected label
  * changes the bolding styel of the selected label

# Initial Load

![initial page load](https://user-images.githubusercontent.com/68086211/121422965-6206e200-c935-11eb-830a-fb23406ba513.png)



