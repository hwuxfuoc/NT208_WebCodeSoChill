const Conversation = require('../../models/conversation');
const Message = require('../../models/message');
const Notification = require('../../models/notification');
const User = require('../../models/user');

const formatTime = (date) => {
  if (!date) return '';
  return date.toISOString();
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('participants', 'displayname avatarUrl');

    const results = conversations.map((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user.id
      );
      const other = otherParticipants[0] || conversation.participants[0];
      return {
        id: conversation._id,
        name: other?.displayname || 'Unknown',
        avatar: other?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.displayname || 'User')}`,
        online: false,
        last: conversation.lastMessage || 'No messages yet',
        time: formatTime(conversation.updatedAt),
      };
    });

    res.json({ conversations: results });
  } catch (err) {
    console.error('[messages] getConversations error', err);
    res.status(500).json({ message: 'Lỗi khi tải hội thoại' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Không có quyền xem cuộc trò chuyện này' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'displayname avatarUrl');

    const items = messages.map((message) => ({
      id: message._id,
      me: message.sender._id.toString() === req.user.id,
      text: message.text,
      time: formatTime(message.createdAt),
      sender: {
        name: message.sender.displayname,
        avatar: message.sender.avatarUrl,
      },
    }));

    res.json({ messages: items });
  } catch (err) {
    console.error('[messages] getMessages error', err);
    res.status(500).json({ message: 'Lỗi khi tải tin nhắn' });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const participantId = req.body.participantId;
    if (!participantId) {
      return res.status(400).json({ message: 'participantId là bắt buộc' });
    }

    if (participantId === req.user.id) {
      return res.status(400).json({ message: 'Không thể chat với chính mình' });
    }

    const participant = await User.findById(participantId).select('displayname avatarUrl');
    if (!participant) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, participantId],
        lastMessage: '',
      });
      await conversation.save();
    }

    res.status(201).json({
      conversation: {
        id: conversation._id,
        name: participant.displayname || participant.username || 'Unknown',
        avatar: participant.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.displayname || 'User')}`,
        online: false,
        last: conversation.lastMessage || 'No messages yet',
        time: formatTime(conversation.updatedAt),
      }
    });
  } catch (err) {
    console.error('[messages] createConversation error', err);
    res.status(500).json({ message: 'Lỗi khi tạo cuộc trò chuyện' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Tin nhắn không được để trống' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Không có quyền gửi tin nhắn vào cuộc trò chuyện này' });
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user.id,
      text: text.trim(),
    });
    await message.save();

    conversation.lastMessage = message.text;
    await conversation.save();

    const recipientId = conversation.participants.find(
      (participant) => participant.toString() !== req.user.id
    );
    if (recipientId) {
      await Notification.create({
        userId: recipientId,
        type: 'general',
        title: 'Tin nhắn mới',
        message: 'Bạn có một tin nhắn mới.',
        link: `/messages/${conversation._id}`,
      });
    }

    res.status(201).json({
      message: {
        id: message._id,
        me: true,
        text: message.text,
        time: formatTime(message.createdAt),
      },
    });
  } catch (err) {
    console.error('[messages] sendMessage error', err);
    res.status(500).json({ message: 'Lỗi khi gửi tin nhắn' });
  }
};
