import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';

import { useStore } from '../store/useStore';
import { api } from '../services/api';
import ChatRoom from './chat';

interface RouteParams {
  groupId: string;
}

const SingleGroupBuyPage: React.FC = () => {
  const { user } = useStore();
  const { groupId, name } = useParams<RouteParams>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-medium text-gray-600">
        Loading group details...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="50" round />
          <div>
            <h1 className="text-xl font-semibold">Group Chat</h1>
            <p className="text-sm text-gray-500">Group ID: {groupId}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ChatRoom groupId={groupId} groupName={name} userId={user._id} />
      </div>
    </div>
  );
};

export default SingleGroupBuyPage;
