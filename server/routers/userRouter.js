import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {  createUser, getAllUsers, deleteUser, getUserByEmail, updateUser,addFavorite, removeFavorite} from '../queries/userQueries.js';
import passport from 'passport'
import passportConfig from '../middlewares/passport.js'

dotenv.config();
const router = express.Router();
passportConfig(passport);

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

router.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
});

router.get("/auth/user", passport.authenticate("jwt", { session: false }), async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = await getUserByEmail(req.user.email);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/users', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      password: hash,
      firstName,
      lastName
    };

    const userId = await createUser(newUser);
    res.json({ message: 'User registered', userId });

  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.put('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updatedData = req.body;

    const { email: newEmail, password } = updatedData;

    if (newEmail !== email) {
      const existingUser = await getUserByEmail(newEmail);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updatedData.password = hash;
    }

    const modifiedCount = await $(email, updatedData);
    if (modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

router.delete('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const deletedCount = await deleteUser(email);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

router.patch('/users/updateFavorites', async (req, res) => {
    console.log("Received updateFavorites request with body:", req.body);
    console.log("Request headers:", req.headers);
    try {
        console.log("Update favorites request received", req.body);
        const { email, favorites } = req.body;
        const updatedCount = await updateUser(email, { favorites });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Favorites updated' });
    } catch (error) {
        console.error('Error updating favorites:', error);
        res.status(500).json({ message: 'Error updating favorites', error });
    }
});


router.patch('/users/:email/removeFavorite/:projectId', async (req, res) => {
  const { email, projectId } = req.params;

  try {
      const updatedCount = await removeFavorite(email, projectId);
      if (updatedCount === 0) {
          return res.status(404).json({ message: 'Favorite not found or user not updated' });
      }

      res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ message: 'Error removing favorite', error });
  }
});

router.post('/users/addFavorite', passport.authenticate("jwt", { session: false }),async (req, res) => {
  const { email, projectId } = req.body;

  try {
      const updatedCount = await addFavorite(email, projectId);
      if (updatedCount === 0) {
          return res.status(404).json({ message: 'Favorite not added or user not found' });
      }

      res.json({ message: 'Favorite added successfully' });
  } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Error adding favorite', error });
  }
});

export default router;