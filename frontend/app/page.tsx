"use client";
import { gql, useQuery } from "@apollo/client";
const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        name
      }
    }
  }
`;
export default function Home() {
  const { data, loading, error } = useQuery(query);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  return (
    <div>
      {data?.getTodos.map((todo) => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
          <p>{todo.user.name}</p>
          <p>{todo.completed ? "Completed" : "Not Completed"}</p>
        </div>
      ))}
    </div>
  );
}
