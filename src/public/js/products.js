console.log("Products frontend javascript file");


$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();

        if(["T-SHIRT","CAP","SHIRT","JACKET","SWEATER","OTHER"].includes(selectedValue)) {
            $("#product-upside-size").show();
            $("#product-downside-size").hide();
            $("#product-shoes-size").hide();
        } else if (selectedValue === "JEANS") {
            $("#product-downside-size").show();
            $("#product-upside-size").hide();
            $("#product-shoes-size").hide();
        } else if (["SHOES","SNEAKERS"].includes(selectedValue)) {
            $("#product-shoes-size").show();
            $("#product-downside-size").hide();
            $("#product-upside-size").hide();
        }
    });

    $("#process-btn").on('click', () => {
        $(".dish-container").slideToggle('slow');
        $("#process-btn").css("display","none");
    });

    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle('slow');
        $("#process-btn").css("display","flex");
    });

    $(".new-product-status").on('change', async function (e) {
        const id = e.target.id;
        const productStatus = $(`#${id}.new-product-status`).val();

        try{
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
            const result = response.data;
            if(result) {
                console.log("Product updated!");
                $(".new-product-status").blur();
            } else alert("Product update failed!");
        } catch(err) {
            console.log("Error, productStatus: ", err);
        }
    });

    $(".product-size").on('click', () => {
        this.attr('name') = 'productSize';
    });
});

function validateForm() {
    const productName = $(".product-name").val(),
     productPrice = $(".product-price").val(),
     productLeftCount = $(".product-left-count").val(),
     productCollection = $(".product-collection").val(),
     productDesc = $(".product-desc").val(),
     productStatus = $(".product-status").val();


    if (
        productName === "" || 
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === ""
    ) {
            alert("Please insert all required details!");
            return false;
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;

    const file = $(`.${imgClassName}`).get(0).files[0],
     fileType = file["type"],
     validImageType = ["image/jpg", "image/jpeg", "image/png"];
    if(!validImageType.includes(fileType)) {
        alert("Please insert only jpg, jpeg and png!");
    } else {
        if(file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
}