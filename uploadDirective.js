
angular.module('myUploadDirective',[])
      //factories
.factory('Cordova', function($q){
        var d= $q.defer();
        if(window.navigator){
          d.resolve(window.navigator);
        }
        else{
          document.addEventListener('deviceready', function(evt){;
            d.resolve(navigator);
          });
        }
        return{
          navigator: function(){
            return d.promise;
          }

        }

      })
.service('fileUpload', ['$http', function ($http) {
          this.uploadFileToUrl = function(file, uploadUrl){
              var fd = new FormData();
              fd.append('fname', file);
              return $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}

              });
          }; //check here
      }])
.directive('fileUploadUrl', ['$parse', 'fileUpload', 'Cordova', function ($parse) {

  function Controller( $scope, $element, $attrs, fileUpload, Cordova ) {
    if(window.cordova)
      $scope.isCordovaApp=true;
    else
      $scope.isCordovaApp=false;

    //will execute when you click search (ng-click)
    $scope.captureImage= function(){

    //if cordova
    if(window.cordova){

    //on device ready
    Cordova.navigator()
      .then(function(navigator){
        navigator.camera.getPicture(onSuccess, onFail, {quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI
        });
    });//end then


    //});//end listener

    //clear camera cache
    function clearCache(){
      navigator.camera.cleanup();
    }

    var retries =0; //number of upload attempts

    //now get image
    function onSuccess(fileURI) {

      //if upload is successful
      var win = function (r) {
            clearCache();
            retries = 0;

        alert("Done")
        .then($scope.$apply($scope.callback(JSON.parse(r.response)) ));
        }

        // function(){   //display result on screen and number of results
        // 		$scope.result= r.response.toString();
        // 		$scope.resultLength= r.response.length;
        // }

      //if upload fails
        var fail = function (error) {
            if (retries == 0) {
                retries ++
                setTimeout(function() {
                    onSucess(fileURI)
                }, 1000)
            } else {
                retries = 0;
                clearCache();
                alert('Something wrong happened!');
            }//end else
        }//end fail

      //upload options
      var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName =  fileURI.substr(fileURI.lastIndexOf('/') + 1); //name of file
        options.mimeType = "image/jpeg";
      options.headers= [{'Content-Type': undefined}];

      options.params = {}; // if we need to send parameters to the server request
        var ft = new FileTransfer();
      alert("Uploading");
        ft.upload(fileURI, encodeURI($scope.uploadUrl), win, fail, options);

    }//end on success

    //if camera fails
    function onFail(message) {
        alert('Failed because: ' + message);
    }

  }//end if cordova view


  //DESKTOP

  //if desktop
  else{
    //upload photo to web

    var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));

        fileUpload.uploadFileToUrl(file, $scope.uploadUrl).success(function(data) {$scope.callback(data);})
        .error(function(status){
          alert("Error: "+status);});

  } // end if desktop view

};//end capture image


                }

          return {
              restrict: 'A',
              controller:Controller,
              scope:{uploadUrl:'@fileUploadUrl', callback:'=fileCallback'},
              link: function(scope, element, attrs) {
                  // var model = $parse(attrs.fileModel);
                  // var modelSetter = model.assign;
                  if(window.cordova) {

                    element.attr("type","button");
                    element.attr("value","Search");
                    element.bind('click', scope.captureImage);

              } else
                  element.bind('change', function(){

                      // scope.$apply(function(){
                      // 		modelSetter(scope, element[0].files[0]);
                      // 	});
                      scope.myFile= element[0].files[0];
                      scope.captureImage()
                    });
                }
            };
      }]);
