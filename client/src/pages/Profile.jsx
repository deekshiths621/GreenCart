import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Profile = () => {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Please login to view your profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">My Profile</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center mb-8">
            <img 
              src={assets.profile_icon} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-2 border-primary"
            />
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">{user.name}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 font-medium">Account ID:</span>
                <span className="text-gray-800 font-mono text-sm">{user._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
