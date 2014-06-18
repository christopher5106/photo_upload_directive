#Photo Upload Directive for Web and Mobile Apps (AngularJS)


This directive enables to take a picture, post it to a webservice and execute a callback on the result.

In case of an hybrid app under Cordova, the directive privileges the native camera plugin and file transfer plugin.

Otherwise, it shows the classical input field for files in case of a web app, in order to upload a file.

## Usage

The usage of the directive makes it straight-forward :

```js

<input type="file" file-upload-url="YOUR POST URL" file-callback="callback" />

```

- "YOUR POST URL" is the URL where to post the image

- callback is the function to execute on the result data of the POST.

Have a look at index.html to see an example.


## Install

Install cordova plugins in your cordova project :

```sh
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git

cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git

```
