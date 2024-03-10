const userTypeDef = `#graphql
type User{
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String!
    gender: String!
}
type Query{
    users: [User!]
    authUser:User
    user(usedId:ID!):User
}

type Mutation {
    signUp(input:signUpInput!):User
}




`;
