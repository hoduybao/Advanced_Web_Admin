import axios from "../axios";


class UserService {

    postLogin = async (path, options = {}) => {
        const response = await axios.post(path, options);
        return response;
    };

}
const ApiUser=new UserService();
export default ApiUser;
