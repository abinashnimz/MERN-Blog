import {z} from "zod";

export const signupSchema = z.object({
    username : z
    .string({required_error : "Username must be provided"})
    .trim()
    .min(3, {message : "Username must be between 3 - 20 characters"})
    .max(255, {message : "Username must be between 3 - 20 characters"}),
    email : z
    .string({required_error : "Email must be provided"})
    .trim()
    .email({message : "Invalid email address"}),
    password : z
    .string({required_error : "Password must be provided"})
    .trim()
    .min(6, {message : "Password must be between 6 - 20 characters"})
    .max(255, {message : "Password must be between 6 - 20 characters"})
});