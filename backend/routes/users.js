import express from 'express';
import  {getUser, updateUser, deleteUser, getSuggestions, getActivities, getFriends, searchUsers}  from '../controllers/user.js';
const router = express.Router();

router.get('/search', searchUsers);
router.get('/suggestions', getSuggestions);
router.get('/activities', getActivities);
router.get('/friends', getFriends);
router.get('/find/:userId', getUser);
router.put('/', updateUser);
router.delete('/', deleteUser);

export default router;