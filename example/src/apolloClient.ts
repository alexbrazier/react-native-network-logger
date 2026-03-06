import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

const gqlZeroClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphqlzero.almansi.me/api' }),
  cache: new InMemoryCache(),
});

export const getTodos = async () => {
  return gqlZeroClient
    .query({
      query: gql`
        query getTodos {
          todos {
            data {
              id
              title
            }
          }
        }
      `,
    })
    .catch((e: any) => console.log(e.message));
};
