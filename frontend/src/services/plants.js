import axiosInstance from "../helpers/axios";


const getAll = async () => {
    const response = await axiosInstance.get('/api/plants')
    return response.data
}

export default {
    getAll
}
