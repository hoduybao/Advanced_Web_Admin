import axios from "../axios";


class ClassService {
  
    getListClass =async (path)=>{
        const response = await axios.get(path);
        return response;
    };
    activeClass =async (path)=>{
        const response = await axios.put(path);
        return response;
    };
    

}
const ApiClass=new ClassService();
export default ApiClass;
