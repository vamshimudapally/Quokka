
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL= import.meta.env.MODE ==="development" ?  "http://localhost:5001":"/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers:[],
    isCheckingAuth: true,
    socket:null,
  
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
  
        set({ authUser: res.data });
        get().connectSocket();
      } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
          get().connectSocket();
        } 
          catch (error) {
            toast.error(error.response?.data?.message);
          }
        finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket()
        } catch (error) {
          toast.error(error.response?.data?.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          // Call the API to update the profile
          await axiosInstance.put("/auth/update-profile", data);
          
          // Update the local state directly with the data we sent
          // This ensures the UI updates even if the server has issues returning data
          set((state) => ({ 
            authUser: { 
              ...state.authUser, 
              profilePic: data.profilePic
            } 
          }));
          
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in updateProfile:", error);
          
          if (error.response?.status === 500) {
            toast.error("Server error: The image could not be processed. Try a smaller or different image.");
          } else {
            toast.error(error.response?.data?.message || "Error updating profile");
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
          query:{
            userId:authUser._id,
          }
        })
        socket.connect();
        set({socket: socket });
      
      socket.on("getOnlineUsers" , (userIds) =>{
        set({onlineUsers:userIds});
      })
      },

      disconnectSocket:()=>{
        if(get().socket?.connected ) get().socket?.discconect;
      }
      
}));