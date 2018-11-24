var database = firebase.database();
var auth=firebase.auth();

var userName=$('#userName');
var email=$('#email');
var password=$('#password');

var mgsAuthor;

auth.onAuthStateChanged(function(user) {
	 if (user) {
    // User is signed in.
    $('.loggedPage').removeClass("hide").addClass("show");
    $('.loginPage').removeClass("show").addClass("hide");

    mgsAuthor=user.displayName;
    if(mgsAuthor==null)
    	mgsAuthor=userName.val();
    
    } else {
    // User is signed out.
    $('.loginPage').removeClass("hide").addClass("show");
    $('.loggedPage').removeClass("show").addClass("hide"); 	
  }
});

// Register Button functionality
$('#registerBtn').click(function(){
	const mail=email.val();
	const pass=password.val();
	auth.createUserWithEmailAndPassword(mail, pass).then(function(user) {         // create account
 		 	return user.updateProfile({displayName: userName.val()});
		}).catch(function(error) {
       // Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		if(errorCode==='auth/email-already-in-use')
  			alert("You are Registered Member \n Try to Login ");
  		else
  			alert(errorMessage);
	});
});




//Login Button functionality
$('#loginBtn').click(function(){
	const mail=email.val();
	const pass=password.val();
	auth.signInWithEmailAndPassword(mail, pass).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		if(errorCode==='auth/user-not-found')
  		    alert("You need to Register first"); 
  		else 
          if(errorCode==='auth/wrong-password')
  		   alert("Try again !! \n Wrong-Password");
  		else
  		   alert(errorMessage)

	});
});


//Logout Button Functionality
$('#logoutBtn').click(function(){
	auth.signOut();
});

$('#btn').click(send);
$(document).keypress(send);

function send(e) {
	if(e.keyCode== 13 || e.keyCode==null)
	{
		var mgs=document.getElementById('inputBox').value;
		document.getElementById('inputBox').value="";
		document.getElementsByTagName("INPUT")[0].setAttribute("placeholder", "Enter Message");
		if(mgs!="")	
		{
			database.ref("Messages").push().set({
				name:mgsAuthor,
				message:mgs
			});
		}	
	}	
}	

database.ref('Messages').on('value',function(snapshot) {
	    var mgsInfo=snapshot.val();
	    $('#previousMgs').empty();
		for(var key in mgsInfo)
		{
			$('#previousMgs').append(` <p><b>${mgsInfo[key].name} : </b>  ${mgsInfo[key].message}</p> `);	
		} 
		$('html, body').animate({ scrollTop:$(document).height() }, 'fast');       // for automatic scrolling
});




