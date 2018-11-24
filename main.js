const database = firebase.database();
const auth=firebase.auth();

let userName=$('#userName');
let email=$('#email');
let password=$('#password');

let mgsAuthor;

auth.onAuthStateChanged(function(user) {
	console.log(user)
	if (user) 
	{ // User is signed in.
    	mgsAuthor=user.displayName;
	    if(mgsAuthor==null)
	    	mgsAuthor=userName.val();
        if(user.emailVerified==true)                    // email verified then display chatting section
        {
		    $('.loggedPage').removeClass("hide").addClass("show");
		    $('.loginPage').removeClass("show").addClass("hide");
		}   
		else                    // display login page if user's email is not verifed
		{
			$('.loginPage').removeClass("hide").addClass("show");
	        $('.loggedPage').removeClass("show").addClass("hide");
		} 
    } 
    else 
    {// User is signed out.
	    $('.loginPage').removeClass("hide").addClass("show");
	    $('.loggedPage').removeClass("show").addClass("hide"); 	
    }
});

// Register Button functionality
$('#registerBtn').click(function(){
	const mail=email.val();
	const pass=password.val();
	var promise=auth.createUserWithEmailAndPassword(mail, pass);
	promise.then(function(user) {
          user.sendEmailVerification().then(function() {
            alert("Verification Link Send");
        }, function(error) {
            alert(error.message);
        });
    });
	promise.then(function(user) {        
 		 	return user.updateProfile({displayName: userName.val()});
		});

	promise.catch(function(error) {
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
	if(auth.currentUser.emailVerified==false && email.val()!='')
		alert("Verify Your Email-Id first!!");
	const mail=email.val();
	const pass=password.val();
	auth.signInWithEmailAndPassword(mail, pass).catch(function(error) {
  		if(error.code==='auth/user-not-found')
  		    alert("You need to Register first"); 
  		else 
          if(error.code==='auth/wrong-password')
  		   alert("Try again !! \n Wrong-Password");
  		else
  		   alert(error.message);

	});
});

//Google Sign-in functionality
/*$('#googleBtn').click(function(){
	var provider = new firebase.auth.GoogleAuthProvider();
	auth.signInWithPopup(provider).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  alert(errorMessage);
	});
});*/

//Logout Button Functionality
$('#logoutBtn').click(function(){
	auth.signOut();
});

$('#btn').click(send);
$(document).keypress(send);

function send(e) {
	if(e.keyCode== 13 || e.keyCode==null)
	{
		let mgs=document.getElementById('inputBox').value;
		document.getElementById('inputBox').value="";
		document.getElementsByTagName("INPUT")[0].setAttribute("placeholder", "Enter Message");
		if(mgs!="")	
		{
			database.ref("Chatting").push().set({
				name:mgsAuthor,
				message:mgs
			});
		}	
	}	
}	

database.ref('Chatting').on('value',function(snapshot) {
	    let mgsInfo=snapshot.val();
	    $('#previousMgs').empty();
		for(let key in mgsInfo)
		{
			$('#previousMgs').append(` <p><b>${mgsInfo[key].name} : </b>  ${mgsInfo[key].message}</p> `);	
		} 
		$('html, body').animate({ scrollTop:$(document).height() }, 'fast');       // for automatic scrolling
});

// we can use child_added LISTENER instead of value : child_added at the tym of loading 
//return all the database data then later will return added new child added via push().set(text) without json 


