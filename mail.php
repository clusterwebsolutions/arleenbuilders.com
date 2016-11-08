<?php
   

	ini_set("sendmail_from", "info@arleenbuilders.com");
	$to = 'info@arleenbuilders.com';
	$subject = "Enquiry Mail";
	$date = date("d-M-Y - h:iA",time());
	$message = '';

	// Always set content-type when sending HTML email
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";
	
	// More headers
	$headers .= 'From: info@arleenbuilders.com' . "\r\n";
	
	if(mail($to,$subject,$message,$headers)){
		echo "Working Fine";
	}else{
		echo "Not Working";
	}

?>

