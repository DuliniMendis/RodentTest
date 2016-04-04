
var screenWidth = $(window).width(),
	mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	pullOutSize = (mobileScreen? 20 : 50),
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////


d3.json('js/my_whole_network.json', function(error, data){
  if (error) throw error;
	  //console.log(data);
	  /*for (var prop in data) {
 		 if (data.hasOwnProperty(prop)) { 
		  // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
			alert("prop: " + prop + " value: " + data[prop])
		  }
		}
		*/
		function iterate_over(data) { // more of a procedure than a function
		for (var i = 0; i < data.length; i++) {
 	   		console.log(data[i]);
 	   		if(data[i] !== null && typeof data[i] === 'object'){
 	   			for (var prop in data[i]) {
					 if (data[i].hasOwnProperty(prop)) { 
					  // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
						console.log("prop: " + prop + " value: " + data[i][prop])
						  console.log(data[i][prop]);

					  }
	 	   		}
 	   		}
		}
		return 0; }


	  var matrix=whole_net=data[0];
	  
	  
	  //var inet=data[1];
  	  //var enet=data[1];//+data[1];
	  //var Names=data[3];
	  var respondents = matrix.length
	  //95 //get the length of Names.
	  var Colour = ["#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", "","#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", ""];

      emptyPerc = 0;//0.4, //What % of the circle should become empty
      emptyStroke = 0;//Math.round(respondents*emptyPerc); 
		var Names = ["Acquisition and cleaning", "D3",  "NLTK",  "Matlab",  "Python",  "R", "Mapping", "Inventor", "3D Slicer", "", "Acquisition and cleaning", "D3",  "NLTK",  "Matlab",  "Python",  "R", "Mapping", "Inventor", "3D Slicer",""];
		var Colour = ["#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", "","#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", ""];


		/*
		var respondents = 95, //Total number of respondents (i.e. the number that makes up the total group)
			emptyPerc = 0.4, //What % of the circle should become empty
			emptyStroke = Math.round(respondents*emptyPerc); 


		//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
		//invisible chord center vertically
		var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;
		*/
		//Custom sort function of the chords to keep them in the original order
		//function customSort(a,b) {
		//	return 1;
		//};

		//Custom sort function of the chords to keep them in the original order
		var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
			.padding(.02)
			.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
			.matrix(matrix);

     	  console.log(matrix);

			
		var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
			.endAngle(endAngle);

		var path = stretchedChord()
			.radius(innerRadius)
			.startAngle(startAngle)
			.endAngle(endAngle);

		////////////////////////////////////////////////////////////
		//////////////////// Draw outer Arcs ///////////////////////
		////////////////////////////////////////////////////////////

		var g = wrapper.selectAll("g.group")
			.data(chord.groups)
			.enter().append("g")
			.attr("class", "group")
			.on("mouseover", fade(opacityLow))
			.on("mouseout", fade(opacityDefault));

		g.append("path")
			.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#000000"); })
			.style("fill", function(d,i) { return (Colour[i] === "" ? "none" : Colour[i]); })
			.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
			.attr("d", arc)
			.attr("transform", function(d, i) { //Pull the two slices apart
						d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
						return "translate(" + d.pullOutSize + ',' + 0 + ")";
			});


		////////////////////////////////////////////////////////////
		////////////////////// Append Names ////////////////////////
		////////////////////////////////////////////////////////////

		//The text also needs to be displaced in the horizontal directions
		//And also rotated with the offset in the clockwise direction
		g.append("text")
			.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) })
			.attr("dy", ".35em")
			.attr("class", "titles")
			.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
			.attr("transform", function(d,i) { 
				var c = arc.centroid(d);
				return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
				+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + 55 + ",0)"
				+ (d.angle > Math.PI ? "rotate(180)" : "")
			})
		  .text(function(d,i) { return Names[i]; })
		  .call(wrapChord, 100);

		////////////////////////////////////////////////////////////
		//////////////////// Draw inner chords /////////////////////
		////////////////////////////////////////////////////////////
		 
		var chords = wrapper.selectAll("path.chord")
			.data(chord.chords)
			.enter().append("path")
			.attr("class", "chord")
			.style("stroke", "none")
			.style("fill", function(d) {return Colour[d.source.index]})
			.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
			.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
			.attr("d", path)
			.on("mouseover", fadeOnChord)
			.on("mouseout", fade(opacityDefault));	

		////////////////////////////////////////////////////////////
		///////////////////////// Tooltip //////////////////////////
		////////////////////////////////////////////////////////////

		//Arcs
		g.append("title")	
			.text(function(d, i) {return Math.round(d.value) + " people in " + Names[i];});
			
		//Chords
		chords.append("title")
			.text(function(d) {
				return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join(""); 
			});
			//	console.log(chords)





	
////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle; }
function endAngle(d) { return d.endAngle; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
		.transition()
		.style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper.selectAll("path.chord")
		.transition()
		.style("opacity", function(d) {
			if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
				return opacityDefault;
			} else { 
				return opacityLow; 
			}//else
		});
}//fadeOnChord

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord
});
