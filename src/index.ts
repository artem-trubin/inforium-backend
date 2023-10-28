// const { v: uuid } = require('uuid');

import { v4 as uuid } from 'uuid';

// const { ApolloServer } = require('@apollo/server');
// const { startStandaloneServer } = require('@apollo/server/standalone');

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

import { Resolvers } from './generated/graphql';

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

const typeDefs = readFileSync('src/schema.graphql', {encoding: 'utf-8'});

const resolvers: Resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => notes,
    // TODO: fix this
    // findNote: (_, { id }) => notes.find(n => n.id === id),
  },

  Mutation: {
    addNote: (_, args) => {
      const note = { ...args, id: uuid() };
      notes = notes.concat(note);
      return note;
    },
    editNote: (_, args) => {
      const note = notes.find(n => n.id === args.id);
      if (!note) return null;

      const updatedNote = { ...note, text: args.text };
      notes = notes.map(n => n.id === args.id ? updatedNote : n);
      return updatedNote;
    }
  }
};

// TODO: what is this?
interface MyContext {}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
})
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  })
  .catch((error) => {
    console.log(error);
  });
