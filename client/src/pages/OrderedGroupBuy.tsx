import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';

export default function OrderedGroupBuy({ isLoading, groupData }) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Group Buys</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupData && groupData.length > 0 ? (
            groupData.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <Avatar 
                        name={data?.name} 
                        src="" 
                        size="60" 
                        round={true} 
                        className="border-2 border-blue-100"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {data?.name || "Untitled Group"}
                      </h3>
                      <p className="text-sm text-gray-500">Admin: {data?.admin || "Unknown"}</p>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      👥 Members: <span className="font-semibold">{data?.members?.length || 0}</span>
                    </p>
                  </div>

                  {/* View Group Button */}
                  <div className="mt-auto">
                    <Link
                      to={`/ordered/group/${data?.name?.toLowerCase().replace(/\s+/g, '-')}/id/${data._id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 text-sm font-medium"
                    >
                      View Group
                    </Link>
                  </div>
                </div>
              </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">No active group buys found</div>
                  Create New Group
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
