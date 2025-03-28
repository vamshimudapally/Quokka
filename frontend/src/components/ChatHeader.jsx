import React from 'react'
import { X } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';

const ChatHeader = () => {
    const {selectedUser,setSelectedUser}=useChatStore();
    const {onlineUsers}=useAuthStore();
  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
            {/* Avatar */}
            <div className='avatar'>
                <div className='size-10 rounded-full relative'>
                    <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                </div>
            </div>
{/* users information */}
            <div >
                <h3 className='font-medium'>{selectedUser.fullName}</h3>
                <p>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
            </div>
        </div>
{/* close btn */}

        <button onClick={()=> setSelectedUser(null)} className=' rounded-3xl hover:cursor-pointer'>
            <X/>
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
