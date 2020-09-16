const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
    // MongoDB generates their own index for _id
    _id: { type: String },
    name: { type: String, required: true },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    age: Date,
    active: Boolean,
    timestamps: true,
});

// Optimistische Synchronisation durch das Feld __v fuer die Versionsnummer
// memberSchema.plugin(optimistic);

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
// Name des Models = Name der Collection
const MemberModel = model('Members', memberSchema);

module.exports = MemberModel;
