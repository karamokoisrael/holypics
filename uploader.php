<?php
    echo "upload started <br/><br/><br/>";
    
      if(!empty($_FILES['uploaded_file']) && array_key_exists("key", $_POST) && array_key_exists("path", $_POST))
  {
      $key = "tfdmhdsus";
      
    if($_POST["key"] != $key OR $_POST["path"]==""){
        die("access denied. go out");
    }  
    
    $path = "/www/wwwroot/".$_POST["path"];
    $path = $path . basename( $_FILES['uploaded_file']['name']);

    if(move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $path)) {
      echo "The file ".  basename( $_FILES['uploaded_file']['name']). 
      " has been uploaded";
    } else{
        echo "There was an error uploading the file, please try again!";
    }
  }else{
      var_dump("post => ", $_POST);
      var_dump("files => ", $_FILES);
      echo "access denied";
  }
  
?>