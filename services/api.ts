import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333' //url do back end de auth q está rodando
})