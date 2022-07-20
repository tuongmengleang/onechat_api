const Conversation = require("../models/Conversation");
const { userService } = require("./index");
const { admin } = require("../config/firebase");
const config = require("../config/config");
const { decrypt } = require("../utils/crypto");

/**
 * @param text
 * @param author
 * @param conversation_id
 * @returns {Promise<void>}
 */
const pushNotification = async ({ text, author, conversation_id, type }) => {
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    const conversation = await Conversation.findOne({ conversation_id }).populate({
        path: "participants",
        model: "User"
    })
    const participants = conversation.participants
    const participant = participants.find(p => p._id.toString() !== author)
    const user = await userService.getUserById(author);
    // console.log('participant :', participant)

    if (participant.device_token) {
        const message = {
            notification: {
                title: user ? user.full_name : '',
                body: type === 0 ? decrypt(text) : type === 1 ? 'Send Photos' : 'Send Files',
                icon: user ? config.file.uri + user.image : '',
                sound: 'default',
                clickAction: config.cors[0]
            }
        };
        await admin.messaging().sendToDevice(participant.device_token, message, options)
        // .then((resp) => {
        //     console.log('resp :', resp)
        // })
        // .catch((error) => {
        //     console.error('error :', error)
        // })
    }

}

module.exports = {
    pushNotification
}
