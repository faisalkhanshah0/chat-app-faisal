

var generateMessage = (from, text, createdAt) => {
  var message = {
    from,
    text, 
    createdAt 
  }
  return message;
}

var generateLocation = (from, url, createdAt) => {
  var location = {
    from,
    url, 
    createdAt 
  }
  return location;
}

module.exports = {
    generateMessage,
    generateLocation
};