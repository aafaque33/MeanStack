$(document).ready(function() {

    var featherEditor = new Aviary.Feather({
        apiKey: '1234567',
        theme:'light',
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

	$('#img').on('change', function(e) {
		//http://stackoverflow.com/a/18457508
		if(this.files && this.files[0]) {

			var reader = new FileReader();

			reader.onload = function (e) {
				$('#previewImg').attr('src', e.target.result).attr('title', 'Click to edit.');
			}

			reader.readAsDataURL(this.files[0]);

			//remove hidden url since they are starting over
			$('#newImg').val('');

		}

	});

	$('#previewImg').on('click', function(e) {
		launchEditor('previewImg', $('#previewImg').attr('src'));
	});

});
