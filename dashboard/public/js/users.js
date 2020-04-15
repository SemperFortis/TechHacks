window.onload = () => {
    let access_token = getCookie("access_token") || "None";
    let token_type = getCookie("token_type") || "None";

    for (i in allUsers) {

        if (i >= 20) break; // Only display 20 users.

        let box = document.getElementById('box');
        let split = document.createElement('div');

        split.className = 'split';

        let users = document.createElement('div');
        users.className = 'users';
        console.log(allUsers)

        let avatar = document.createElement('div');
        avatar.className = 'userBoxImg usersAvatarHolder';
        avatar.style.backgroundImage = `url(${allUsers[i].avatar}`;

        let username = document.createElement('div');
        //-5 for discrim
        if (allUsers[i].username.length - 5 > 15) username.style.fontSize = '10px';
        else username.style.fontSize = '18px';
        username.style.marginTop = '15px';
        let t = document.createTextNode(allUsers[i].username);
        username.appendChild(t);
        username.className = 'userBoxName';

        let xp = document.createElement('div');
        let xpt = document.createTextNode("XP: " + allUsers[i].xp);
        xp.style.marginTop = '7px';
        xp.style.fontSize = '14px';
        xp.className = 'userBoxName'
        xp.appendChild(xpt)

        let lvl = document.createElement('div');
        let lvlt = document.createTextNode("Level: " + Math.floor(allUsers[i].xp / 500));
        lvl.style.marginTop = '7px';
        lvl.style.fontSize = '14px';
        lvl.className = 'userBoxName'
        lvl.appendChild(lvlt)
        split.appendChild(users);
        users.appendChild(avatar);
        users.appendChild(username);
        users.appendChild(xp);
        users.appendChild(lvl);
        box.appendChild(split);
    }

    // avatar.

    if (access_token == "None") {
        document.getElementById('show_discord').innerText = 'Login!'
    } else {
        fetch('https://discordapp.com/api/users/@me', {
                headers: {
                    authorization: `${token_type} ${access_token}`
                }
            })
            .then(res => res.json())
            .then(response => {
                setAvatar(response)
            });
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function determineDiscordPFP(num, id) {
    if (!id) {
        if (num == 0 || num == 5) return avatars[0];
        else if (num == 1 || num == 6) return avatars[1];
        else if (num == 2 || num == 7) return avatars[2];
        else if (num == 3 || num == 8) return avatars[4];
        else if (num == 4 || num == 9) return avatars[5];
    } else return `https://cdn.discordapp.com/avatars/${id}/${num}.webp`;
}

function setAvatar(response) {
    let show_discord = document.getElementById('show_discord')
    let avatar;
    if (!response.avatar) avatar = determineDiscordPFP(response.discriminator.slice(-1),
        null);
    else avatar = determineDiscordPFP(response.avatar, response.id);
    show_discord.innerHTML = `<div class='avatarContainer'><div class='relative'><div class='avatarTextContainer' href='/settings'>${response.username}</div><img class="avatarHolder" src=${avatar}></div></div>`;
}



