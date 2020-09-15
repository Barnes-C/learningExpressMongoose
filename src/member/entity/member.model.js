const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    status: {
        type: Boolean,
    },
    created: {
        type: Date,
    },
});

// Optimistische Synchronisation durch das Feld __v fuer die Versionsnummer
// memberSchema.plugin(optimistic);

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
// Name des Models = Name der Collection
const MemberModel = model('Members', memberSchema);

module.exports = MemberModel;
