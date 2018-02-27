let $form = $(".submit-form");

$(function() {

    let $logIn = $(".log-in");
    let $logInForm = $("#log-in-form");
    let $signUp = $(".sign-up");
    let $signUpForm = $("#sign-up-form");
    let $articleList = $(".article-list");
    let $username = $("#username").val();
    let $passwordSignUp = $("#password-sign-up").val();
    let $passwordConfirm = $("#confirm-password").val();
    let $email = $("#email").val();


    $form.hide();
    $logInForm.hide();
    $signUpForm.hide();

    $(".home-link").on("click", function() {
        $form.hide();
        $("li").show();
    });

    $logIn.on("click", function() {
        $logInForm.toggle();
        $form.hide();
        $signUpForm.hide();
    })

    $(".sign-up").on("click", function() {
        $signUpForm.toggle();
        $logInForm.hide();
        $form.hide();
    });

    $signUpForm.on("submit", function() {
        console.log($passwordConfirm);
        console.log($email);
        console.log($passwordSignUp !== $passwordConfirm);

        if ($passwordSignUp !== $passwordConfirm) {
            alert("Passwords must match!");
        } else {
        // $.ajax({
        //      method: "POST",
        //      url: "https://hack-or-snooze.herokuapp.com/users",
        //      data: {
        //           data: {
        //             username: $username,
        //             password: $passwordSignUp,
        //             passwordConfirm: $passwordConfirm,
        //             email: $email
        //          }
        //        }
        //     }).then(function(val) {
        //          localStorage.setItem("token", val.data.token);
        // });
        };
    });
    

    $(".submit-link").on("click", function() {
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
        $(this).toggleClass("far fa-star fas fa-star");
        $(this)
            .closest("li")
            .toggleClass("favorited");
    });

    let $favorites = $(".favorites-link");
    $favorites.data("text-original", $favorites.text());
    $favorites.text($favorites.data("text-swap"));

    $favorites.on("click", function() {
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
    });

    

});