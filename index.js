const { vi: uuid } = require('uuid');

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

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

const typeDefs = `
  type Note {
    text: String!
    id: ID!
  }

  type Query {
    noteCount: Int!
    allNotes: [Note!]!
    findNote(id: String!): Note
  }

  type Mutation {
    addNote(text: String!): Note
    editNote(id: String!, text: String!): Note
  }
`;

const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => notes,
    findNote: (root, args) => notes.find(n => n.id === args.id),
  },

  Mutation: {
    addNote: (root, args) => {
      const note = { ...args, id: uuid() };
      notes = notes.concat(note);
      return note;
    },
    editNote: (root, args) => {
      const note = notes.find(n => n.id === args.id);
      if (!note) return null;

      const updatedNote = { ...note, text: args.text };
      notes = notes.map(n => n.id === args.id ? updatedNote : n);
      return updatedNote;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
