var Chunk = function(resource, connections, callback){
  this.connections = connections;
  this.chunk = 0;
  this.size = 0;
  console.log(resource);
  this.parts = this.len(resource);
  this.source = resource;
  this.each_chunk_callback = callback;
}

Chunk.prototype.len = function(resource) {
  var http = new XMLHttpRequest();
  var chunk = this;
  http.open('HEAD', resource, false);
  http.setRequestHeader('Accept', 'image/webp')
  http.onreadystatechange = function() {
    if (http.readyState == http.DONE) {
      length = http.getResponseHeader('Content-Length');
      this.size = length;
    }
  }.bind(this);
  http.send();
};

Chunk.prototype.download = function(){
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
}

Chunk.prototype.get_part = function(start_index, end_index, chunk_index) {
  var xmlhttp = new XMLHttpRequest();
  console.log("Start Index = "+ start_index + "End index = "+ end_index);
  xmlhttp.open("GET", this.source, true);
  xmlhttp.responseType = 'arraybuffer';
  xmlhttp.setRequestHeader("Range", "bytes="+start_index+"-"+end_index);

  xmlhttp.addEventListener("readystatechange", function () {
    if (xmlhttp.readyState == xmlhttp.DONE) {
      // Call the callback here
      this.each_chunk_callback(this.connections, new Uint8Array(xmlhttp.response), "chunk"+chunk_index);
    }
  }.bind(this));
  xmlhttp.send();
};
