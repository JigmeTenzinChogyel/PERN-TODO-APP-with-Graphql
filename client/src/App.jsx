import { RecoilRoot } from 'recoil'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error"
import Todo from "./components/Todo";
import TodoForm from "./components/TodoForm";

const errorLink = onError(({ graphqlErrors, networkError}) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    })
  }
})
const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:5000/graphql"}),
])
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
})

function App() {

  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <div>
          <h1>Never Miss Anything!</h1>
          <TodoForm />
          <Todo />
        </div>
      </RecoilRoot>
    </ApolloProvider>
  )
}

export default App
