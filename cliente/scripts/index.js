
const btnLogin =document.querySelector('#btn-login');


btnLogin.onclick = function(){

    const InputUsername = document.querySelector('#username')
    const username = InputUsername.value;

    if(username === "admin"){
        document.location = '/cliente/web/adminTools.html';
    }
    else{
        document.location = '/cliente/web/user.html?username=' + encodeURIComponent(username);
    }

}
