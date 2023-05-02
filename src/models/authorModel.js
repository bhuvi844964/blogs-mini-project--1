const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},  
   {timestamps:false}
  
  );

// Define pre-save hook to capitalize the first letter of fname and lname
authorSchema.pre('save', function (next) {
    this.fname = capitalizeFirstLetter(this.fname);
    this.lname = capitalizeFirstLetter(this.lname);
    next();
});

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = mongoose.model('author', authorSchema);





// New: {
//     type: String,
//     default: Date
// }

// {timestamps: {
//     createdAt: 'created_at', 
//     updatedAt: 'updated_at' 
//   }}