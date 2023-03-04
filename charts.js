function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    console.log(sample);
    
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    console.log(otuIds);

    var otuLabels = result.otu_labels;
    console.log(otuLabels);

    var sampleValues = result.sample_values.sort((a,b) => b-a);
    
    console.log(sampleValues);

    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   
    var yticks = otuIds.slice(0,10).reverse().map(each => "OTU "+ each);
    console.log(yticks);

    var top10OtuLabels = otuLabels.slice(0,10).reverse();
    console.log(top10OtuLabels);

    var top10SampleValues = sampleValues.slice(0,10).reverse();
    console.log(top10SampleValues);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10SampleValues,
      y: yticks,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 500,
      height: 400,
      title: "Top 10 Bacteria Cultures Found",
      font: { color: "darkblue", family: "Courier" }
    };
    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout,{responsive: true});

    // deliverable_2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        sizeref: .03,
        color: otuIds,
        colorscale: 'Earth',
        sizemode: 'area'
      },
      //type: 'scatter'
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      font: { color: "darkblue", 
              family: "Apple SD Gothic Neo",
              size: 17}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout,{responsive: true}); 


    //deliverable_3:
    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
    console.log(metadata);
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    console.log(result);

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result.wfreq);
    console.log(wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
          value: wfreq,
          type: "indicator",
          mode: "gauge+number",
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},                   
          gauge: {
              axis: { range: [0, 10] },
              steps: [
                { range: [0, 2], color: "red" },
                { range: [2, 4], color: "orange" },
                { range: [4, 6], color: "yellow"},
                { range: [6, 8], color: "yellowgreen"},
                { range: [8,10], color: "green"}
              ],
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              bar: { color: "darkblue" },
              
            }
        }
      
      ];
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      font: { color: "darkblue", family: "Arial" },
      margin: {
          t: 120,
          b: 40,
          l: 40,
          r: 40
          
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout,{responsive: true});
    

    
  });
}