import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import getXKTFromUrl from '~/utils/viewer/loaders/get-xkt-from-url';
import storeService from '../store/store.service';

interface Message {
  id: string;
  text: string;
  who: 'system' | 'user' | 'ai';
  createdAt: Date;
}

interface Chat {
  id: string;
  llm?: ChatOpenAI;
  modelUrls?: { fileName: string; url: string }[];
  messages: Message[];
  createdAt: Date;
}

class ChatService {
  chats: Chat[] = [];

  constructor() {
    if (fs.existsSync('chats.json')) {
      this.chats = JSON.parse(fs.readFileSync('chats.json', 'utf-8'));
    }
  }

  filterChat(chat: Chat) {
    return {
      id: chat.id,
      messages: chat.messages,
      modelUrls: chat.modelUrls,
      createdAt: chat.createdAt,
    };
  }

  async createOne(xeoUrl: string) {
    const urls = await getXKTFromUrl(xeoUrl);

    if (!urls) {
      return;
    }

    const chat: Chat = {
      id: uuid(),
      modelUrls: urls,

      messages: [],
      createdAt: new Date(),
    };

    this.chats.push(chat);

    fs.writeFileSync('chats.json', JSON.stringify(this.chats, null, 2));

    return chat;
  }

  getOne(id: string) {
    const chat = this.chats.find((chat) => chat.id === id);

    if (!chat) {
      return;
    }

    return this.filterChat(chat);
  }

  async addMessage(chatId: string, text: string, who: Message['who']) {
    const chat = this.chats.find((chat) => chat.id === chatId);

    if (!chat) {
      return;
    }

    const metas = await storeService.findMeta(chatId, text);

    const systemMessageId = uuid();

    if (metas) {
      let result = `
      # Please response in markdown
      # Additional data:\n`;

      for (const meta of metas) {
        result += `${meta.payload?.data}`;
      }


      const systemMessage: Message = {
        id: systemMessageId,
        who: 'system',
        createdAt: new Date(),
        text: result
      };

      chat.messages.push(systemMessage);
    }

    const message: Message = {
      id: uuid(),
      text,
      who,
      createdAt: new Date(),
    };

    chat.messages.push(message);
    await this.chatLLM(chat);

    const systemMessageIndex = chat.messages.findIndex(message => message.id === systemMessageId);

    if (systemMessageIndex >= 0) {
      console.log('Removing ', { systemMessageId });
      //delete chat.messages[systemMessageIndex];
      chat.messages.splice(systemMessageIndex, 1);

      console.log('Messages', { messages: chat.messages});
    }
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

  async chatLLM(chat: Chat) {
    const llmMessages = chat.messages.map((message) => {
      if (message.who === 'system') {
        return new SystemMessage(message.text);
      } else if (message.who === 'ai') {
        return new AIMessage(message.text);
      } else {
        return new HumanMessage(message.text);
      }
    });

    if (!chat.llm) {
      chat.llm = new ChatOpenAI({
        model: 'gpt-4o',
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
    }

    const response = await chat.llm.invoke(llmMessages);
    const aiMessage = response.content.toString();

    chat.messages.push({
      id: uuid(),
      text: aiMessage,
      who: 'ai',
      createdAt: new Date(),
    });

    return aiMessage;
  }
}

export default new ChatService();
