var marketUrl = window.location.host;

function getCookie(name){
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}

function deleteRow(i){
	console.log(i);
    document.getElementById('myTable').deleteRow(i)
}

function addUserToList(){
    var userEmail= document.getElementById('username').value;
    var pwd = document.getElementById('password').value;
    var role = document.getElementById('role').value;

    if(username != "" && pwd != "" && role != "")
    {
        var newRow = document.createElement('tr');
        newRow.innerHTML=
        `<td>${userEmail}</td>`+
        `<td class="hidetext">${pwd}</td>`+
        `<td>${role}</td>`+
        '<td><input type="button" value="Delete" onclick="deleteRow(this.parentNode.parentNode.rowIndex)"></td>';

        var trows = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        trows.appendChild(newRow);

        document.getElementById('username').value = null;
        document.getElementById('password').value = null;
        document.getElementById('role').selectedIndex = 0;
    }
    else
    {
        alert('Please insert some values in username, password and valid role.')
    }
}

function CreateUsersAccount(){
    var trows = Array.from(document.getElementById('myTable').getElementsByTagName('tbody')[0].rows);
    
    if(trows.length > 0)
    {
        trows.forEach(element => {
            let userEmail = element.getElementsByTagName('td')[0].textContent
            let password = element.getElementsByTagName('td')[1].textContent;
            let role = element.getElementsByTagName('td')[2].textContent;
            // console.log(userEmail)
            // console.log(password)
            // console.log(role)

            AddUser(userEmail, password, role);
        });

        CleanTable();
        alert('User(s) created successfully!!');
    }
    else
    {
        alert('Please add some users.');
    }
}

function AddUser(userEmail, password, role){
    var data = {
            "Email": userEmail,
            "Password":password,
            "ConfirmPassword": password
        };

    var settings = {
        "url": "https://"+ marketUrl + "/api/v2/accounts/register",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getCookie('webapitoken')
        },
        "data": JSON.stringify(data),
      };
      
    $.ajax(settings).done(function (response) {
        // console.log(response);
        AddUserRole(response.UserId, role);
        EmailNotification(userEmail);
    });
}

function AddUserRole(userId, role){
    let adminId = document.getElementById('userGuid').value;
    var settings = {
        "url": "https://"+ marketUrl +"/api/v2/admins/"+ adminId +"/users/"+ userId +"/roles/"+ role,
        "method": "PUT",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer "+ getCookie('webapitoken')
        },
      };
      
      $.ajax(settings).done(function (response) {
        // console.log(response);
      });
}

function EmailNotification(userEmail){
    var data = {
        "From": "admin_of@your-marketplace.com",
        "To": userEmail,
        "Body": HtmlBody(),
        "Subject": "Welcome to {{marketplace name}}"
    };

    let adminId = document.getElementById('userGuid').value;
    var settings = {
        "url": "https://"+ marketUrl +"/api/v2/admins/"+ adminId +"/emails",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+ getCookie('webapitoken')
        },
        "data": JSON.stringify(data),
      };
      
      $.ajax(settings).done(function (response) {
        console.log('Email sended.');
      });
}

function HtmlBody(){
    return '<body><div style=\"max-width:700px; width:100%; margin:0 auto; border:1px solid #ddd; color:#999; font-size:16px; font-family:sans-serif; line-height:25px;\"><div style=\"padding:15px;\"><div style=\"text-align:center; margin-bottom:50px;\"><img src=\"{{Logo}}\" style=\"max-width:200px;\" /></div><div><p style=\"color:#000; font-weight:bold; margin-bottom:50px;\">Hi {{ConsumerFirstName}} {{ConsumerLastName}},</p><p>Welcome to marketplace! </p><p>We hope that you enjoy shopping at marketplace as much as we enjoy bringing you new content! </p><p>Your login ID is <a style=\"color:#FF5A60; font-weight:bold; text-decoration:none;\" href=\"mailto:{{ConsumerEmail}}\">{{ConsumerEmail}}</a>.</p></div><div style=\"text-align:center; margin-top:100px; margin-bottom:100px\"><a href=\"{{MarketplaceUrl}}\" style=\"font-size: 18px; background-color: #FF5A60; text-decoration: none; color: #fff; padding:11.5px 30px; border-radius: 50px; width: 180px; display: inline-block;\">START SHOPPING</a></div><div style=\"margin-bottom:50px;\"><p>Regards,<br />{{Marketname}}</p><p><a style=\"color:#FF5A60; font-size:17px; font-weight:bold; text-decoration:none;\" href=\"{{MarketplaceUrl}}\">{{MarketplaceUrl}}</a></p></div></div></div></body>'
}

function CleanTable(){
    var table = document.getElementById("myTable");

    for(var i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }
}