const BASEURI='https://webback-x353.onrender.com/legalsystem';
const ACCOUNT = '/account/';
const accountUpdate='/accounts/update/';
const PROFILE = '/profile/';

const userId=localStorage.getItem("userId") ?? 0;

export const getAccountData = async () =>{
        const uri=BASEURI+ACCOUNT+userId;
        const response = await fetch(uri,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch Account data");
            }
            else{
                const result=await response.json();
                return result;
            }
    }

export const getProfileData = async () =>{
        const uri=BASEURI+PROFILE+userId;
        const response = await fetch(uri,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch profile data");
            }
            else{
                const result=await response.json();
                return result;
            }
    }

export const updateAccountData = async (data) =>{
    const uri=BASEURI+accountUpdate+userId;
    console.log("Recieved data");
    console.log(data);
    const response = await fetch(uri,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to update Account data");
            }
            else{
                const result=await response.json();
                return result;
            }
}