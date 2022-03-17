const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const {userService, conversationService, messageService} = require("../../../services");


/**
 *  @desc   Send a new message specific user_id
 *  @method POST api/v1/messages/:user_id
 *  @access Public
 */
exports.sendInMessage = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    const { author, text, link } = req.body;
    const sender = await userService.getUserByUserId(author)
    const receiver = await userService.getUserByUserId(userId)
    // ******* Check if exist user in mongodb
    let user_sender = null
    let user_receiver = null
    if (!sender) {
        const user = await userService.fetchUserFromUvacancy(author)
        user_sender = await userService.createUser({
            user_id: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.picture_folder + `/medium/` + user.picture_file_name
        });
    }
    if (!receiver) {
        const user = await userService.fetchUserFromUvacancy(userId)
        user_receiver = await userService.createUser({
            user_id: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.picture_folder + `/medium/` + user.picture_file_name
        });
    }
    // Create conversation
    const conversation = await conversationService
        .createConversation(null, user_sender ? user_sender._id : sender._id, [user_receiver ? user_receiver._id : receiver._id, user_sender ? user_sender._id : sender._id])
    // Create message
    const message = await messageService.createMessage({
        conversation_id: conversation._id,
        author: user_sender ? user_sender._id : sender._id,
        text: text,
        link: link,
    })
    // emit socket new message
    global.io.emit("new message", message);
    res.send({message})
});
