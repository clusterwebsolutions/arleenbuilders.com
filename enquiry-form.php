<?php
if ($_GET['send'] == 'enquiry'){
	
	$_name = $_POST['name'];
	$_emailid = $_POST['email'];//
	$_message = $_POST['message'];//
	
	$return_arr = array();
	
	if(empty($_name) || empty($_emailid) || $_name == "Name*" || $_emailid == "Email ID*"){
		$return_arr["msg"] = "* Required fields are missing!";
		$return_arr["frm_check"] = 'error';
	}else if(!filter_var($_emailid, FILTER_VALIDATE_EMAIL)){
		$return_arr["msg"] = "* Enter valid email id";
		$return_arr["frm_check"] = 'error';			
	}else{
		
		//mail function to Support Team
		$ticket_no = md5(microtime().rand());
	$to = "info@arleenbuilders.com";
	$subject = "Enquiry from Arleenbuilders | Ticket No: ".$_name;
	$message = "
		Respected Sir,<br><br>
		<strong>Enquiry Detials:</strong><br>
		Name: ".$_name."
		Email: ".$_emailid."
		Message: ".$_message."
		";
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= 'From: <noreplay@arleenbuilders.com>' . "\r\n";
	
	if(mail($to,$subject,$message,$headers)){
		
/*		$confirm_to = $_emailid;
		$confirm_subject = $mail_sub;
		$confirm_message = $mail_mess;	
		$confirm_headers = "MIME-Version: 1.0" . "\r\n";
		$confirm_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$confirm_headers .= 'From: <noreplay@arleenbuilders.com>' . "\r\n";
		mail($confirm_to,$confirm_subject,$confirm_message,$confirm_headers);*/
		
		$return_arr["msg"] = "Your Enquiry sent successfully. Our Support team will reach you in a short period of time.";
		
	}else{
		$return_arr["msg"] = "Mail Function Note working. Problem with server. Kindly try after few minutes";
		$return_arr["frm_check"] = 'error';
	}
		
		
	}
	echo json_encode($return_arr);
	
}else{
}
?>