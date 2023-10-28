"use strict";
// const { v: uuid } = require('uuid');
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
// const { ApolloServer } = require('@apollo/server');
// const { startStandaloneServer } = require('@apollo/server/standalone');
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const fs_1 = require("fs");
let notes = [
    {
        text: "This is a super note",
        id: "1"
    },
    {
        text: "This is another super note",
        id: "2"
    },
    {
        text: "This is a best note out there",
        id: "3"
    }
];
const typeDefs = (0, fs_1.readFileSync)('src/schema.graphql', { encoding: 'utf-8' });
const resolvers = {
    Query: {
        noteCount: () => notes.length,
        allNotes: () => notes,
        // TODO: fix this
        // findNote: (_, { id }) => notes.find(n => n.id === id),
    },
    Mutation: {
        addNote: (_, args) => {
            const note = Object.assign(Object.assign({}, args), { id: (0, uuid_1.v4)() });
            notes = notes.concat(note);
            return note;
        },
        editNote: (_, args) => {
            const note = notes.find(n => n.id === args.id);
            if (!note)
                return null;
            const updatedNote = Object.assign(Object.assign({}, note), { text: args.text });
            notes = notes.map(n => n.id === args.id ? updatedNote : n);
            return updatedNote;
        }
    }
};
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
(0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
})
    .then(({ url }) => {
    console.log(`Server ready at ${url}`);
})
    .catch((error) => {
    console.log(error);
});
