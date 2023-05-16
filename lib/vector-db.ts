import { SortedArray } from './sorted-array'
import { useEffect, useRef } from 'react'

const DB_DEFAUlTS = {
  dbName: 'vectorDB',
  objectStore: 'vectors',
  vectorPath: 'embeddings'
}

interface IndexDBQueryResult {
  key: number
  object: {
    text: string
    embedding: number[]
  }
  similarity: number
}

interface VectorDBOptions {
  dbName?: string
  objectStore?: string
  vectorPath?: string
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, aVal, idx) => sum + aVal * b[idx], 0)
  const aMagnitude = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0))
  const bMagnitude = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0))
  return dotProduct / (aMagnitude * bMagnitude)
}

async function create(options: VectorDBOptions) {
  const { dbName, objectStore, vectorPath } = {
    ...DB_DEFAUlTS,
    ...options
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result
      const store = db.createObjectStore(objectStore, { autoIncrement: true })
      store.createIndex(vectorPath, vectorPath, { unique: false })
      store.createIndex('fileId', 'fileId', { unique: false })
    }

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result)
    }

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error)
    }
  })
}

class VectorDB {
  objectStore
  vectorPath
  db

  constructor(options: VectorDBOptions) {
    const { dbName, objectStore, vectorPath } = {
      ...DB_DEFAUlTS,
      ...options
    }

    if (!dbName) {
      // Note only used in create()
      throw new Error('dbName is required')
    }

    if (!objectStore) {
      throw new Error('objectStore is required')
    }

    if (!vectorPath) {
      throw new Error('vectorPath is required')
    }

    this.objectStore = objectStore
    this.vectorPath = vectorPath

    this.db = create(options)
  }

  async insert(object) {
    if (this.vectorPath in object == false) {
      throw new Error(
        `${this.vectorPath} expected to be present 'object' being inserted`
      )
    }

    if (Array.isArray(object[this.vectorPath]) == false) {
      throw new Error(
        `${this.vectorPath} on 'object' is expected to be an Array`
      )
    }

    const db = await this.db
    const storeName = this.objectStore

    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const request = store.add(object)
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  async list() {
    const db = await this.db
    const storeName = this.objectStore

    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  async getAllFiles(fileId?: string) {
    const db = await this.db
    const storeName = this.objectStore

    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const index = store.index('fileId')

    let request
    if (fileId) {
      request = index.getAll(IDBKeyRange.only(fileId))
    } else {
      request = index.getAll()
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const results = event.target.result
        const grouped = results.reduce((acc, result) => {
          const key = result['fileId']
          if (key in acc == false) {
            acc[key] = []
          }
          acc[key].push(result)
          return acc
        }, {})

        resolve(
          Object.entries(grouped).map(([fileId, results]) => {
            return {
              fileId,
              title: results[0].title,
              date: results[0].date
            }
          })
        )
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  async deleteByFileId(fileId) {
    const db = await this.db
    const storeName = this.objectStore

    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const index = store.index('fileId')

    const request = index.openCursor(IDBKeyRange.only(fileId))
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve(true)
        }
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  async delete(key) {
    if (key == null) {
      throw new Error(`Unable to delete object without a key`)
    }

    const db = await this.db

    const transaction = db.transaction(['fileId'], 'readwrite')
    const store = transaction.objectStore('fileId')

    const request = store.delete(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  async update(key, object) {
    if (key == null) {
      throw new Error(`Unable to update object without a key`)
    }

    if (this.vectorPath in object == false) {
      throw new Error(
        `${this.vectorPath} expected to be present 'object' being updated`
      )
    }

    if (Array.isArray(object[this.vectorPath]) == false) {
      throw new Error(
        `${this.vectorPath} on 'object' is expected to be an Array`
      )
    }

    const db = await this.db
    const storeName = this.objectStore

    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const request = store.put(object, key)

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        reject(event.error)
      }
    })
  }

  // Return the most similar items up to [limit] items
  async query(
    queryVector,
    options = { limit: 10 }
  ): Promise<IndexDBQueryResult[]> {
    const { limit } = options

    const queryVectorLength = queryVector.length

    const db = await this.db
    const storeName = this.objectStore
    const vectorPath = this.vectorPath

    const transaction = db.transaction([storeName], 'readonly')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.openCursor()

    const similarities = new SortedArray(limit, 'similarity')

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          const vectorValue = cursor.value[vectorPath]
          if (vectorValue.length == queryVectorLength) {
            // Only add the vector to the results set if the vector is the same length as query.
            const similarity = cosineSimilarity(queryVector, vectorValue)
            similarities.insert({
              object: cursor.value,
              key: cursor.key,
              similarity
            })
          }
          cursor.continue()
        } else {
          // sorted already.
          resolve(similarities.slice(0, limit))
        }
      }

      request.onerror = (event) => {
        reject(event.target.error)
      }
    })
  }
}

export function useVectorStore(vectorPath: string = 'embeddings') {
  const db = useRef(null)

  useEffect(() => {
    db.current = new VectorDB({
      vectorPath: 'embedding'
    })
  }, [])

  return db.current as VectorDB
}

export { VectorDB }
