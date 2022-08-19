window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
var voiceActive = "off";

function upload() {
  var files = document.getElementById('file').files;
  if (files) {
    var file = files[0];
    var fileName = file.name;
    var additional_labels = document.getElementById('tags').value;
    
    var additional_parameters = {
      headers: {
        'Content-Type': file.type,
        'Content-Encoding': 'base64',
        'x-amz-meta-customLabels': additional_labels
      }
    }

    //var url = "https://4a7rxq23t5.execute-api.us-east-1.amazonaws.com/deployAPINoKey/picturesbucketfp/" + fileName
    var url = "https://s3.amazonaws.com/picturesbucketfp/" + fileName

    axios.put(url, file, additional_parameters).then( function(result) {
      console.log(result.data);
    }).catch(function (result) {
      console.log(result.data);
    });
  }
}

function search() {
  
  console.log(document.getElementById("search").value);

  var params = {
      'q': document.getElementById("search").value,
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Headers":"*",
      "Access-Control-Allow-Methods":"*"
  };
  var additionalParams = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':'*',
      'Content-Type': "*"
    }
  }

  var apigClient = apigClientFactory.newClient();
  document.getElementById('photoResults1').innerHTML = "";
  document.getElementById('photoResults2').innerHTML = "";
  document.getElementById('photoResults3').innerHTML = ""

  apigClient.searchGet(params, {}, {})
      .then(function (result) {
          var photos = result['data']['photos'];
          console.log(photos);
          for (n = 0; n < photos.length; n++) {
            console.log(String(n))
            var whichColumn = ((n + 1) % 3);
            if (whichColumn == 0) {
              whichColumn = 3;
            }
            var photoResults = document.getElementById('photoResults' + String(whichColumn));
            var caption = "";
            for (i = 0; i < photos[n][1].length; i++) {
              caption += photos[n][1][i];
              if (i != photos[n][1].length - 1) {
                caption += ", "
              }
            }
            photoResults.innerHTML += '<figure><img src="' + photos[n][0] + '" style="width:100%"><figcaption style="width:100%">' + caption + '</figcaption></figure>';
          }
          
        }).catch(function(result){
          console.log(JSON.stringify(result));
        });
}

function searchVoice() {
  if ('SpeechRecognition' in window) {
    console.log("SpeechRecognition is Working");
  } else {
      console.log("SpeechRecognition is Not Working");
  }
  const recognition = new window.SpeechRecognition();
  var query = document.getElementById("search");
  
  if (voiceActive == "off") {
    recognition.start();
  } else if (voiceActive == "on"){
      recognition.stop();
  }
  recognition.addEventListener("start", function() {
    voiceActive = "on";
    console.log("Recording.....");
  });

  recognition.addEventListener("end", function() {
    console.log("Stopping recording.");
    voiceActive = "off";
  });

  recognition.addEventListener("result", resultOfSpeechRecognition);
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    transcript = event.results[current][0].transcript;
    query.value = transcript;
    console.log("transcript : ", transcript)
  }
}