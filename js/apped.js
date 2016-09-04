$(document).ready(function() {

  var featherEditor = new Aviary.Feather({
      apiKey: '1234567',
      theme: 'minimum',
      onSave: function(imageID, newURL) {
          var img = document.getElementById(imageID);
    $(imageID).attr('src', newURL);
    //copy the url to the hidden form field
    $('#newImg').val(newURL);
          img.src = newURL;
      }
  });

  function launchEditor(id, src) {
      featherEditor.launch({
          image: id,
          url: src
      });
      return false;
  };


  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  console.log(document.getElementById("previewImg"));

  var base64 = getBase64Image(document.getElementById("previewImg"));
  $('#previewImg').attr('src', base64).attr('title', 'Click to edit.');
  $('#previewImg').attr('src', base64).attr('title', 'Click to edit.');


  $('#previewImg').on('click', function(e) {
    launchEditor('previewImg', $('#previewImg').attr('src'));
  });

});
