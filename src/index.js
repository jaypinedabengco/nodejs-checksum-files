var http = require("http");
var url = require("url");
var crypto = require("crypto");
var fs = require("fs");

const BASE_DIR = __dirname;

//create a server object:
http
  .createServer(async function(req, res) {
    var { path } = url.parse(req.url);

    if (path === "/test") {
    } else {
      await readFileChecksum(req, res);
    }
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080

/**
 *
 */
async function readFileChecksum(req, res) {
  try {
    const files = [
      "sample-image-1.jpeg",
      "sample-image-1-same-different-name.jpeg",
      "sample-image-1-different-color.jpeg",
      "sample-image-1-different-size.jpeg",
      "sample-image-2.jpeg",
      "text1.txt",
      "text1-same.txt",
      "text2.txt"
    ];

    // get files checksum
    const processes = files.map(async file => {
      const checksum = await _getFileData(file)
        .then(data => _generateChecksum(data))
        .catch(err => console.log(err));
      return {
        file,
        checksum
      };
    });

    const result = await Promise.all(processes);
    res.write(JSON.stringify(result, null, 2));
  } catch (err) {
    // res.status(500);
    console.error(err);
    res.write("error");
  }
}

/**
 *
 */
function _getFileData(file_name, location = `${BASE_DIR}/files`) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${location}/${file_name}`, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function _generateChecksum(
  data,
  algorithm = "md5",
  digestEncoding = "hex",
  updateEncoding = "utf8"
) {
  return crypto
    .createHash(algorithm)
    .update(data, updateEncoding)
    .digest(digestEncoding);
}
