console.log("Signup frontend javascript file");

$(function () {
    const fileTarget = $(".file-box .upload-hidden");
    let filename;

    fileTarget.on("change", function () {
        if(window.FileReader) {
            console.log($(this)[0].files[0]);
            const uploadFile = $(this)[0].files[0],
             fileType = uploadFile["type"],
             validImageType = ["image/jpg", "image/jpeg", "image/png"];
            if(!validImageType.includes(fileType)) {
                alert("Please insert only jpg, jpeg and png!");
            } else {
                if(uploadFile) {
                    console.log(URL.createObjectURL(uploadFile));
                    $(".upload-img-frame").attr("src", URL.createObjectURL(uploadFile)).addClass("success");
                }
                filename = $(this)[0].files[0].name;
            }
            $(this).siblings(".upload-name").val(filename);
        }
    });
});

function validationSignupForm() {
    const memberNick = $(".member-nick").val(),
        memberPhone = $("member-phone").val(),
        memberPassword = $("member-password").val(),
        confirmPassword = $("member-password").val();
    console.log(memberPassword)
    
    if(
        memberNick === "" ||
        memberPhone === "" ||
        memberPassword === "" ||
        confirmPassword === ""
    ) {
        alert('Please insert all required inputs!')
        return false;
    }

    if(memberPassword != confirmPassword) {
        alert('Passwords differ, please check!');
        return false;
    }

    const memberImage = $(".member-image").get(0).files[0] 
        ? $(".member-image").get(0).files[0].name 
        : null;
    if(!memberImage) {
        alert("Please insert restaurant image!");
        return false;
    }


}