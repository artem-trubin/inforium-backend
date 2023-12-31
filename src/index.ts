import { v4 as uuid } from 'uuid';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

import { Resolvers, Note } from './generated/graphql';

let notes : Array<Note> = [
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
    findNote: (_, { id }) => {
      const note = notes.find(n => n.id === id);
      if (!note) return null;
      return note;
    },
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
  listen: { port: 3000 },
})
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  })
  .catch((error) => {
    console.log(error);
  });
