import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
})

const makeRequest = async (url: string, options?: object) => {
  try {
    console.log()

    const result = await api(url, options)

    return result.data
    
  } catch (error) {
    console.log(error)
  }
}

export default makeRequest