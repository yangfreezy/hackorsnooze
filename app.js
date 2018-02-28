$(function() {
    // VARIABLES FOR BUTTONS
    let $logIn = $(".log-in");
    let $submitButton = $(".submit-link");
    let $signUpButton = $(".sign-up");
    let $logInButton = $(".log-in");
    let $favoritesButton = $(".favorites-link");
    let $userProfileButton = $(".user-profile");
    let $logOutButton = $(".log-out");

    // VARIABLES FOR FORMS
    let $form = $(".submit-form");
    let $logInForm = $("#log-in-form");
    let $signUpForm = $("#sign-up-form");

    //VARIABLES FOR ARTICLES
    let $articleList = $(".article-list");
    let $articleOrderedList = $(".article-ol");
    let $username = $("#username-sign-up");
    let $passwordSignUp = $("#password-sign-up");
    let $name = $("#name-sign-up");

    let $userProfileName = $("#user-profile-name");
    let $userProfileUsername = $("#user-profile-username");
    let loggedIn = false;
    let token;
    let username;
    let $usernameVal = $("#username");
    let $passwordVal = $("#password");
    let payload;
    let parsedPayload;
    let $userArticleList = $(".user-article-ol");
    let gotUserStories = 0;

    // HIDE ALL BUTTONS ON START EXCEPT FOR ARTICLES
    $form.hide();
    $logInForm.hide();
    $signUpForm.hide();
    $submitButton.hide();
    $logOutButton.hide();
    $userProfileButton.hide();
    $favoritesButton.hide();
    $userProfileName.hide();
    $userProfileUsername.hide();
    $userArticleList.hide();
    $articleList.show();

    function checkToken() {
        token = localStorage.getItem("token");
        if (token) {
            var payload = token.split(".")[1];
            var parsedPayload = JSON.parse(atob(payload));
            $logInForm.hide();
            $signUpForm.hide();
            $submitButton.show();
            $signUpButton.hide();
            $logInButton.hide();
            $favoritesButton.show();
            $userProfileButton.text(parsedPayload.username);
            $userProfileButton.show();
            $logOutButton.show();
            loggedIn = true;
            $userProfileUsername.text(parsedPayload.username);
            $userProfileName.text(localStorage.getItem("name"));
        }
    }
    checkToken(token);

    var getStories = function getStories() {
        return $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/stories"
        }).then(function(val) {
            for (let i = 0; i < val.data.length; i++) {
                let title = val.data[i].title;
                let author = val.data[i].author;
                let url = val.data[i].url;
                let storyId = val.data[i].storyId;
                let hostNameStory = $("<a>")
                    .prop("href", url)
                    .prop("hostname");

                let storyStr = `
                    <li id= ${storyId}>
                        <span>
                            <i class='far fa-star'></i>
                        </span>
                        <a href=${url}target='_blank'> ${title} by ${author} (${hostNameStory})</a>
                    </li>
                    `;

                $(".article-ol").append($(storyStr));
            }
        });
    };
    getStories();

    function getUserStories() {
        return $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/stories"
        }).then(function(val) {
            token = localStorage.getItem("token");
            var payload = token.split(".")[1];
            var parsedPayload = JSON.parse(atob(payload));
            for (let i = 0; i < val.data.length; i++) {
                if (val.data[i].username === parsedPayload.username) {
                    let title = val.data[i].title;
                    let author = val.data[i].author;
                    let url = val.data[i].url;
                    let storyId = val.data[i].storyId;
                    let hostNameStory = $("<a>")
                        .prop("href", url)
                        .prop("hostname");

                    let str = `
                    <li id= ${storyId}>
                        <span>
                            <i class='far fa-star'></i>
                        </span>
                        <a href=${url}target='_blank'> ${title} by ${author} (${hostNameStory})</a><button class="delete-user-story">X</button>
                    </li>
                    `;

                    $(".user-article-ol").append($(str));
                }
            }
        });
    }

    function createStory() {
        let $title = $("#inputTitle");
        let $author = $("#inputAuthor");
        let $url = $("#inputUrl");
        let token = localStorage.getItem("token");

        return $.ajax({
            method: "POST",
            url: "https://hack-or-snooze.herokuapp.com/stories",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                data: {
                    username: localStorage.getItem("username"),
                    author: $author.val(),
                    title: $title.val(),
                    url: $url.val()
                }
            }
        }).then(function(val) {
            getStories();
        });
    }

    function loginUser() {
        return $.ajax({
            method: "POST",
            url: "https://hack-or-snooze.herokuapp.com/auth",
            data: {
                data: {
                    username: $usernameVal.val(),
                    password: $passwordVal.val()
                }
            }
        }).then(function(val) {
            localStorage.setItem("token", val.data.token);
            localStorage.setItem("username", $usernameVal.val());
            username = localStorage.getItem("username");
            $logInForm.get(0).reset();
        });
    }

    function getUser() {
        token = localStorage.getItem("token");
        return $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/users/" + username,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function(val) {
            localStorage.setItem("name", val.data.name);
            payload = token.split(".")[1];
            parsedPayload = JSON.parse(atob(payload));
            $logInForm.hide();
            $signUpForm.hide();
            $submitButton.show();
            $signUpButton.hide();
            $logInButton.hide();
            $favoritesButton.show();
            $userProfileButton.text(parsedPayload.username);
            $userProfileButton.show();
            $logOutButton.show();
            loggedIn = true;
        });
    }

    // EVENT LISTENERS FOR BUTTONS ON NAV BAR: HOME LINK, LOG IN, SIGN UP, SUBMIT
    $(".home-link").on("click", function() {
        $form.hide();
        $("li").show();
    });

    $logIn.on("click", function() {
        $logInForm.toggle();
        $form.hide();
        $signUpForm.hide();
    });

    $(".sign-up").on("click", function() {
        $signUpForm.toggle();
        $logInForm.hide();
        $form.hide();
    });

    $submitButton.on("click", function() {
        $form.toggle();
        $("li").show();
        $logInForm.hide();
        $signUpForm.hide();
        $userProfileName.hide();
        $userProfileUsername.hide();
    });

    $userProfileButton.on("click", function() {
        checkToken();
        $userProfileUsername.toggle();
        $userProfileName.toggle();
        $form.hide();
        if (gotUserStories === 0) {
            getUserStories();
            gotUserStories++;
        }
        $userProfileButton.toggleClass("user-profile-bold");
        $userArticleList.toggle();
        $articleOrderedList.toggle();

        $userArticleList.on("click", "button", function() {
            checkToken();
            token = localStorage.getItem("token");
            let storyId = $(this)
                .closest("li")
                .attr("id");
            $(this)
                .closest("li")
                .remove();
            return $.ajax({
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                url: "https://hack-or-snooze.herokuapp.com/stories/" + storyId
            }).then(function() {});
        });
    });

    $logOutButton.on("click", function() {
        loggedIn = false;
        localStorage.clear();
        $logInButton.show();
        $signUpButton.show();
        $submitButton.hide();
        $favoritesButton.hide();
        $userProfileButton.hide();
        $logOutButton.hide();
    });

    // EVENT LISTENERS FOR FORMS: LOG IN, SIGN UP, AND SUBMIT NEW STORY
    $logInForm.on("submit", function(val) {
        loginUser().then(function() {
            getUser();
        });
    });

    $signUpForm.on("submit", function() {
        $.ajax({
            method: "POST",
            url: "https://hack-or-snooze.herokuapp.com/users",
            data: {
                data: {
                    name: $name.val(),
                    username: $username.val(),
                    password: $passwordSignUp.val()
                }
            }
        }).then(function(val) {
            localStorage.setItem("username", val.data.username);
            localStorage.setItem("name", val.data.name);
            localStorage.getItem("username");
            localStorage.getItem("name");
        });
        $("#sign-up-form")
            .get(0)
            .reset();
    });

    $form.on("submit", function(event) {
        event.preventDefault();
        createStory();
        $form.slideUp("slow");
        getUserStories();
    });

    // EVENT LISTENER FOR FAVORITE STORIES
    $("ol").on("click", ".fa-star", function() {
        token = localStorage.getItem("token");
        payload = token.split(".")[1];
        parsedPayload = JSON.parse(atob(payload));
        let storyId = $(this)
            .parent()
            .parent()
            .attr("id");
        $(this).toggleClass("far fa-star fas fa-star");
        $(this)
            .closest("li")
            .toggleClass("favorited");

        if (loggedIn) {
            return $.ajax({
                method: "POST",
                data: {
                    data: {
                        username: parsedPayload.username
                    }
                },
                headers: {
                    Authorization: `Bearer ${token}`
                },
                url: "https://hack-or-snooze.herokuapp.com/users/" +
                    parsedPayload.username +
                    "/favorites/" +
                    storyId
            }).then(function(val) {});
        }
    });

    let $favorites = $(".favorites-link");
    $favorites.data("text-original", $favorites.text());
    $favorites.text($favorites.data("text-swap"));

    $favorites.on("click", function() {
        if (loggedIn) {
            $form.hide();
            $("li:not(.favorited)").hide();
            let el = $(this);
            if (el.text() === el.data("text-swap")) {
                el.text(el.data("text-original"));
            } else {
                el.data("text-original", el.text());
                el.text(el.data("text-swap"));
                $("li").show();
            }
        }
    });
});