import logo from './logo.svg';
import './App.css';
import Homepage from './components/Homepage';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
  opts: {
    mode: 'cors',
  }
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const token = localStorage.getItem("id_token")

function App() {
  return (
    <div>
      <ApolloProvider client={client}>
        <Homepage />
      </ApolloProvider>
    </div>
  );
}

export default App;
