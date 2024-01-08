import axios from "../axios";


class AccountService {
  
    getListUsers =async (path)=>{
        const response = await axios.get(path);
        return response;
    };
    getDetailUser=async(path)=>{
        const response = await axios.get(path);
        return response;
    }
    updateInforUser=async(path,options={})=>{
        const response = await axios.put(path,options);
        return response;
    }
    lockAccount=async(path)=>{
        const response = await axios.put(path);
        return response;
    }
    uploadIds=async(path,options={})=>{
        const response = await axios.post(path,options);
        return response;
    }

}
const ApiAccount=new AccountService();
export default ApiAccount;
