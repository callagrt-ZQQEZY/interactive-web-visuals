
function buildPlot(BellyButtonData) {

 d3.json("samples.json").then(function (data) {
    console.log(data);
    
    var ethnicity = data.metadata.map(race => race.ethnicity);
    console.log('Ethnicities: ${ethnicity}');

    var bbtype = data.metadata.map(bb => bb.bbtype);
    console.log('Belly Button Types: ${bbtype}');

    let filteredmetadata = data.metadata.filter(sampleName => sampleName.id == BellyButtonData)[0];
    let washingfreqdata = parseInt(filteredmetadata.wfreq);
    console.log(filteredmetadata);
    console.log(washingfreqdata);

    var race = data.metadata.map(race => race.ethnicity);
    console.log(race);

    var sample = data.samples.filter(sampleid => sampleid.id.toString() === BellyButtonData)
    console.log(sample);

    var sample1 = sample[0];
    console.log(sample1);

    var top10val = sample1.sample_values.slice(0, 10);
    console.log(top10val);

    top10val.reverse();

    var top10otuids = sample1.otu_ids.slice(0, 10);
    console.log(top10otuids);
    
    top10otuids.reverse();

    var otulabels = top10otuids.map(label => "OTU " + label);
    console.log('OTU IDs: ${otulabels}');

    var labels = sample1.otu_labels.slice(0, 10);
    console.log(labels);

    // bar chart
    var barchart = [{
        type: 'bar',
        x: top10val,
        y: otulabels,
        text: labels,
        orientation: 'h'
    }];


    Plotly.newPlot('bar', barchart);

    var sampvalues = sample1.sample_values;
    var idvalues = sample1.otu_ids;
    console.log(sampvalues);
    console.log(idvalues);
    

    // bubble chart
    var trace1 = {
        x: idvalues,
        y: sampvalues,
        text: sample1.otu_labels,
        mode: "markers",
        marker: {
            color: sample1.otu_ids,
            size: sample1.sample_values
           
        }
    };

    var bubbledata = [trace1];

    var layout = {
        title: 'Bubble Chart',
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Bacteria Types"},
        showlegend: false

    };

    Plotly.newPlot('bubble', bubbledata, layout);

    var wgaugedata = [
        { 
            domain: { x: [0, 1], y: [0, 1] },
            value: parseInt(washingfreqdata),
            title: { text: "Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { Reference: 5, increasing: { color: 'green' }},
            hoverinfo: "labels",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "red" },
                  { range: [1, 2], color: "coral" },
                  { range: [2, 3], color: "orange" },
                  { range: [3, 4], color: "yellow" },
                  { range: [4, 5], color: "lightyellow" },
                  { range: [5, 6], color: "lightblue" },
                  { range: [6, 7], color: "blue" },
                  { range: [7, 8], color: "lightgreen" },
                  { range: [8, 9], color: "green" }
                ],
                threshold: {
                    line: {color: "red", width: 4 },
                    thickness: 1,
                    value: parseInt(washingfreqdata)
                }
        }
    }

    ]
    
    var layout = {
        width: 500,
        height: 400,
        margin: { t: 0, r: 0, l: 0, b: 0 },
        "annotations": [
            {
                "text": "Scrubs per Week"
            },
        ]
    }

    Plotly.newPlot('gauge', wgaugedata, layout);

    })
}


function updatePlotly(BellyButtonData) {
    d3.json("samples.json").then((data) => {
        console.log(data);

        var metadata = data.metadata;
        console.log(metadata);
        
        var demographicid = metadata.filter(meta => meta.id.toString() === BellyButtonData);
        console.log(demographicid);

        var demographicvalue = demographicid[0];
        console.log(demographicvalue);
        
        var demographicinfo = d3.select("#sample-metadata");
            // empty out demographic info each time selecting new data 
        demographicinfo.html("");


        Object.entries(demographicvalue).forEach((value) => {
        demographicinfo.append("h6").text(value[0] + ": " + value[1]);
    });

  });
}

function optionChanged(BellyButtonData){
    buildPlot(BellyButtonData);
    updatePlotly(BellyButtonData);
  };
  
 
  d3.selectAll("#selDataset").on("change", buildPlot, updatePlotly);
  
  // This function is called when a dropdown menu item is selected
  function init() {
  

    d3.json("samples.json").then((data) => {
      console.log(data);
  
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
  
    data.names.forEach(function(idName) {
      dropdownMenu.append("option")
                  .text(idName)
                  .property("value");
    })
  
    buildPlot(data.names[0]);
    updatePlotly(data.names[0]);
  
    })
  }
  
  init();