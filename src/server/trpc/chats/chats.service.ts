import { v4 as uuid } from 'uuid';

interface Message {
  id: string;
  text: string;
  who: 'system' | 'user';
  createdAt: Date;
}

interface Chat {
  id: string;
  modelUrl?: string;
  messages: Message[];
}

class ChatsService {
  chats: Chat[] = [];

  createOne() {
    const chat: Chat = {
      id: uuid(),
      messages: [],
    };

    this.chats.push(chat);

    return chat;
  }

  getOne(id: string) {
    return this.chats.find((chat) => chat.id === id);
  }

  addMessage(chatId: string, text: string, who: 'system' | 'user') {
    const chat = this.getOne(chatId);

    if (!chat) {
      return;
    }

    chat.messages.push({
      id: uuid(),
      text,
      who,
      createdAt: new Date(),
    });
  }

  deleteMessage(chatId: string, messageId: string) {
    const chat = this.getOne(chatId);

    if (!chat) {
      return;
    }

    chat.messages = chat.messages.filter((message) => message.id !== messageId);
  }

  clearMessages(chatId: string) {
    const chat = this.getOne(chatId);

    if (!chat) {
      return;
    }

    chat.messages = [];
  }
}

export default new ChatsService();
