
var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json('js/my_whole_network.json', function(error, data){//,igraph) {

  if (error) throw error;
	  console.log(data);

  whole_net=data[0];
  //.push.apply(graph.nodes, graphi.nodes)
  enet=data[1];//+data[1];
  //.push.apply(graph.nodes, graphi.nodes)
  inet=data[2];

  //entire_nodes=wholenet.nodes;
  //entire_links=wholenet.links;
  
  //entire_nodes.push.apply(graph.nodes, graphi.nodes);
  //entire_links.push.apply(graph.links, graphi.links);

  var NameProvider = whole_net.nodes;
  force
      .nodes(whole_net.nodes)
      .links(whole_net.links)
      .start();

      //.nodes(graph.nodes)
      //.links(graph.links)

  var link = svg.selectAll(".link")
      .data(whole_net.links)
      //.data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(whole_net.nodes)
      //.data(graph.nodes)
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
/*Sums up to exactly 100*/
