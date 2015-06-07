var Chunk = function(resource, connections, callback){
  if (typeof(connections) == "object")
  {
    if (connections[1] == undefined)
    {
      this.len(resource);
      this.initialize(1, 0, this.size - connections[0] + 1);
    }
    else
      this.initialize(1, 0, connections[1] - connections[0] + 1);

    this.start_point = connections[0];
    this.end_point = connections[1];
  }
  else
  {
    this.initialize(connections, 0, 0)
    this.len(resource);
  }
  this.async = true;
  this.source = resource;
  this.each_chunk_callback = callback;
}

Chunk.prototype.initialize = function(connections, chunk, size) {
  this.connections = connections;
  this.chunk = chunk;
  this.size = size;
};

Chunk.prototype.len = function(resource) {
  var http = new XMLHttpRequest();
  var chunk = this;
  http.open('HEAD', resource, false);
  http.setRequestHeader('Accept', '*');
  http.onreadystatechange = function() {
    if (http.readyState == http.DONE) {
      length = http.getResponseHeader('Content-Length');
      this.size = length;
    }
  }.bind(this);
  http.send();
};

Chunk.prototype.download = function(){
  if (this.start_point != undefined)
    this.get_part(this.start_point, this.end_point, 0)
  else
    this.download_from_connections()
}

Chunk.prototype.download_from_connections = function() {
  var length = this.size;
  var difference = Math.floor(length/this.connections);
  var modulo = difference%3;

  if (modulo == 0)
    difference -= 1;
  else if (modulo%3 == 1)
    difference -= 2;

  var start_point = 0;
  var i = 0;

  for (i = 1; i <= (length/difference)-1; start_point = end_point +1, i++) {
    end_point = start_point + difference;
    this.get_part(start_point, end_point, i);
  };

  this.get_part(start_point, length-1, i);
  return true;
};

Chunk.prototype.get_part = function(start_index, end_index, chunk_index) {
  console.log("bytes=" + start_index + "-" + end_index);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", this.source, this.async);
  xmlhttp.responseType = 'arraybuffer';
  xmlhttp.setRequestHeader("Range", "bytes=" + start_index + "-" + end_index);

  xmlhttp.addEventListener("readystatechange", function () {
    if (xmlhttp.readyState == xmlhttp.DONE) {
      // Call the callback here
      this.each_chunk_callback(this.connections, new Uint8Array(xmlhttp.response), "chunk" + chunk_index);
    }
  }.bind(this));
  xmlhttp.send();
};
