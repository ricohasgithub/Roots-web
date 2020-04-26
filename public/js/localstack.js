
document.getElementById('signin-button').addEventListener('click', function() {
   blockstack.redirectToSignIn("https://cocky-panini-0ad02c.netlify.app/community.html")
})

function showProfile(profile) {
   var person = new blockstack.Person(profile)
   document.getElementById('heading-name').innerHTML = person.name()
   document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
   document.getElementById('section-1').style.display = 'none'
   document.getElementById('section-2').style.display = 'block'
 }

 if (blockstack.isUserSignedIn()) {
  const userData = blockstack.loadUserData()
   showProfile(userData.profile)
 } else if (blockstack.isSignInPending()) {
   blockstack.handlePendingSignIn()
   .then(userData => {
     showProfile(userData.profile)
   })
 }
