require('dotenv').config();
const mongoose = require('mongoose');
/*Connect to my Atlas database*/
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*Define person schema*/
const { Schema } = mongoose;

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

/*create person model from person schema*/
const Person = mongoose.model('Person', personSchema);

/*Create new instance of person model and save to database*/
const person = new Person({
    name: 'John Doe',
    age: 25,
    favoriteFoods: ['Pizza', 'Burger']
  });
  
  person.save(function(err, data) {
    if (err) return console.error(err);
    console.log('Person saved successfully:', data);
  });

  /*Create Many records with model.create()*/
  const arrayOfPeople = [
    { name: 'Alice', age: 30, favoriteFoods: ['Sushi', 'Pasta'] },
    { name: 'Bob', age: 35, favoriteFoods: ['Burger', 'Ice Cream'] },
    { name: 'Charlie', age: 40, favoriteFoods: ['Steak', 'Salad'] }
  ];

  Person.create(arrayOfPeople, function(err, people) {
    if (err) return console.error(err);
    console.log('Multiple people saved successfully:', people);
  });

/*use model.find() to search for given name*/
  Person.find({ name: 'Abiodun' }, function(err, people) {
  if (err) return console.error(err);
  console.log('People with name "Abiodun":', people);
});

/*Use model.findOne() to Return a Single Matching Document*/
const food = 'Pizza';

Person.findOne({ favoriteFoods: food }, function(err, person) {
  if (err) return console.error(err);
  console.log(`Person with favorite food "${food}":`, person);
});

/*Use model.findById() to Search Your Database By _id*/
const personId = 'your-person-id';

Person.findById(personId, function(err, person) {
  if (err) return console.error(err);
  console.log('Person found by ID:', person);
});

/*Perform Classic Updates by Running Find, Edit, then Save*/
const newFavoriteFood = 'Hamburger';

Person.findById(personId, function(err, person) {
  if (err) return console.error(err);

  person.favoriteFoods.push(newFavoriteFood);

  person.save(function(err, updatedPerson) {
    if (err) return console.error(err);
    console.log('Person updated successfully:', updatedPerson);
  });
});


/*Perform New Updates on a Document Using model.findOneAndUpdate()*/
const personName = 'Alice';

Person.findOneAndUpdate(
  { name: personName },
  { age: 20 },
  { new: true },
  function(err, updatedPerson) {
    if (err) return console.error(err);
    console.log('Person updated successfully:', updatedPerson);
  }
);

/*Delete One Document Using model.findByIdAndRemove*/
Person.findByIdAndRemove(personId, function(err, removedPerson) {
  if (err) return console.error(err);
  console.log('Person removed successfully:', removedPerson);
});

/*Delete Many Documents with model.remove()*/
const name = 'Mary';

Person.remove({ name: name }, function(err, result) {
  if (err) return console.error(err);
  console.log(`${result.deletedCount} people named "${name}" were removed.`);
});

/*Chain Search Query Helpers to Narrow Search Results*/
Person.find({ favoriteFoods: 'burritos' })
  .sort('name')
  .limit(2)
  .select('-age')
  .exec(function(err, data) {
    if (err) return console.error(err);
    console.log('Filtered search results:', data);
  });