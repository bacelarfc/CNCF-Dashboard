import { connectToDb, getDb } from "../databases/connection.js";

export async function getUserByEmail(email) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: email });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsers() {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    return users;
  } catch (error) {
    throw error;
  }
}

export async function createUser(user) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const newUser = { ...user, favorites: [] };
    const result = await usersCollection.insertOne(newUser);
    return result.insertedId;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(email, updatedData) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const updateDoc = { $set: {} };
    for (const key in updatedData) {
      updateDoc.$set[key] = updatedData[key];
    }

    const result = await usersCollection.updateOne({ email: email }, updateDoc);
    return result.modifiedCount;
  } catch (error) {
    throw error;
  }
}


export async function deleteUser(email) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({ email: email });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
}


export async function addFavorite(email, projectId) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const result = await usersCollection.updateOne(
      { email: email },
      { $addToSet: { favorites: projectId } }
    );
    return result.modifiedCount;
  } catch (error) {
      throw error;
  }
}


export async function removeFavorite(email, projectId) {
  try {
    await connectToDb();
    const db = getDb();
    const usersCollection = db.collection('users');
    const result = await usersCollection.updateOne(
      { email: email },
      { $pull: { favorites: projectId } } 
    );
    return result.modifiedCount;
  } catch (error) {
      throw error;
  }
}
