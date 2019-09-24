<?php
require_once('upload.php');

$type = array('jpg', 'jpeg', 'png', 'gif');
$path = sprintf('%s/%s/%s/', date('Y'), date('m'), date('d'));

$upload = new App_Util_Upload('file1', 0, $type);
//获取上传信息
$info = $upload->getUploadFileInfo();
$fileName = time() . rand(1000, 9999) . '.' . $info['suffix'];
$fullName = $path . $fileName;	
$path = rtrim('upload', DIRECTORY_SEPARATOR) . '/' . $fullName;
$success = $upload->save($path);
$width = 0;
$height = 0;
if($success) {
	$attr = getimagesize($path);
	$width = $attr[0];
	$height = $attr[1];
}
$msg = $success ? '上传成功' : '上传失败';
echo json_encode(array('result' => $success, 'msg' => $msg, 'src' => $path, 'width' => $width, 'height' => $height, 'path' => $path));
//print_r($success);