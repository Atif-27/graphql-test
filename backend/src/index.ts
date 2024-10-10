import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import axios from 'axios';



async function startServer(){
    const app = express();
    const server= new ApolloServer({
        typeDefs:`
            type User{
                id:ID!
                name:String!
                email:String!
                website:String!
            }
            type Todo{
                userId:ID!
                id:ID!
                title:String!
                completed:Boolean!
                user:User   
            }
            type Query{
                getTodos:[Todo]
                getAllUsers:[User]
                getUserById(id:ID!): User
            }
        `,
        resolvers:{
            Todo:{
                user: async(parent)=>(await axios.get(`https://jsonplaceholder.typicode.com/users/${parent?.userId}`)).data
            },
            Query:{
                getTodos:async ()=>{
                    const data=await axios.get('https://jsonplaceholder.typicode.com/todos')
                    return data.data || []; 
                }
                ,
                getAllUsers:async()=>{
                    const data=await axios.get('https://jsonplaceholder.typicode.com/users')
                    return data.data || [];
                },
                getUserById:async(parent,{id})=>{
                    const data=await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
                    return data.data || null;
                }
            }
        },
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    await server.start();
    app.use('/graphql',expressMiddleware(server))
    app.listen(4000,()=>console.log('Server is running on port 4000'));
}

startServer();  