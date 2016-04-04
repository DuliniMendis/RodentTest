//var dataset = "network2.json";
var dataset = inhibitory_network.json
var dataset2 = excitatory_network.json

window.alert(dataset)
document.write(dataset2)

var loc = window.location.pathname;
console.log(loc)


d3.json("inhibitory_network.json", function(error, graph) {
  if (error) throw error;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});


var width = 650,
    height = 600,
    outerRadius = Math.min(width, height) / 2 - 25,
    innerRadius = outerRadius - 18;

var formatPercent = d3.format("%");

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var layout = d3.layout.chord()
    .padding(.03)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

var path = d3.svg.chord()
    .radius(innerRadius);

var svg = d3.select("#chart_placeholder").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 1.5 + "," + height / 1.75 + ")");

svg.append("circle")
    .attr("r", outerRadius);

d3.csv("data/neighborhoods.csv", function(neighborhoods) {
  d3.json(dataset, function(matrix) {

    // Compute chord layout.
    layout.matrix(matrix);

    // Add a group per neighborhood.
    var group = svg.selectAll(".group")
        .data(layout.groups)
      .enter().append("g")
        .attr("class", "group")
        .on("mouseover", mouseover);

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
      return numberWithCommas(d.value) + " trips started in " + neighborhoods[i].name;
    });

    // Add the group arc.
    var groupPath = group.append("path")
        .attr("id", function(d, i) { return "group" + i; })
        .attr("d", arc)
        .style("fill", function(d, i) { return neighborhoods[i].color; });

    var rootGroup = d3.layout.chord().groups()[0];

    // Text label radiating outward from the group.
    var groupText = group.append("text");

   group.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("xlink:href", function(d, i) { return "#group" + i; })
        .attr("dy", ".35em")
        .attr("color", "#fff")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            " translate(" + (innerRadius + 26) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d, i) { return neighborhoods[i].name; });

    // Add the chords.
    var chord = svg.selectAll(".chord")
        .data(layout.chords)
      .enter().append("path")
        .attr("class", "chord")
        .style("fill", function(d) { return neighborhoods[d.source.index].color; })
        .attr("d", path);

    // Add mouseover for each chord.
    chord.append("title").text(function(d) {
      if (!(neighborhoods[d.target.index].name === neighborhoods[d.source.index].name)) {
      return numberWithCommas(d.source.value) + " trips from " + neighborhoods[d.source.index].name + " to " + neighborhoods[d.target.index].name + "\n" +
        numberWithCommas(d.target.value) + " trips from " + neighborhoods[d.target.index].name + " to " + neighborhoods[d.source.index].name;
      } else {
        return numberWithCommas(d.source.value) + " trips started and ended in " + neighborhoods[d.source.index].name;
      }
    });

    function mouseover(d, i) {
      chord.classed("fade", function(p) {
        return p.source.index != i
            && p.target.index != i;
      });
      var selectedOrigin = d.value;
      var selectedOriginName = neighborhoods[i].name;
    }
  });
});
