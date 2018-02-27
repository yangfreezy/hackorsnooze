$(function() {
    let $form = $(".submit-form");
    let $logIn = $(".log-in");
    let $logInForm = $("#log-in-form");
    let $signUp = $(".sign-up");
    let $signUpForm = $("#sign-up-form");
    let $articleList = $(".article-list");
    let $username = $("#username-sign-up");
    let $passwordSignUp = $("#password-sign-up");
    let $name = $("#name-sign-up");
    let $submitButton = $(".submit-link");
    let $signUpButton = $(".sign-up");
    let $logInButton = $(".log-in");
    let $favoritesButton = $(".favorites-link");
    let $navBar = $(".navbar-nav");
    let $userProfileButton = $(".user-profile");
    let $logOutButton = $(".log-out")
    let loggedIn = false;
    function getLocalStorage() {
        username = localStorage.getItem("username");
        token = localStorage.getItem("token");
    }

    $form.hide();
    $logInForm.hide();
    $signUpForm.hide();
    $submitButton.hide();
    $logOutButton.hide();
    $userProfileButton.hide();
    $favoritesButton.hide();

    let $usernameVal = $("#username");
    let $passwordVal = $("#password");

    // $.ajax({
    //     method: "GET",
    //     url: "https://hack-or-snooze.herokuapp.com/stories"
    // }).then(function(val) {
    //     console.log(val);
    // });

    

    $(".home-link").on("click", function() {
        $form.hide();
        $("li").show();
    });

    $logIn.on("click", function() {
        $logInForm.toggle();
        $form.hide();
        $signUpForm.hide();
    });

    $logInForm.on("submit", function() {
        let token;
        let username;
        $.ajax({
                method: "POST",
                url: "https://hack-or-snooze.herokuapp.com/auth",
                data: {
                    data: {
                        username: $usernameVal.val(),
                        password: $passwordVal.val()
                    }
                }
            })
            .then(function(val) {
                localStorage.setItem("token", val.data.token);
                localStorage.setItem("username", $usernameVal.val());
                username = localStorage.getItem("username");
                $logInForm.get(0).reset();
            })
            .then(function(username) {
                token = localStorage.getItem("token");

                $.ajax({
                    method: "GET",
                    url: "https://hack-or-snooze.herokuapp.com/users/" + $usernameVal.val(),
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(function(val) {
                    var payload = token.split(".")[1];
                    var parsedPayload = JSON.parse(atob(payload));
                    $logInForm.hide();
                    $signUpForm.hide();
                    $submitButton.show();
                    $signUpButton.hide();
                    $logInButton.hide();
                    $favoritesButton.show();
                    // $navBar.append($("<a class='nav-item nav-link user-profile' href='#'>" + parsedPayload.username + "</a>"));
                    $userProfileButton.text(parsedPayload.username);
                    $userProfileButton.show();
                    $logOutButton.show();
                    loggedIn = true;
                });
            });
    });

    $(".sign-up").on("click", function() {
        $signUpForm.toggle();
        $logInForm.hide();
        $form.hide();
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

    $submitButton.on("click", function() {
        $form.toggle();
        $("li").show();
        $logInForm.hide();
        $signUpForm.hide();
    });

    $form.on("submit", function(event) {
        event.preventDefault();

        let title = $("#inputTitle").val();
        let url = $("#inputUrl").val();
        let hostName = $("<a>")
            .prop("href", url)
            .prop("hostname");

        $("ol").append(
            $(
                "<li><span><i class='far fa-star'></i></span><a href=' " +
                url +
                "' target='_blank'> " +
                title +
                " (" +
                hostName +
                ")" +
                "</a></li>"
            )
        );

        $("#inputTitle").val("");
        $("#inputUrl").val("");

        $form.slideUp("slow");
    });

    $("ol").on("click", ".fa-star", function() {
        if (loggedIn) {
            $(this).toggleClass("far fa-star fas fa-star");
            $(this)
                .closest("li")
                .toggleClass("favorited");
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

    $logOutButton.on("click", function() {
        loggedIn = false;
        localStorage.clear();
        payload = null;
        parsedPayload = null;
        $logInButton.show();
        $signUpButton.show();
        $submitButton.hide();
        $favoritesButton.hide();
        $userProfileButton.hide();
        $logOutButton.hide();
    });
});
