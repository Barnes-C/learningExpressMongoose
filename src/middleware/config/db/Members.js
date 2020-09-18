const members = [
    {
        id: 1,
        name: 'Kevin',
        password: 'rofl!123',
        status: 'active',
    },
    {
        id: 2,
        name: 'Atha',
        password: 'Atha123',
        status: 'inactive',
    },
    {
        id: 3,
        name: 'Flo',
        password: 'daydee',
        status: 'active',
    },
];

module.exports = members;
// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei buch.check() zu eines TS-Syntaxfehler fuehrt:
// schema.methods.check = () => {...}
// schema.statics.findByTitel =
//     (titel: string, cb: Function) =>
//         return this.find({titel: titel}, cb)

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
// Name des Models = Name der Collection
