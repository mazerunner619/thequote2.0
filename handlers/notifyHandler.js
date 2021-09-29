const db = require('../Models');

const sendNotification = async(senderID, receiverID, message)=>{
    const receiver = await db.Client.findById(receiverID);
    const sender = await db.Client.findById(senderID);
    const noti = `${sender.username} ${message}`;
    const newNotification = await db.Notification.create({
        message : message,
        from : senderID,
        to : receiverID
    });
    receiver.notifications.notification.push(newNotification._id);
    receiver.notifications.unread+=1;
    await receiver.save();
}

module.exports = sendNotification;