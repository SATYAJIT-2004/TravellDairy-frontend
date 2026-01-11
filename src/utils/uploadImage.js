import axiosInstance from "./axiosInstance"

const uploadImage = async(imageFile) =>{
    const formData = new FormData()

    formData.append("image",imageFile)

    try{
       const response = await axiosInstance.post("/travel-story/image-upload",
        formData,{
            headers:{
                "Content-Type":"multipart/form-data" //set Header for hte file upload 
            },
        }
       )
       return response.data
    }catch(error){
        console.log("Error in uploading the Image")
        throw error //Rethrow error for handling
    }
}

export default uploadImage