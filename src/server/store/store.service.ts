import { OpenAIEmbeddings } from '@langchain/openai';
import { qdrant } from '../qdrant';
import { v4 as uuid } from 'uuid';
export interface MetaObject {
  id: string;
  type: string | null;
  name: string | null;
  parent: string | null;
  data: string | null;
}

class StoreService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxConcurrency: 5,
    });
  }

  async storeMeta(chatId: string, metaObjects: MetaObject[]) {
    //console.log('storeMeta', { chatId: metaObjects });

    const collectionName = `chat_meta_objects_${chatId}`;

    const collectionsResult = await qdrant.getCollections();
    const indexed = collectionsResult.collections.find(
      (collection) => collection.name === collectionName,
    );
    if (indexed) return;

    await qdrant.createCollection(collectionName, {
      vectors: { size: 1536, distance: 'Cosine', on_disk: true },
    });

    for (const metaObject of metaObjects) {
      if (!metaObject.data) continue;
      const [embedding] = await this.embeddings.embedDocuments([metaObject.data]);

      const point = {
        id: uuid(),
        payload: {
          collection: collectionName,
          id: metaObject.id,
          name: metaObject.name,
          parent: metaObject.parent,
          type: metaObject.type,
          data: metaObject.data,
        },
        vector: embedding,
      };

      // points.push({
      //   id: metaObject.id,
      //   payload: {
      //     collection: collectionName,
      //     name: metaObject.name,
      //     parent: metaObject.parent,
      //     type: metaObject.type,
      //     data: metaObject.data,
      //   },
      //   vector: embedding,
      // });

      //console.log('added', {id: metaObject.id});


      await qdrant.upsert(collectionName, {
        wait: true,
        batch: {
          ids: [point.id],
          vectors: [point.vector],
          payloads: [point.payload],
        },
      });
    }

    //console.log({upsertData});

//    console.log(`Indexed ${points.length} meta objects`);
  }

  async findMeta(chatId: string, query: string) {
    const collectionName = `chat_meta_objects_${chatId}`;

    const collectionsResult = await qdrant.getCollections();
    const indexed = collectionsResult.collections.find(
      (collection) => collection.name === collectionName,
    );
    if (!indexed) return;

    const [embedding] = await this.embeddings.embedDocuments([query]);

    const result = await qdrant.search(collectionName, {
      vector: embedding,
      //limit: 3,
    });

    console.log({result});

    return result;
  }
}

export default new StoreService();
