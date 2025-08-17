console.log("Users frontend javascript file");
$(function() {
    $('.member-status').on('change', async function (e) {
        const id = e.target.id;
        console.log('id: ', id);
        const memberStatus = $(`#${id}.member-status`).val();
        console.log('memberStatus: ', memberStatus);
        try {
            const response = await axios.post(`/admin/user/edit`, {_id: id, memberStatus: memberStatus});
            const result = response.member;
            if(result) {
                console.log("User updated!");
                $(".member-status").blur();
            } else alert("Member update failed!");
        } catch (err) {
            console.log("Error, productStatus: ", err);
        }
    })
});