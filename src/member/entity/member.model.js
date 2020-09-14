const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    _id: {},
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

module.exports = memberSchema;

// Optimistische Synchronisation durch das Feld __v fuer die Versionsnummer
// buchSchema.plugin(optimistic);

// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei buch.check() zu eines TS-Syntaxfehler fuehrt:
// schema.methods.check = () => {...}
// schema.statics.findByTitel =
//     (titel: string, cb: Function) =>
//         return this.find({titel: titel}, cb)

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
// Name des Models = Name der Collection
