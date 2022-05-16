
const { User, Thought, } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(ThoughtData => res.json(ThoughtData))
            .catch(err => {
            res.status(500).json(err);
        });
      },
      getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .populate({path: 'reactions',select: '-__v'})
            .select('-__v')
            .then(ThoughtData => {
            if(!ThoughtData) {
            res.status(404).json({message: 'No thought with this ID!'});
            return;
        }
        res.json(ThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
      },
      // create a new thought
      createThought({params, body}, res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate({ _id: params.userId}, {$addToSet: {thoughts: _id}}, {new: true});
        })
        .then(ThoughtsData => {
            if(!ThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(ThoughtsData)
        })
        .catch(err => res.json(err)); 
      },
      updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true })

          .then(ThoughtData => {
              if(!ThoughtData) {
              res.status(404).json({message: 'No thought with this ID!'});
              return;
          }
          res.json(ThoughtData)
          })
          .catch(err => {
              console.log(err);
              res.sendStatus(400);
          });
      },
      deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({message: 'No thought with this ID!'});
                return;
            }
            res.json(ThoughtData);
            })
            .catch(err => res.status(400).json(err));
      },
      createReaction(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$addToSet: { reactions: req.body}}, {runValidators: true, new: true})

        .then(ThoughtData => {
        if (!ThoughtData) {
            res.status(404).json({message: 'No thought with this ID!'});
            return;
        }
        res.json(ThoughtData);
        })
        .catch(err => res.status(500).json(err))
      },
      deleteReaction(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$pull: { reactions: req.params.reactionId}}, {new: true})
        .then(ThoughtData => {
            if(!ThoughtData) {
                res.status(404).json({message: 'No Thought with this ID!'});
                return;
            }
            res.json(ThoughtData);
        })
        .catch(err => res.status(400).json(err));
      }
}