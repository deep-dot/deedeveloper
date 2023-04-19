const mongoose = require('mongoose');

const QuoteSchema = mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'Plese enter your name.']
    },
    email: { type: String, },
    phone: { type: String, },
    subject: { type: String, },
    message: { type: String, },
    businessName: { type: String, },
    DoyouhaveanexistingWebsite: { type: String, },
    quote2Choices: {
        Howmanypagesyourequire: { type: String, },
        likeGalleryOrPicturespage: { type: String, },
        likeContactOrQuoteForms: { type: String, },
        findbusinessGoogleMap: { type: String, },
    },
    quote3Choices: {
        doyouhaveimagesforyourwebsite: { type: String, },
        Doyouhavecontentforyourwebsite: { type: String, },
    },
});

module.exports = mongoose.model('Quote', QuoteSchema);