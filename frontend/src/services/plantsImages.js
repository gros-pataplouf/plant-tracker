import axiosInstance from "../helpers/axios";


const getAll = async () => {
    const response = await axiosInstance.get('/api/plants/images')
    return response.data
}

export default {
    getAll
}
