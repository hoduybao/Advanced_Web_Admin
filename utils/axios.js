import axios from "axios";


const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URI,
});

// Thêm một bộ đón chặn request
instance.interceptors.request.use(
 async function (config) {
    
    // Làm gì đó trước khi request dược gửi đi
    let accessToken = window.localStorage.getItem(
      "token"
    );
    if (accessToken && typeof accessToken === "string") {
    
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      return config;
    } else return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    
    return response.data;
  },
  function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    if(error.response.status===401){
      // const [api] = notification.useNotification();

      // api.error({
      //   message: `Session expired!`,
      //   placement: "topRight",
      // });
      window.localStorage.removeItem("token")
      window.location.reload()
    }
    return error.response.data;
  }
);

export default instance;
