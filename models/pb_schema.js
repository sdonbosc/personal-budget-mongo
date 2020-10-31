const mongoose = require("mongoose");

var validation = function (minLength, maxLength) {
    minLength = minLength || 0;
    maxLength = maxLength || Infinity;
    return {
      validator: function (value) {
        if (value === undefined) return true;
        return value.length >= minLength && value.length <= maxLength;
      },
      message: "color should be 6 digit hexa decimal"
    };
  };

const pbSchema = mongoose.Schema({
    Exptype: {
        type: String,
        required: true
        
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        validate:validation(6,7)
    }
},{collection: 'personalbudget'});

module.exports = mongoose.model('personalbudget', pbSchema);