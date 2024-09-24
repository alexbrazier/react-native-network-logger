import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const sandboxClient = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

export const getRates = async () => {
  return sandboxClient
    .query({
      query: gql`
        query GetRates {
          rates(currency: "USD") {
            currency
          }
        }
      `,
      fetchPolicy: 'network-only',
    })
    .catch((e: any) => console.log(e.message));
};

const gqlZeroClient = new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api',
  cache: new InMemoryCache(),
});

export const getUser = async () => {
  return gqlZeroClient
    .query({
      query: gql`
        query getUser {
          user(id: 1) {
            id
            name
          }
        }
      `,
    })
    .catch((e: any) => console.log(e.message));
};

export const getHero = async () => {
  return gqlZeroClient
    .query({
      query: gql`
        query getHero {
          hero(class: "Human") {
            health
          }
        }
      `,
    })
    .catch((e: any) => console.log(e.message));
};
