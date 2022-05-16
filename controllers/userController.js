
const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
          .then((users) => res.json(users))
          .catch((err) => res.status(500).json(err));
      },
      getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with that ID' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },
      // create a new user
      createUser(req, res) {
        User.create(req.body)
          .then((UserData) => res.json(UserData))
          .catch((err) => res.status(500).json(err));
      },
      updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(user)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
          .then((user) =>
          !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
      },
      createFriend(req, res) {
        User.findOneAndUpdate({_id: req.params.userId}, {$addToSet: { friends: req.params.friendId}}, {runValidators: true, new: true})
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
        res.json(UserData);
        })
        .catch(err => res.json(err));
      },
      deleteFriend(req, res) {
        User.findOneAndUpdate({_id: req.params.userId}, {$pull: { friends: req.params.friendId}}, {new: true})
        .then(UserData => {
            if(!UserData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
            res.json(UserData);
        })
        .catch(err => res.status(400).json(err));
      }
}