
$(function(){
	$("#error, #message").css("display","none"); 
	var flag = 0;
	/////
	$("#enquiryform").submit(function(){
		$("#error, #message").css("display","none").html(" "); 
		$("#loading").css("display","block").html(" *validating your request...");
		/////
		$.post("enquiry-form.php?send=enquiry", $("#enquiryform").serialize(),
		function(data){
			$("#loading").css("display","none").html(" ");
			/////
			if(data.frm_check == 'error'){ 
				$("#error").css("display","block").html("Error: " + data.msg); 
				flag = 1;
			} else { 
				$("#message").css("display","block").html("Note: " + data.msg); 
				$("#message").delay("8000").fadeOut("slow");
				$("#enquiryform")[0].reset();
			}
		}, "json");
		
		/////
		if(flag = 1){ return false; }else{ return true; }
	});
});