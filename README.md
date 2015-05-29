# Chunk.js

Chunk.js is a javascript library which allows you to download any resource in parts for your web page. 

# Usage

## To download image data parallely

To download image in path /data/4.jpg by opening 3 connections in parallel.

``` image = new Chunk("/data/4.jpg", 3, each_chunk_callback); ```

where the callback can be defined as follows:

```
function each_chunk_callback(connections, response, chunk_name) {
	console.log("Got "+ chunk_name);
	console.log("Data: "+ response);
}
```

To download the image data you need to cal download function on chunk instance.

``` image.download(); ```

### To download specific part of resource. 

``` image_middle_part = new Chunk("/data/4.jpg", [1200, 3200], each_chunk_callback);
image_midlle_part.download();
```

Look into examples folder for more information. 